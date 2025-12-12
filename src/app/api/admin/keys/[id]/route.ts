import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { withAdmin } from '@/lib/auth/admin-middleware'
import { logAdminAction } from '@/lib/auth/admin-middleware'

/**
 * GET /api/admin/keys/[id]
 * 특정 API 키의 상세 정보를 조회합니다.
 */
export const GET = withAdmin(async (req, userId, context) => {
  try {
    const { id } = await context!.params

    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
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
        },
        usages: {
          select: {
            id: true,
            route: true,
            model: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // 최근 10개 사용 기록
        }
      }
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error('API 키 조회 실패:', error)
    return NextResponse.json(
      { error: 'API 키 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
})

/**
 * PATCH /api/admin/keys/[id]
 * API 키 정보를 수정합니다.
 */
export const PATCH = withAdmin(async (req, userId, context) => {
  try {
    const { id } = await context!.params
    const body = await req.json()
    const { name, description, isActive, expiresAt, baseUrl } = body

    // 기존 키 확인
    const existingKey = await prisma.apiKey.findUnique({
      where: { id }
    })

    if (!existingKey) {
      return NextResponse.json(
        { error: 'API 키를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 업데이트할 데이터 준비
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (baseUrl !== undefined) updateData.baseUrl = baseUrl || null
    if (isActive !== undefined) updateData.isActive = isActive
    if (expiresAt !== undefined) {
      if (expiresAt === null) {
        updateData.expiresAt = null
      } else {
        const expiresAtDate = new Date(expiresAt)
        if (isNaN(expiresAtDate.getTime())) {
          return NextResponse.json(
            { error: '잘못된 만료일 형식입니다.' },
            { status: 400 }
          )
        }
        updateData.expiresAt = expiresAtDate
      }
    }

    // API 키 업데이트
    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: updateData,
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
      }
    })

    // 감사 로그 기록
    await logAdminAction(
      userId,
      'update_key',
      'api_key',
      id,
      { name, description, isActive, expiresAt, baseUrl }
    )

    return NextResponse.json({ apiKey: updatedKey })
  } catch (error) {
    console.error('API 키 수정 실패:', error)
    return NextResponse.json(
      { error: 'API 키 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
})

/**
 * DELETE /api/admin/keys/[id]
 * API 키를 삭제합니다.
 */
export const DELETE = withAdmin(async (req, userId, context) => {
  try {
    const { id } = await context!.params

    // 기존 키 확인
    const existingKey = await prisma.apiKey.findUnique({
      where: { id }
    })

    if (!existingKey) {
      return NextResponse.json(
        { error: 'API 키를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // API 키 삭제 (연결된 사용 기록은 CASCADE로 삭제됨)
    await prisma.apiKey.delete({
      where: { id }
    })

    // 감사 로그 기록
    await logAdminAction(
      userId,
      'delete_key',
      'api_key',
      id,
      { name: existingKey.name, provider: existingKey.provider }
    )

    return NextResponse.json({ message: 'API 키가 삭제되었습니다.' })
  } catch (error) {
    console.error('API 키 삭제 실패:', error)
    return NextResponse.json(
      { error: 'API 키 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
})
