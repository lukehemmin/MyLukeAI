'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'
import { OpenAI } from 'openai'
import { decryptApiKey, deserializeEncryptedData } from '@/lib/crypto'

// 타입 정의
interface ModelData {
  id: string
  apiModelId: string
  provider: string
  name: string
  isEnabled: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

interface UpdateModelPayload {
  name?: string
  isEnabled?: boolean
  isPublic?: boolean
  supportsStreaming?: boolean
  type?: 'TEXT' | 'TEXT_VISION' | 'IMAGE' | 'AUDIO'
}

// 모델 동기화 액션
export async function syncModels() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // 1. 활성화된 API 키 가져오기
  const apiKeys = await prisma.apiKey.findMany({
    where: { isActive: true },
    select: { id: true, name: true, provider: true, encryptedKeyJson: true }
  })

  let syncedCount = 0

  // 2. 각 제공자별로 모델 가져오기
  for (const key of apiKeys) {
    if (key.provider === 'openai') {
      try {
        // 암호화된 API 키 복호화
        const encryptedData = deserializeEncryptedData(key.encryptedKeyJson)
        const decryptedKey = decryptApiKey(encryptedData)

        const openai = new OpenAI({ apiKey: decryptedKey })
        const list = await openai.models.list()

        // 제외할 모델 키워드 (Blacklist) - 이제 이미지/오디오 모델도 허용하므로 리스트 축소
        // 여전히 제외할 것: 임베딩, 모더레이션, 위스퍼(STT는 챗용이 아님), 컴퓨터 사용 등
        const EXCLUDED_KEYWORDS = ['embedding', 'babbage', 'davinci', 'curie', 'ada', 'moderation', 'whisper', 'transcribe', 'computer-use']

        // 3. DB에 업데이트 (Parallel Upsert)
        const upsertPromises = list.data
          .filter(model => {
            // 채팅/생성 불가능한 모델만 제외하고 모두 허용
            const isExcluded = EXCLUDED_KEYWORDS.some(keyword => model.id.includes(keyword))
            return !isExcluded
          })
          .map(model => {
            let modelType: 'TEXT' | 'TEXT_VISION' | 'IMAGE' | 'AUDIO' = 'TEXT'

            // 모델 타입 추론
            if (model.id.includes('dall-e') || model.id.includes('image') || model.id.includes('sora')) {
              modelType = 'IMAGE'
            } else if (model.id.includes('tts') || model.id.includes('audio')) {
              modelType = 'AUDIO'
            } else if (model.id.includes('vision') || model.id.includes('gpt-4o')) {
              // gpt-4o는 기본적으로 vision 지원
              modelType = 'TEXT_VISION'
            }

            // TEXT/TEXT_VISION 모델은 스트리밍 지원
            const supportsStreaming = modelType === 'TEXT' || modelType === 'TEXT_VISION'

            return prisma.model.upsert({
              where: {
                provider_apiModelId_apiKeyId: {
                  provider: 'openai',
                  apiModelId: model.id,
                  apiKeyId: key.id
                }
              },
              update: {}, // 기존 데이터 유지
              create: {
                provider: 'openai',
                apiModelId: model.id,
                name: `${model.id} (${key.name})`, // 모델 이름에 키 이름 포함
                isEnabled: true,
                isPublic: false, // 기본적으로 비공개
                apiKeyId: key.id,
                type: modelType,
                supportsStreaming
              }
            })
          })

        await Promise.all(upsertPromises)
        syncedCount += upsertPromises.length
      } catch (error) {
        console.error(`Failed to sync OpenAI models:`, error)
      }
    }
    // 다른 제공자(Anthropic, Google 등) 추가 가능
  }

  revalidatePath('/admin/models')
  return { success: true, count: syncedCount }
}

// 모델 상태 토글
export async function toggleModelStatus(id: string, field: 'isEnabled' | 'isPublic', value: boolean) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  await prisma.model.update({
    where: { id },
    data: { [field]: value }
  })

  revalidatePath('/admin/models')
  return { success: true }
}

// 모델 이름 수정
export async function updateModelName(id: string, name: string) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  await prisma.model.update({
    where: { id },
    data: { name }
  })

  revalidatePath('/admin/models')
  return { success: true }
}

// 모델 삭제
export async function deleteModel(id: string) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  await prisma.model.delete({
    where: { id }
  })

  revalidatePath('/admin/models')
  return { success: true }
}

// 모든 모델 초기화 (전체 삭제)
export async function resetAllModels() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  await prisma.model.deleteMany({})

  revalidatePath('/admin/models')
  return { success: true }
}

// 모델 목록 조회
export async function getModels() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return await prisma.model.findMany({
    orderBy: { provider: 'asc' },
    include: {
      apiKey: {
        select: {
          name: true
        }
      }
    }
  })
}

// 단일 모델 업데이트 (이름, 상태, 공개 여부를 한 번에 수정)
export async function updateModel(id: string, data: UpdateModelPayload) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  await prisma.model.update({
    where: { id },
    data
  })

  revalidatePath('/admin/models')
  return { success: true }
}

// 다중 모델 삭제
export async function bulkDeleteModels(ids: string[]) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  if (!ids.length) {
    return { success: true, deleted: 0 }
  }

  const result = await prisma.model.deleteMany({
    where: { id: { in: ids } }
  })

  revalidatePath('/admin/models')
  return { success: true, deleted: result.count }
}

// 모델 순서 및 기본 설정 업데이트
export async function updateModelOrder(items: { id: string, order: number }[]) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // 트랜잭션으로 순서 일괄 업데이트
  await prisma.$transaction(
    items.map(item =>
      prisma.model.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )
  )

  revalidatePath('/admin/models')
  return { success: true }
}

export async function setDefaultModel(id: string) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // 트랜잭션으로 기존 기본값 해제 및 새로운 기본값 설정
  await prisma.$transaction([
    prisma.model.updateMany({
      where: { isDefault: true },
      data: { isDefault: false }
    }),
    prisma.model.update({
      where: { id },
      data: { isDefault: true }
    })
  ])

  revalidatePath('/admin/models')
  return { success: true }
}
