import { create } from 'zustand'
import { Message, ChatError } from '@/types/chat'
// Avoid importing Prisma types in client code

interface ChatState {
  messages: Message[]  // 모든 메시지 (트리 전체)
  selectedPaths: Record<string, string>  // { parentMessageId: selectedChildId }
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
  editingMessageId: string | null
  editingContent: string

  // Actions
  sendMessage: (content: string, conversationId: string | null, images?: string[]) => Promise<string | null>
  stopStreaming: () => void
  regenerateLastResponse: () => Promise<void>
  clearError: () => void
  setMessages: (messages: any[]) => void
  setSelectedPaths: (paths: Record<string, string>) => void // v2.1: 초기화용
  setCurrentConversation: (id: string | null) => void
  setCurrentModel: (model: string) => void
  updateTokenUsage: (usage: { promptTokens: number; completionTokens: number; totalTokens: number }) => void

  // 메시지 수정/브랜치 관련 (트리 구조)
  editMessage: (messageId: string, newContent: string) => Promise<void>
  selectBranch: (parentMessageId: string | null, childId: string) => void  // 브랜치 선택
  setEditingMessage: (messageId: string | null, content?: string) => void

  // 트리 유틸리티
  buildMessageChain: () => Message[]  // 현재 선택된 경로의 메시지들
  getSiblings: (messageId: string) => { siblings: Message[], currentIndex: number }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  selectedPaths: {},  // { parentMessageId: selectedChildId }
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
  editingMessageId: null,
  editingContent: '',

  // ... (sendMessage and other actions)

  setSelectedPaths: (paths) => set({ selectedPaths: paths }),

  // 브랜치 선택 (분기점에서 경로 변경)
  selectBranch: (parentMessageId, childId) => {
    set((state) => ({
      selectedPaths: {
        ...state.selectedPaths,
        [parentMessageId ?? 'root']: childId
      }
    }))

    // v2.1: API에 변경 사항 저장 (Optimistic update, fire-and-forget)
    const { currentConversationId, selectedPaths } = get()
    if (currentConversationId) {
      // 바뀐 것만 보낼지 전체를 보낼지? PATCH는 selectedPaths 전체를 덮어씀 (단순화)
      fetch(`/api/conversations/${currentConversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedPaths: get().selectedPaths // 최신 상태 전송
        })
      }).catch(err => console.error('Failed to persist branch selection:', err))
    }
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

    // 트리 구조: 부모 메시지 ID 계산 (현재 경로의 마지막 메시지)
    const chain = get().buildMessageChain()
    const lastMessageInChain = chain.length > 0 ? chain[chain.length - 1] : null
    const parentMessageId = lastMessageInChain?.id || null

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      parentMessageId,
      createdAt: new Date(),
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      parentMessageId: userMessage.id,  // user 메시지를 부모로
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

    /**
     * [메시지 전송 - Fire-and-Forget 패턴]
     * 
     * ⚠️ 중요: 이 fetch는 의도적으로 await하지 않습니다!
     * 
     * 이유:
     * 1. UX 최적화: 대화방 생성 즉시 해당 페이지로 이동하여 사용자가 기다리지 않게 함
     * 2. 스트리밍 응답이 백그라운드에서 처리되면서 실시간으로 UI에 표시됨
     * 3. 응답을 기다리면 긴 AI 응답 시간 동안 사용자가 빈 화면을 보게 됨
     * 
     * 🚫 이 fetch에 await를 추가하면:
     * - 페이지 이동이 AI 응답이 완료될 때까지 지연됨
     * - 사용자가 "안녕"을 입력하고 5-10초 동안 아무 변화 없이 기다려야 함
     * - 스트리밍의 의미가 사라짐
     * 
     * 이 코드는 수정하지 않아도 됩니다. 현재 패턴이 최적의 UX를 제공합니다.
     * 스트리밍 응답이 보이지 않는 문제는 ChatArea.tsx의 useEffect에서 해결합니다.
     */
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...get().messages.filter(m => m.id !== userMessage.id && m.id !== assistantMessage.id && (m.role !== 'assistant' || m.content)), userMessage],
        conversationId: activeConversationId,
        model: get().currentModel,
        parentMessageId,  // 트리 구조를 위한 부모 메시지 ID
      }),
      signal: abortController.signal,
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // DB에서 생성된 실제 메시지 ID로 클라이언트 상태 동기화
      const dbUserMessageId = response.headers.get('X-User-Message-Id')
      if (dbUserMessageId) {
        set((state) => {
          const newSelectedPaths = { ...state.selectedPaths }

          // Update selectedPaths where userMessage was the selected child
          const parentKey = userMessage.parentMessageId ?? 'root'
          if (newSelectedPaths[parentKey] === userMessage.id) {
            newSelectedPaths[parentKey] = dbUserMessageId
          }

          // Update selectedPaths where userMessage was the parent key
          if (newSelectedPaths[userMessage.id]) {
            newSelectedPaths[dbUserMessageId] = newSelectedPaths[userMessage.id]
            delete newSelectedPaths[userMessage.id]
          }

          return {
            messages: state.messages.map((msg) => {
              if (msg.id === userMessage.id) return { ...msg, id: dbUserMessageId }
              if (msg.parentMessageId === userMessage.id) return { ...msg, parentMessageId: dbUserMessageId }
              return msg
            }),
            selectedPaths: newSelectedPaths
          }
        })
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
        parentMessageId: msg.parentMessageId || null,  // 트리 구조용
        history: msg.history as any || undefined,
        context: msg.context as any || undefined,
        createdAt: new Date(msg.createdAt),
      };
    })
    set({ messages: convertedMessages, selectedPaths: {} })  // 경로 초기화
  },

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  setCurrentModel: (model) => set({ currentModel: model }),

  updateTokenUsage: (usage) => set({ tokenUsage: usage }),

  setEditingMessage: (messageId, content = '') => {
    set({ editingMessageId: messageId, editingContent: content })
  },



  // 현재 선택된 경로에 따른 메시지 체인 빌드
  buildMessageChain: () => {
    const { messages, selectedPaths } = get()
    const chain: Message[] = []

    // 루트 메시지 찾기 (parentMessageId가 null인 메시지들)
    const rootMessages = messages.filter(m => !m.parentMessageId)
    if (rootMessages.length === 0) return chain

    // 선택된 루트 또는 첫 번째 루트
    let current = selectedPaths['root']
      ? messages.find(m => m.id === selectedPaths['root'])
      : rootMessages[0]

    while (current) {
      chain.push(current)

      // 현재 메시지의 자식들 찾기
      const children = messages.filter(m => m.parentMessageId === current!.id)

      if (children.length === 0) break

      if (children.length === 1) {
        current = children[0]
      } else {
        // 분기점: selectedPaths에서 선택된 자식 찾기
        const selectedChildId = selectedPaths[current!.id]
        current = children.find(c => c.id === selectedChildId) || children[0]
      }
    }

    return chain
  },

  // 형제 메시지 가져오기 (브랜치 네비게이터용)
  getSiblings: (messageId) => {
    const { messages } = get()
    const message = messages.find(m => m.id === messageId)
    if (!message) return { siblings: [], currentIndex: -1 }

    const siblings = messages.filter(
      m => m.parentMessageId === message.parentMessageId && m.role === message.role
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    const currentIndex = siblings.findIndex(s => s.id === messageId)
    return { siblings, currentIndex }
  },

  editMessage: async (messageId: string, newContent: string) => {
    const { messages, currentConversationId, currentModel, isStreaming, buildMessageChain } = get()
    if (isStreaming || !currentConversationId) return

    // 수정할 메시지 찾기
    const targetMessage = messages.find((m) => m.id === messageId)
    if (!targetMessage || targetMessage.role !== 'user') return

    // 새 형제 메시지 생성 (같은 parentMessageId)
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: newContent,
      parentMessageId: targetMessage.parentMessageId,  // 형제!
      createdAt: new Date(),
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      parentMessageId: newUserMessage.id,  // 새 사용자 메시지를 부모로
      createdAt: new Date(),
    }

    // 메시지 추가 및 새 경로 선택
    set((state) => ({
      messages: [...state.messages, newUserMessage, assistantMessage],
      selectedPaths: {
        ...state.selectedPaths,
        [targetMessage.parentMessageId ?? 'root']: newUserMessage.id  // 새 메시지 경로로 전환
      },
      isStreaming: true,
      error: null,
      editingMessageId: null,
      editingContent: '',
    }))

    const abortController = new AbortController()
    set({ abortController })

    // 현재 경로의 메시지 체인 빌드 (수정된 메시지 제외)
    const chain = buildMessageChain()
    const messagesForApi = chain.filter(m => m.id !== assistantMessage.id)

    // API 호출
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesForApi,
          conversationId: currentConversationId,
          model: currentModel,
          editMessageId: messageId,  // 원본 메시지 ID (형제 생성용)
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // DB에서 생성된 실제 메시지 ID로 동기화
      const dbUserMessageId = response.headers.get('X-User-Message-Id')
      if (dbUserMessageId) {
        set((state) => {
          const newSelectedPaths = { ...state.selectedPaths }

          // Update selectedPaths where userMessage was the selected child
          const parentKey = newUserMessage.parentMessageId ?? 'root'
          if (newSelectedPaths[parentKey] === newUserMessage.id) {
            newSelectedPaths[parentKey] = dbUserMessageId
          }

          // Update selectedPaths where userMessage was the parent key
          if (newSelectedPaths[newUserMessage.id]) {
            newSelectedPaths[dbUserMessageId] = newSelectedPaths[newUserMessage.id]
            delete newSelectedPaths[newUserMessage.id]
          }

          return {
            messages: state.messages.map((msg) => {
              if (msg.id === newUserMessage.id) return { ...msg, id: dbUserMessageId }
              if (msg.parentMessageId === newUserMessage.id) return { ...msg, parentMessageId: dbUserMessageId }
              return msg
            }),
            selectedPaths: newSelectedPaths
          }
        })
      }

      const contentType = response.headers.get('Content-Type') || ''

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
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

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
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        set({ error: { type: 'network', message: '메시지 수정 중 오류가 발생했습니다.' } })
      }
    } finally {
      set({ isStreaming: false, abortController: null })
    }
  },
}))
