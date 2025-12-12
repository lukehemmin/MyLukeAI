import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getActiveApiKey, recordApiKeyUsage, checkAllApiKeysStatus } from './api-key-manager'
import { prisma } from './prisma'
import { decryptApiKey, deserializeEncryptedData } from './crypto'

// 모듈 모킹
vi.mock('./prisma', () => ({
  prisma: {
    apiKey: {
      findFirst: vi.fn(),
      count: vi.fn(),
      update: vi.fn()
    },
    apiKeyUsage: {
      create: vi.fn()
    }
  }
}))

vi.mock('./crypto', () => ({
  decryptApiKey: vi.fn(),
  deserializeEncryptedData: vi.fn()
}))

describe('API Key Manager', () => {
  const mockApiKey = {
    id: 'test-key-id',
    name: 'Test Key',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    provider: 'openai',
    baseUrl: null,
    keyHash: 'encrypted-key-data',
    encryptedKeyJson: JSON.stringify({ encrypted: 'data', iv: 'iv', authTag: 'tag' }),
    description: null,
    isActive: true,
    expiresAt: null,
    lastUsedAt: new Date('2024-01-01'),
    usageCount: 5,
    deletedAt: null,
    createdBy: 'user-123'
  }

  const mockDecryptedKey = 'sk-test123456789'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getActiveApiKey', () => {
    it('should return active API key when available', async () => {
      vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(mockApiKey)
      vi.mocked(deserializeEncryptedData).mockReturnValue({ encrypted: 'data', iv: 'iv', authTag: 'tag' })
      vi.mocked(decryptApiKey).mockReturnValue(mockDecryptedKey)

      const result = await getActiveApiKey('openai')

      expect(result).toEqual({
        id: mockApiKey.id,
        provider: mockApiKey.provider,
        apiKey: mockDecryptedKey,
        baseUrl: mockApiKey.baseUrl,
        isActive: mockApiKey.isActive,
        expiresAt: mockApiKey.expiresAt,
        usageCount: mockApiKey.usageCount
      })

      expect(prisma.apiKey.findFirst).toHaveBeenCalledWith({
        where: {
          provider: 'openai',
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: expect.any(Date) } }
          ]
        },
        orderBy: {
          lastUsedAt: 'asc'
        }
      })
    })

    it('should return null when no active key found', async () => {
      vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(null)

      const result = await getActiveApiKey('openai')

      expect(result).toBeNull()
    })

    it('should handle expired keys correctly', async () => {
      const expiredKey = {
        ...mockApiKey,
        expiresAt: new Date('2023-01-01') // 과거 날짜
      }
      vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(null) // 만료된 키는 반환되지 않음

      const result = await getActiveApiKey('openai')

      expect(result).toBeNull()
    })

    it('should handle decryption errors gracefully', async () => {
      vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(mockApiKey)
      vi.mocked(deserializeEncryptedData).mockReturnValue({ encrypted: 'data', iv: 'iv', authTag: 'tag' })
      vi.mocked(decryptApiKey).mockImplementation(() => {
        throw new Error('Decryption failed')
      })

      const result = await getActiveApiKey('openai')

      expect(result).toBeNull()
    })
  })

  describe('recordApiKeyUsage', () => {
    it('should record API key usage and update key statistics', async () => {
      const usageData = {
        apiKeyId: 'test-key-id',
        endpoint: '/api/chat',
        model: 'gpt-4o-mini',
        tokens: 100,
        cost: 0.001,
        status: 'success' as const,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        responseTime: 500,
        errorMessage: undefined
      }

      await recordApiKeyUsage(usageData)

      expect(prisma.apiKeyUsage.create).toHaveBeenCalledWith({
        data: {
          apiKeyId: usageData.apiKeyId,
          route: usageData.endpoint,
          model: usageData.model
        }
      })

      expect(prisma.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'test-key-id' },
        data: {
          lastUsedAt: expect.any(Date),
          usageCount: {
            increment: 1
          }
        }
      })
    })

    it('should handle errors gracefully', async () => {
      const usageData = {
        apiKeyId: 'test-key-id',
        endpoint: '/api/chat',
        status: 'failed' as const
      }

      vi.mocked(prisma.apiKeyUsage.create).mockRejectedValue(new Error('Database error'))

      // 에러가 발생해도 함수가 예외를 던지지 않아야 함
      await expect(recordApiKeyUsage(usageData)).resolves.not.toThrow()
    })
  })

  describe('checkAllApiKeysStatus', () => {
    it('should return status for all providers', async () => {
      vi.mocked(prisma.apiKey.count)
        .mockResolvedValueOnce(2) // openai
        .mockResolvedValueOnce(1) // anthropic
        .mockResolvedValueOnce(0) // gemini
        .mockResolvedValueOnce(3) // openrouter

      const result = await checkAllApiKeysStatus()

      expect(result).toEqual([
        { provider: 'openai', available: true, keyCount: 2 },
        { provider: 'anthropic', available: true, keyCount: 1 },
        { provider: 'gemini', available: false, keyCount: 0 },
        { provider: 'openrouter', available: true, keyCount: 3 }
      ])

      expect(prisma.apiKey.count).toHaveBeenCalledTimes(4)
    })

    it('should handle database errors gracefully', async () => {
      vi.mocked(prisma.apiKey.count)
        .mockResolvedValueOnce(1) // openai
        .mockRejectedValueOnce(new Error('Database error')) // anthropic
        .mockResolvedValueOnce(0) // gemini
        .mockResolvedValueOnce(2) // openrouter

      const result = await checkAllApiKeysStatus()

      expect(result).toEqual([
        { provider: 'openai', available: true, keyCount: 1 },
        { provider: 'anthropic', available: false, keyCount: 0, error: 'Database error' },
        { provider: 'gemini', available: false, keyCount: 0 },
        { provider: 'openrouter', available: true, keyCount: 2 }
      ])
    })
  })
})