import { prisma } from '@/lib/prisma/client'
import { decryptApiKey, deserializeEncryptedData } from '@/lib/crypto'

export interface ApiKeyConfig {
  id: string
  provider: string
  apiKey: string
  baseUrl?: string | null
  isActive: boolean
  expiresAt?: Date | null
  usageCount: number
}

export interface ApiKeyUsageData {
  apiKeyId: string
  endpoint: string
  model?: string
  tokens?: number
  cost?: number
  status: 'success' | 'failed' | 'rate_limited'
  ipAddress?: string
  userAgent?: string
  responseTime?: number
  errorMessage?: string
}

/**
 * 사용 가능한 활성 API 키를 조회합니다.
 */
export async function getActiveApiKey(provider: string): Promise<ApiKeyConfig | null> {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        provider,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: {
        lastUsedAt: 'asc' // 가장 오래전에 사용된 키부터 선택 (라운드 로빈)
      }
    })

    if (!apiKey) {
      return null
    }

    const decryptedKey = decryptApiKey(deserializeEncryptedData(apiKey.encryptedKeyJson))

    return {
      id: apiKey.id,
      provider: apiKey.provider,
      apiKey: decryptedKey,
      baseUrl: apiKey.baseUrl,
      isActive: apiKey.isActive,
      expiresAt: apiKey.expiresAt,
      usageCount: apiKey.usageCount
    }
  } catch (error) {
    console.error('활성 API 키 조회 실패:', error)
    return null
  }
}

/**
 * API 키 사용 기록을 저장합니다.
 */
export async function recordApiKeyUsage(data: ApiKeyUsageData): Promise<void> {
  try {
    await prisma.apiKeyUsage.create({
      data: {
        apiKeyId: data.apiKeyId,
        route: data.endpoint,
        model: data.model || 'unknown',
        // tokens, cost, status, etc. are not supported in current schema
      }
    })

    // API 키의 마지막 사용일과 사용 횟수 업데이트
    await prisma.apiKey.update({
      where: { id: data.apiKeyId },
      data: {
        lastUsedAt: new Date(),
        usageCount: {
          increment: 1
        }
      }
    })
  } catch (error) {
    console.error('API 키 사용 기록 저장 실패:', error)
  }
}

/**
 * 모든 활성 API 키의 상태를 확인합니다.
 */
export async function checkAllApiKeysStatus(): Promise<Array<{
  provider: string
  available: boolean
  keyCount: number
  error?: string
}>> {
  const providers = ['openai']
  const results = []

  for (const provider of providers) {
    try {
      const keyCount = await prisma.apiKey.count({
        where: {
          provider,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      })

      const hasAvailableKey = keyCount > 0

      results.push({
        provider,
        available: hasAvailableKey,
        keyCount
      })
    } catch (error) {
      results.push({
        provider,
        available: false,
        keyCount: 0,
        error: (error as Error).message
      })
    }
  }

  return results
}
