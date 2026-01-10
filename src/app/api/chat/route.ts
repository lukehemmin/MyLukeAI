/* eslint-disable no-console */
import { streamText, generateText } from 'ai'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma/client'
import { DEFAULT_MODEL, AVAILABLE_MODELS } from '@/lib/constants/models'
import { getActiveApiKey, recordApiKeyUsage } from '@/lib/api-key-manager'
import { createOpenAI } from '@ai-sdk/openai'
import { getEncoding } from 'js-tiktoken'

const encoding = getEncoding('cl100k_base')

function countTokens(text: string): number {
  try {
    return encoding.encode(text).length
  } catch (e) {
    console.warn('Token counting failed:', e)
    return 0
  }
}

// 모델별 제공자 매핑 제거 (AVAILABLE_MODELS에서 조회)

export const POST = withAuth(async (req: Request, userId: string) => {
  try {
    const { messages, conversationId, model = DEFAULT_MODEL, editMessageId, parentMessageId: clientParentMessageId } = await req.json()

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

    // 스트리밍 지원 여부 (DB 모델은 필드 사용, TEXT/TEXT_VISION은 기본 true)
    const modelType = modelConfig.type ?? 'TEXT'
    const supportsStreaming = modelConfig.supportsStreaming ??
      (modelType === 'TEXT' || modelType === 'TEXT_VISION')

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
    let userMessageId: string | null = null
    let parentMessageIdForAssistant: string | null = null

    if (conversationId) {
      const lastMessage = messages[messages.length - 1];
      let contentToSave = '';

      if (typeof lastMessage.content === 'string') {
        contentToSave = lastMessage.content;
      } else if (Array.isArray(lastMessage.content)) {
        // 멀티모달 메시지(이미지 등)는 JSON 문자열로 저장
        contentToSave = JSON.stringify(lastMessage.content);
      }

      if (editMessageId) {
        // 수정 모드: 형제 메시지 생성 (같은 부모 메시지 ID 사용)
        const originalMessage = await prisma.message.findUnique({
          where: { id: editMessageId }
        })

        if (originalMessage) {
          // 새 사용자 메시지를 형제로 생성 (같은 parentMessageId)
          const newUserMessage = await prisma.message.create({
            data: {
              conversationId,
              role: 'user',
              content: contentToSave,
              parentMessageId: originalMessage.parentMessageId  // 형제 관계!
            }
          })
          userMessageId = newUserMessage.id
          parentMessageIdForAssistant = newUserMessage.id
          console.log(`[EditMessage] Created sibling message ${userMessageId} (parent: ${originalMessage.parentMessageId})`)
        }
      } else {
        // 일반 모드: 새 메시지 생성 (트리 구조)
        const newUserMessage = await prisma.message.create({
          data: {
            conversationId,
            role: 'user',
            content: contentToSave,
            parentMessageId: clientParentMessageId || null  // 클라이언트에서 전달받은 부모 ID
          }
        })
        userMessageId = newUserMessage.id
        parentMessageIdForAssistant = newUserMessage.id
      }
    }

    const startTime = Date.now()

    // Convert OpenAI 'image_url' format to Vercel AI SDK 'image' format
    const formattedMessages = messages.map((m: any) => {
      if (Array.isArray(m.content)) {
        return {
          ...m,
          content: m.content.map((c: any) => {
            if (c.type === 'image_url') {
              return {
                type: 'image',
                image: c.image_url.url
              }
            }
            return c
          })
        }
      }
      return m
    })

    const openaiProvider = createOpenAI({
      apiKey: activeKeyApiKey!,
      baseURL: activeKeyBaseUrl || undefined
    })
    /**
     * [견고한 스트리밍 아키텍처 - v1.5]
     * 
     * ⚠️ 중요: 이 로직은 새로고침/페이지 이동 시에도 스트리밍 응답을 보존하기 위한 핵심 코드입니다!
     * 
     * 기존 문제:
     * - 스트리밍 완료 후에만 DB에 저장되어, 중간에 새로고침하면 응답이 영구 손실됨
     * - 새 채팅 생성 후 router.push() 시 클라이언트 상태와 DB가 동기화되지 않음
     * 
     * 해결 방법:
     * 1. 스트리밍 시작 전에 빈 메시지를 DB에 미리 생성 (isStreaming: true)
     * 2. 클라이언트가 언제든 DB에서 현재 진행 상태를 조회 가능
     * 3. 스트리밍 완료 시 메시지 업데이트 (isStreaming: false)
     * 
     * 🚫 이 로직을 수정할 때 주의사항:
     * - prisma.message.create가 streamText보다 먼저 호출되어야 함
     * - assistantMessageId가 onFinish에서 사용되므로 클로저에 캡처됨
     * - isStreaming 필드는 프론트엔드 polling 로직과 연동됨
     */
    if (supportsStreaming) {
      let assistantContent = ''
      let assistantMessageId: string | null = null

      // [Step 1] 스트리밍 시작 전 빈 assistant 메시지 미리 생성
      // - 새로고침 시 프론트엔드가 DB에서 이 메시지를 조회하여 복구 가능
      // - isStreaming: true로 설정하여 "아직 응답 중"임을 표시
      if (conversationId) {
        const assistantMessage = await prisma.message.create({
          data: {
            conversationId,
            role: 'assistant',
            content: '',
            isStreaming: true,
            parentMessageId: parentMessageIdForAssistant  // 사용자 메시지를 부모로 설정
          }
        })
        assistantMessageId = assistantMessage.id
      }

      const result = await streamText({
        model: openaiProvider(apiModelId),
        messages: formattedMessages,
        abortSignal: req.signal,
        onFinish: async ({ usage }) => {
          const responseTime = Date.now() - startTime

          // [Step 3] 스트리밍 완료: 메시지 업데이트 (CREATE → UPDATE 패턴)
          // - isStreaming: false로 변경하여 완료 표시
          // - 프론트엔드 polling이 이를 감지하고 polling 중지
          if (assistantMessageId) {
            await prisma.message.update({
              where: { id: assistantMessageId },
              data: {
                content: assistantContent,
                isStreaming: false,
                tokens: usage?.totalTokens,
              }
            })
          }

          // Log token usage
          console.log('[TokenUsage] Stream finished. Usage:', usage)


          if (usage || assistantContent) {
            let promptTokens = usage ? (usage as any).promptTokens ?? 0 : 0
            let completionTokens = usage ? (usage as any).completionTokens ?? 0 : 0

            // Fallback: Calculate manually if usage is missing
            if (promptTokens === 0 && completionTokens === 0) {
              console.warn('[TokenUsage] Usage data missing, calculating manually...')
              // Calculate prompt tokens from messages
              const promptText = messages.map((m: any) => {
                if (typeof m.content === 'string') return m.content
                return m.content.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n')
              }).join('\n')
              promptTokens = countTokens(promptText)
              // Calculate completion tokens from accumulated content
              completionTokens = countTokens(assistantContent)
            }

            await prisma.tokenUsage.create({
              data: {
                userId,
                model,
                promptTokens,
                completionTokens,
              }
            })
            console.log(`[TokenUsage] Saved: ${promptTokens}p, ${completionTokens}c (Source: ${usage ? 'Provider' : 'Manual'})`)
          } else {
            console.warn('[TokenUsage] No usage data available from stream')
          }

          // API 키 사용 기록 (오류 여부에 관계없이 기록)
          if (apiKeyId) {
            try {
              await recordApiKeyUsage({
                apiKeyId,
                endpoint: '/api/chat',
                model,
                tokens: usage?.totalTokens ?? 0,
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

      // 응답 헤더에 사용자 메시지 ID 포함
      const streamResponse = result.toTextStreamResponse()
      if (userMessageId) {
        const headers = new Headers(streamResponse.headers)
        headers.set('X-User-Message-Id', userMessageId)
        return new Response(streamResponse.body, {
          status: streamResponse.status,
          statusText: streamResponse.statusText,
          headers
        })
      }
      return streamResponse
    }

    // 비스트리밍 모드 (전체 응답 완료 후 전송)
    const result = await generateText({
      model: openaiProvider(apiModelId),
      messages: formattedMessages,
      abortSignal: req.signal,
    })

    const responseTime = Date.now() - startTime
    const assistantContent = result.text
    const usage = result.usage

    console.log('[TokenUsage] Non-streaming usage:', usage)

    // Save assistant message to database
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
    // Log token usage
    if (usage || assistantContent) {
      let promptTokens = usage ? (usage as any).promptTokens ?? 0 : 0
      let completionTokens = usage ? (usage as any).completionTokens ?? 0 : 0

      // Fallback: Calculate manually if usage is missing
      if (promptTokens === 0 && completionTokens === 0) {
        console.warn('[TokenUsage] Usage data missing (non-stream), calculating manually...')
        // Calculate prompt tokens from messages
        const promptText = messages.map((m: any) => {
          if (typeof m.content === 'string') return m.content
          return m.content.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n')
        }).join('\n')
        promptTokens = countTokens(promptText)
        completionTokens = countTokens(assistantContent)
      }

      await prisma.tokenUsage.create({
        data: {
          userId,
          model,
          promptTokens,
          completionTokens,
        }
      })
      console.log(`[TokenUsage] Saved: ${promptTokens}p, ${completionTokens}c (Source: ${usage ? 'Provider' : 'Manual'})`)
    } else {
      console.warn('[TokenUsage] No usage data available from non-streaming')
    }

    // API 키 사용 기록
    if (apiKeyId) {
      try {
        await recordApiKeyUsage({
          apiKeyId,
          endpoint: '/api/chat',
          model,
          tokens: usage?.totalTokens ?? 0,
          status: 'success',
          responseTime,
          errorMessage: undefined
        })
      } catch (usageError) {
        console.error('API 키 사용 기록 실패:', usageError)
      }
    }

    // JSON 응답 반환 (비스트리밍)
    return new Response(JSON.stringify({
      content: assistantContent,
      usage: usage ? {
        promptTokens: (usage as any).promptTokens,
        completionTokens: (usage as any).completionTokens,
        totalTokens: (usage as any).totalTokens,
      } : null,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

