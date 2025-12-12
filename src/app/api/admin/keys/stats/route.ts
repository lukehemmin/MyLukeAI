import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { withAdmin } from '@/lib/auth/admin-middleware'
import { Prisma } from '@prisma/client'

/**
 * GET /api/admin/keys/stats
 * API 키 사용 통계를 조회합니다.
 */
export const GET = withAdmin(async (req, userId) => {
  try {
    const { searchParams } = new URL(req.url)
    
    // 날짜 범위 파라미터
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const provider = searchParams.get('provider')

    // 기본 날짜 범위 (지난 30일)
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultStartDate.getDate() - 30)
    const defaultEndDate = new Date()

    // 날짜 범위 설정
    const start = startDate ? new Date(startDate) : defaultStartDate
    const end = endDate ? new Date(endDate) : defaultEndDate

    // 전체 통계
    const totalStats = await prisma.apiKey.aggregate({
      where: {
        ...(provider && { provider })
      },
      _count: {
        id: true
      },
      _sum: {
        usageCount: true
      }
    })

    // 활성/비활성 키 통계
    const activeStats = await prisma.apiKey.groupBy({
      by: ['isActive'],
      where: {
        ...(provider && { provider })
      },
      _count: {
        id: true
      }
    })

    // 제공자별 통계
    const providerStats = await prisma.apiKey.groupBy({
      by: ['provider'],
      _count: {
        id: true
      },
      _sum: {
        usageCount: true
      }
    })

    // 사용량 통계 (최근 30일)
    const usageStats = await prisma.apiKeyUsage.aggregate({
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        ...(provider && { apiKey: { provider } })
      },
      _count: {
        id: true
      }
    })

    // 일별 사용량 (최근 30일)
    // Note: tokens and cost are not currently tracked in ApiKeyUsage
    const dailyUsage = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "ApiKeyUsage"
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      ${provider ? Prisma.sql`AND "apiKeyId" IN (SELECT id FROM "ApiKey" WHERE provider = ${provider})` : Prisma.empty}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
      LIMIT 30
    `

    // 모델별 사용량
    const modelStats = await prisma.apiKeyUsage.groupBy({
      by: ['model'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        ...(provider && { apiKey: { provider } })
      },
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      total: {
        count: totalStats._count.id,
        usageCount: totalStats._sum.usageCount || 0
      },
      active: activeStats.reduce((acc: any, curr) => {
        acc[curr.isActive ? 'active' : 'inactive'] = curr._count.id
        return acc
      }, { active: 0, inactive: 0 }),
      providers: providerStats.map(p => ({
        provider: p.provider,
        count: p._count.id,
        usageCount: p._sum.usageCount || 0
      })),
      usage: {
        total: usageStats._count.id,
        tokens: 0, // Not tracked
        cost: 0    // Not tracked
      },
      daily: dailyUsage,
      models: modelStats.map(m => ({
        model: m.model,
        count: m._count.id
      }))
    })
  } catch (error) {
    console.error('API 키 통계 조회 실패:', error)
    return NextResponse.json(
      { error: 'API 키 통계 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
})
