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
  // Actions
  sendMessage: (content: string, conversationId: string | null, images?: string[]) => Promise<string | null>
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

  sendMessage: async (content: string, conversationId: string | null, images?: string[]) => {
    const { isStreaming } = get()
    if (isStreaming) return null

    const messageContent = images && images.length > 0
      ? [
        { type: 'text' as const, text: content },
        ...images.map(img => ({ type: 'image_url' as const, image_url: { url: img } }))
      ]
      : content

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      createdAt: new Date(),
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    }

    // 1. Optimistic UI Update: Show messages immediately
    set({
      messages: [...get().messages, userMessage, assistantMessage],
      isStreaming: true,
      error: null,
      currentConversationId: conversationId,
    })

    const abortController = new AbortController()
    set({ abortController })

    let activeConversationId = conversationId

    // 2. Create conversation if it doesn't exist (Must await this to get ID)
    if (!activeConversationId) {
      try {
        const createResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: content.slice(0, 30),
            model: get().currentModel,
          }),
        })

        if (!createResponse.ok) {
          throw new Error('Failed to create conversation')
        }

        const newConversation = await createResponse.json()
        activeConversationId = newConversation.id
        set({ currentConversationId: activeConversationId })
      } catch (error) {
        console.error('Failed to create conversation:', error)
        set({
          isStreaming: false,
          error: { type: 'network', message: '대화방 생성에 실패했습니다.' }
        })
        return null
      }
    }

    // 3. Send Message (Background / Fire-and-Forget)
    // We do NOT await this. We return the ID immediately so navigation happens now.
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...get().messages.filter(m => m.id !== userMessage.id && m.id !== assistantMessage.id && (m.role !== 'assistant' || m.content)), userMessage],
        conversationId: activeConversationId,
        model: get().currentModel,
      }),
      signal: abortController.signal,
    }).then(async (response) => {
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
        // 스트리밍 응답 (Raw Text Stream)
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          // toTextStreamResponse()는 raw text를 보냅니다.
          const text = decoder.decode(value, { stream: true })

          if (text) {
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: (typeof msg.content === 'string' ? msg.content : '') + text }
                  : msg
              ),
            }))
          }
        }
      }
    }).catch((error) => {
      if (error instanceof Error && error.name === 'AbortError') {
        // User aborted
      } else if (error instanceof Error && error.message.includes('401')) {
        set({ error: { type: 'apiError', message: '인증이 필요합니다. 다시 로그인해 주세요.' } })
      } else if (error instanceof Error && error.message.includes('429')) {
        set({ error: { type: 'rateLimit', message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', retryAfter: 60 } })
      } else if (error instanceof Error && error.message.includes('413')) {
        set({ error: { type: 'contextLength', message: '메시지가 너무 깁니다. 메시지를 줄여주세요.' } })
      } else {
        set({ error: { type: 'network', message: '네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.' } })
      }
    }).finally(() => {
      set({
        isStreaming: false,
        abortController: null,
      })
    })

    // Return the ID immediately to allow navigation
    return activeConversationId
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

    const content = lastUserMessage.content
    if (typeof content === 'string') {
      await get().sendMessage(content, get().currentConversationId!)
    } else {
      const textPart = content.find(p => p.type === 'text')
      const imageParts = content.filter(p => p.type === 'image_url')

      const text = textPart?.text || ''
      const images = imageParts.map(p => p.image_url?.url).filter(Boolean) as string[]

      await get().sendMessage(text, get().currentConversationId!, images)
    }
  },

  clearError: () => set({ error: null }),

  setMessages: (messages) => {
    // Convert Prisma messages to store messages
    const convertedMessages = messages.map(msg => {
      let content = msg.content;

      // JSON 형식의 멀티모달 콘텐츠 파싱 시도
      if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) || typeof parsed === 'object') {
            content = parsed;
          }
        } catch (e) {
          // 파싱 실패 시 원본 문자열 사용
        }
      }

      return {
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: content,
        tokens: msg.tokens || undefined,
        history: msg.history as any || undefined,
        context: msg.context as any || undefined,
        createdAt: new Date(msg.createdAt),
      };
    })
    set({ messages: convertedMessages })
  },

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  setCurrentModel: (model) => set({ currentModel: model }),

  updateTokenUsage: (usage) => set({ tokenUsage: usage }),
}))
