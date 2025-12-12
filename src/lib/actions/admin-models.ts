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
        
        // 3. DB에 업데이트 (Upsert)
        for (const model of list.data) {
          // 채팅 모델만 필터링 (gpt 시작하는 것들)
          if (model.id.startsWith('gpt')) {
            await prisma.model.upsert({
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
                apiKeyId: key.id
              }
            })
            syncedCount++
          }
        }
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
