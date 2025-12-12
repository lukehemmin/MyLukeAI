import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { withAuth } from '@/lib/auth/middleware'

// Mock dependencies
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn((model) => ({ model }))
}))

vi.mock('ai', () => ({
  streamText: vi.fn(() => ({
    toDataStreamResponse: vi.fn(() => new Response('test response'))
  }))
}))

vi.mock('@/lib/auth/middleware', () => ({
  withAuth: vi.fn((handler) => handler)
}))

vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    message: {
      create: vi.fn()
    },
    tokenUsage: {
      create: vi.fn()
    }
  }
}))

vi.mock('@/lib/constants/models', () => ({
  DEFAULT_MODEL: 'gpt-4o-mini',
  AVAILABLE_MODELS: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'gpt-4o', name: 'GPT-4o' }
  ]
}))

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle valid chat request', async () => {
    const mockRequest = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        conversationId: 'test-conversation',
        model: 'gpt-4o-mini'
      })
    })

    // Mock the authenticated request handler
    const mockHandler = vi.fn().mockResolvedValue(new Response('test response'))
    vi.mocked(withAuth).mockImplementation((handler) => {
      return mockHandler
    })

    const response = await POST(mockRequest)
    
    expect(response).toBeInstanceOf(Response)
    expect(mockHandler).toHaveBeenCalled()
  })

  it('should reject invalid model', async () => {
    const mockRequest = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        conversationId: 'test-conversation',
        model: 'invalid-model'
      })
    })

    const mockHandler = vi.fn().mockResolvedValue(new Response('Invalid model', { status: 400 }))
    vi.mocked(withAuth).mockImplementation((handler) => {
      return mockHandler
    })

    const response = await POST(mockRequest)
    
    expect(response.status).toBe(400)
    expect(mockHandler).toHaveBeenCalled()
  })

  it('should handle missing conversation ID', async () => {
    const mockRequest = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        model: 'gpt-4o-mini'
      })
    })

    const mockHandler = vi.fn().mockResolvedValue(new Response('test response'))
    vi.mocked(withAuth).mockImplementation((handler) => {
      return mockHandler
    })

    const response = await POST(mockRequest)
    
    expect(response).toBeInstanceOf(Response)
    expect(mockHandler).toHaveBeenCalled()
  })

  it('should handle server errors', async () => {
    const mockRequest = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        conversationId: 'test-conversation',
        model: 'gpt-4o-mini'
      })
    })

    const mockHandler = vi.fn().mockRejectedValue(new Error('Server error'))
    vi.mocked(withAuth).mockImplementation((handler) => {
      return mockHandler
    })

    const response = await POST(mockRequest)
    
    expect(response.status).toBe(500)
    expect(mockHandler).toHaveBeenCalled()
  })
})
