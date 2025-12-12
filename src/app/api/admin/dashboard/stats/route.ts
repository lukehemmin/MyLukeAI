import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { withAdmin } from '@/lib/auth/admin-middleware'

export const GET = withAdmin(async (req, userId) => {
  try {
    const [
      totalUsers,
      totalConversations,
      totalMessages,
      totalApiKeys,
      activeApiKeys
    ] = await Promise.all([
      prisma.user.count(),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.apiKey.count(),
      prisma.apiKey.count({
        where: { isActive: true }
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalConversations,
      totalMessages,
      totalApiKeys,
      activeApiKeys,
      systemStatus: 'healthy'
    })
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error)
    return NextResponse.json(
      { error: '통계 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
})
