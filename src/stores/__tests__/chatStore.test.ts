import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChatStore } from '../chatStore'

// Mock fetch
global.fetch = vi.fn()

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  },
  writable: true,
  configurable: true
})

describe('ChatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.setState({
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
    })
  })

  it('should initialize with default state', () => {
    const state = useChatStore.getState()
    
    expect(state.messages).toEqual([])
    expect(state.isStreaming).toBe(false)
    expect(state.error).toBe(null)
    expect(state.abortController).toBe(null)
    expect(state.currentConversationId).toBe(null)
    expect(state.currentModel).toBe('gpt-4o-mini')
    expect(state.tokenUsage).toEqual({
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    })
  })

  it('should add messages when sending a message', async () => {
    const { sendMessage } = useChatStore.getState()
    
    // Mock successful fetch response
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValue({ done: true })
        })
      }
    }
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    await sendMessage('Hello AI', 'test-conversation')

    const state = useChatStore.getState()
    expect(state.messages).toHaveLength(2) // User message + assistant placeholder
    expect(state.messages[0].role).toBe('user')
    expect(state.messages[0].content).toBe('Hello AI')
    expect(state.messages[1].role).toBe('assistant')
    expect(state.messages[1].content).toBe('')
  })

  it('should not send message when already streaming', async () => {
    // Set streaming state to true
    useChatStore.setState({ isStreaming: true })
    
    const { sendMessage } = useChatStore.getState()
    const initialMessageCount = useChatStore.getState().messages.length

    await sendMessage('Hello AI', 'test-conversation')

    const state = useChatStore.getState()
    expect(state.messages).toHaveLength(initialMessageCount) // No new messages added
    expect(fetch).not.toHaveBeenCalled()
  })

  it('should handle network errors', async () => {
    const { sendMessage } = useChatStore.getState()
    
    // Mock failed fetch
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    await sendMessage('Hello AI', 'test-conversation')

    const state = useChatStore.getState()
    expect(state.error).toEqual({
      type: 'network',
      message: '네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.',
    })
    expect(state.isStreaming).toBe(false)
  })

  it('should stop streaming', () => {
    const mockAbortController = new AbortController()
    useChatStore.setState({ 
      isStreaming: true, 
      abortController: mockAbortController 
    })

    const { stopStreaming } = useChatStore.getState()
    stopStreaming()

    const state = useChatStore.getState()
    expect(state.isStreaming).toBe(false)
    expect(state.abortController).toBe(null)
  })

  it('should clear error', () => {
    useChatStore.setState({ 
      error: { type: 'network', message: 'Test error' } 
    })

    const { clearError } = useChatStore.getState()
    clearError()

    const state = useChatStore.getState()
    expect(state.error).toBe(null)
  })

  it('should set current conversation', () => {
    const { setCurrentConversation } = useChatStore.getState()
    setCurrentConversation('test-conversation-id')

    const state = useChatStore.getState()
    expect(state.currentConversationId).toBe('test-conversation-id')
  })

  it('should set current model', () => {
    const { setCurrentModel } = useChatStore.getState()
    setCurrentModel('gpt-4')

    const state = useChatStore.getState()
    expect(state.currentModel).toBe('gpt-4')
  })

  it('should update token usage', () => {
    const { updateTokenUsage } = useChatStore.getState()
    updateTokenUsage({
      promptTokens: 100,
      completionTokens: 200,
      totalTokens: 300,
    })

    const state = useChatStore.getState()
    expect(state.tokenUsage).toEqual({
      promptTokens: 100,
      completionTokens: 200,
      totalTokens: 300,
    })
  })

  it('should convert Prisma messages to store messages', () => {
    const { setMessages } = useChatStore.getState()
    const prismaMessages = [
      {
        id: '1',
        role: 'user',
        content: 'Hello',
        tokens: 10,
        history: null,
        context: null,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Hi there!',
        tokens: 20,
        history: null,
        context: null,
        createdAt: new Date('2024-01-01'),
      },
    ]

    setMessages(prismaMessages as any)

    const state = useChatStore.getState()
    expect(state.messages).toHaveLength(2)
    expect(state.messages[0].role).toBe('user')
    expect(state.messages[0].content).toBe('Hello')
    expect(state.messages[1].role).toBe('assistant')
    expect(state.messages[1].content).toBe('Hi there!')
  })
})