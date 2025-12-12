import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { withAdmin } from '@/lib/auth/admin-middleware'

/**
 * GET /api/admin/audit-logs
 * 관리자 감사 로그를 조회합니다.
 */
export const GET = withAdmin(async (req, userId) => {
  try {
    const { searchParams } = new URL(req.url)
    
    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')
    const resource = searchParams.get('resource')
    const userIdFilter = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 유효성 검사
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: '잘못된 페이지 또는 제한값입니다.' },
        { status: 400 }
      )
    }

    // where 조건 구성
    const where: any = {}
    
    if (action) {
      where.action = action
    }
    
    if (resource) {
      where.resource = resource
    }
    
    if (userIdFilter) {
      where.userId = userIdFilter
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // 전체 개수 조회
    const totalCount = await prisma.adminAuditLog.count({ where })

    // 감사 로그 조회
    const auditLogs = await prisma.adminAuditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        resource: true,
        resourceId: true,
        details: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      auditLogs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext,
        hasPrev
      }
    })
  } catch (error) {
    console.error('감사 로그 조회 실패:', error)
    return NextResponse.json(
      { error: '감사 로그 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
})
