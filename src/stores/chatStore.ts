import { create } from 'zustand'
import { Message, ChatError } from '@/types/chat'
// Avoid importing Prisma types in client code

interface ChatState {
  messages: Message[]
  isStreaming: boolean
  error: ChatError | null
  abortController: AbortController | null
  currentConversationId: string | null
  currentModel: string
  tokenUsage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  // Actions
  sendMessage: (content: string, conversationId: string) => Promise<void>
  stopStreaming: () => void
  regenerateLastResponse: () => Promise<void>
  clearError: () => void
  setMessages: (messages: any[]) => void
  setCurrentConversation: (id: string | null) => void
  setCurrentModel: (model: string) => void
  updateTokenUsage: (usage: { promptTokens: number; completionTokens: number; totalTokens: number }) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  error: null,
  abortController: null,
  currentConversationId: null,
  currentModel: 'gpt-4o-mini',
  tokenUsage: {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  },

  sendMessage: async (content: string, conversationId: string) => {
    const { isStreaming } = get()
    if (isStreaming) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    }

    set({
      messages: [...get().messages, userMessage, assistantMessage],
      isStreaming: true,
      error: null,
      currentConversationId: conversationId,
    })

    const abortController = new AbortController()
    set({ abortController })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...get().messages.filter(m => m.role !== 'assistant' || m.content), userMessage],
          conversationId,
          model: get().currentModel,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('Content-Type') || ''

      // 비스트리밍 응답 (JSON)
      if (contentType.includes('application/json')) {
        const data = await response.json()
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: data.content }
              : msg
          ),
        }))
      } else {
        // 스트리밍 응답
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          // toTextStreamResponse() returns plain text, not prefixed data
          const text = decoder.decode(value, { stream: true })

          // Directly append the received text to the assistant message
          if (text) {
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: msg.content + text }
                  : msg
              ),
            }))
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User aborted the request
      } else if (error instanceof Error && error.message.includes('401')) {
        set({
          error: {
            type: 'apiError',
            message: '인증이 필요합니다. 다시 로그인해 주세요.',
          },
        })
      } else if (error instanceof Error && error.message.includes('429')) {
        set({
          error: {
            type: 'rateLimit',
            message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
            retryAfter: 60,
          },
        })
      } else if (error instanceof Error && error.message.includes('413')) {
        set({
          error: {
            type: 'contextLength',
            message: '메시지가 너무 깁니다. 메시지를 줄여주세요.',
          },
        })
      } else {
        set({
          error: {
            type: 'network',
            message: '네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.',
          },
        })
      }
    } finally {
      set({
        isStreaming: false,
        abortController: null,
      })
    }
  },

  stopStreaming: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
      set({ isStreaming: false, abortController: null })
    }
  },

  regenerateLastResponse: async () => {
    const { messages } = get()
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()

    if (!lastUserMessage) return

    // Remove the last assistant response and regenerate
    const newMessages = messages.slice(0, -1)
    set({ messages: newMessages })

    await get().sendMessage(lastUserMessage.content, get().currentConversationId!)
  },

  clearError: () => set({ error: null }),

  setMessages: (messages) => {
    // Convert Prisma messages to store messages
    const convertedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      tokens: msg.tokens || undefined,
      history: msg.history as any || undefined,
      context: msg.context as any || undefined,
      createdAt: new Date(msg.createdAt),
    }))
    set({ messages: convertedMessages })
  },

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  setCurrentModel: (model) => set({ currentModel: model }),

  updateTokenUsage: (usage) => set({ tokenUsage: usage }),
}))
