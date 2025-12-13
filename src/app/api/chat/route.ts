import { streamText } from 'ai'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma/client'
import { DEFAULT_MODEL, AVAILABLE_MODELS } from '@/lib/constants/models'
import { getActiveApiKey, recordApiKeyUsage } from '@/lib/api-key-manager'
import { createOpenAI } from '@ai-sdk/openai'

// 모델별 제공자 매핑 제거 (AVAILABLE_MODELS에서 조회)

export const POST = withAuth(async (req: Request, userId: string) => {
  try {
    const { messages, conversationId, model = DEFAULT_MODEL } = await req.json()

    // 모델 설정 조회 (DB 우선, 없으면 Static)
    let modelConfig: any = await prisma.model.findUnique({
      where: { id: model },
      include: { apiKey: true }
    })

    // DB에 없으면 Static List 확인 (Legacy support)
    if (!modelConfig) {
      modelConfig = AVAILABLE_MODELS.find(m => m.id === model)
    }

    // 모델 유효성 검사
    if (!modelConfig) {
      return new Response('Invalid model', { status: 400 })
    }

    // 제공자 확인
    const provider = modelConfig.provider

    // API 키 가져오기
    let apiKeyId: string | null = null
    let activeKeyApiKey: string | null = null
    let activeKeyBaseUrl: string | null = null

    try {
      // 1. 모델에 연결된 특정 API Key가 있으면 사용
      if (modelConfig.apiKey) {
        if (!modelConfig.apiKey.isActive) {
          return new Response('연결된 API 키가 비활성화되었습니다.', { status: 500 })
        }

        // Decrypt key
        const { decryptApiKey, deserializeEncryptedData } = await import('@/lib/crypto')
        const encryptedData = deserializeEncryptedData(modelConfig.apiKey.encryptedKeyJson)

        apiKeyId = modelConfig.apiKey.id
        activeKeyApiKey = decryptApiKey(encryptedData)
        activeKeyBaseUrl = modelConfig.apiKey.baseUrl || null
      } else {
        // 2. 없으면 로드밸런싱/기본 키 조회 (기존 로직)
        const activeKey = await getActiveApiKey(provider)
        if (!activeKey) {
          return new Response(`${provider} API 키를 찾을 수 없습니다.`, { status: 500 })
        }
        apiKeyId = activeKey.id
        activeKeyApiKey = activeKey.apiKey
        activeKeyBaseUrl = activeKey.baseUrl || null
      }
    } catch (error) {
      console.error('API 클라이언트 생성 실패:', error)
      return new Response('API 클라이언트 생성에 실패했습니다.', { status: 500 })
    }

    // 실제 API 호출에 사용할 모델 ID
    // DB 모델인 경우 apiModelId 사용, 아니면(static) model ID 그대로 사용
    const apiModelId = modelConfig.apiModelId || modelConfig.id

    // Save user message to database
    if (conversationId) {
      await prisma.message.create({
        data: {
          conversationId,
          role: 'user',
          content: messages[messages.length - 1].content,
        }
      })
    }

    let assistantContent = ''
    let startTime = Date.now()

    const openaiProvider = createOpenAI({
      apiKey: activeKeyApiKey!,
      baseURL: activeKeyBaseUrl || undefined
    })
    const result = await streamText({
      model: openaiProvider(apiModelId),
      messages,
      abortSignal: req.signal,
      onFinish: async ({ usage }) => {
        const responseTime = Date.now() - startTime

        // Save assistant message to database with complete content
        if (conversationId) {
          await prisma.message.create({
            data: {
              conversationId,
              role: 'assistant',
              content: assistantContent,
              tokens: usage?.totalTokens,
            }
          })
        }

        // Log token usage
        if (usage && 'promptTokens' in usage && 'completionTokens' in usage) {
          await prisma.tokenUsage.create({
            data: {
              userId,
              model,
              promptTokens: (usage as any).promptTokens,
              completionTokens: (usage as any).completionTokens,
            }
          })
        }

        // API 키 사용 기록 (오류 여부에 관계없이 기록)
        if (apiKeyId) {
          try {
            await recordApiKeyUsage({
              apiKeyId,
              endpoint: '/api/chat',
              model,
              tokens: usage?.totalTokens,
              status: 'success',
              responseTime,
              errorMessage: undefined
            })
          } catch (usageError) {
            console.error('API 키 사용 기록 실패:', usageError)
          }
        }
      },
      onChunk: ({ chunk }) => {
        // Accumulate the content for database storage
        if (chunk.type === 'text-delta') {
          assistantContent += (chunk as any).value ?? (chunk as any).text ?? ''
        }
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
