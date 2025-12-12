import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { withAdmin } from '@/lib/auth/admin-middleware'
import { encryptApiKey, hashApiKey, serializeEncryptedData } from '@/lib/crypto'
import { logAdminAction } from '@/lib/auth/admin-middleware'

/**
 * GET /api/admin/keys
 * 모든 API 키 목록을 조회합니다.
 */
export const GET = withAdmin(async (req, userId) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      select: {
        id: true,
        name: true,
        provider: true,
        baseUrl: true,
        description: true,
        isActive: true,
        expiresAt: true,
        lastUsedAt: true,
        usageCount: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error('API 키 목록 조회 실패:', error)
    return NextResponse.json(
      { error: 'API 키 목록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/keys
 * 새로운 API 키를 생성합니다.
 */
export const POST = withAdmin(async (req, userId) => {
  try {
    const body = await req.json()
    const { name, apiKey, provider, baseUrl, description, expiresAt } = body

    // 입력 검증
    if (!name || !apiKey || !provider) {
      return NextResponse.json(
        { error: '이름, API 키, 제공자는 필수 입력값입니다.' },
        { status: 400 }
      )
    }

    // 지원하는 제공자 확인 - 사용자 정의 제공자를 허용하기 위해 검사 완화
    /*
    const supportedProviders = ['openai', 'anthropic', 'gemini', 'openrouter']
    if (!supportedProviders.includes(provider)) {
      return NextResponse.json(
        { error: '지원하지 않는 제공자입니다.' },
        { status: 400 }
      )
    }
    */

    // API 키 암호화
    const encryptedData = encryptApiKey(apiKey)
    const keyHash = hashApiKey(apiKey)
    const encryptedKey = serializeEncryptedData(encryptedData)

    // 만료일 파싱
    let expiresAtDate = null
    if (expiresAt) {
      expiresAtDate = new Date(expiresAt)
      if (isNaN(expiresAtDate.getTime())) {
        return NextResponse.json(
          { error: '잘못된 만료일 형식입니다.' },
          { status: 400 }
        )
      }
    }

    // API 키 생성
    const createdKey = await prisma.apiKey.create({
      data: {
        name,
        keyHash,
        provider,
        baseUrl: baseUrl || null,
        description,
        expiresAt: expiresAtDate,
        encryptedKeyJson: encryptedKey,
        createdBy: userId
      },
      select: {
        id: true,
        name: true,
        provider: true,
        baseUrl: true,
        description: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // 감사 로그 기록
    await logAdminAction(
      userId,
      'create_key',
      'api_key',
      createdKey.id,
      { name, provider, baseUrl, description, expiresAt }
    )

    return NextResponse.json({ apiKey: createdKey }, { status: 201 })
  } catch (error) {
    console.error('API 키 생성 실패:', error)
    
    // 중복 키 에러 처리
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return NextResponse.json(
        { error: '이미 등록된 API 키입니다.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'API 키 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
})
