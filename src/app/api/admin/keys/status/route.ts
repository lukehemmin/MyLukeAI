import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { withAdmin } from '@/lib/auth/admin-middleware'

export const GET = withAdmin(async (req, userId) => {
  try {
    const providers = ['openai', 'anthropic', 'gemini', 'openrouter']
    
    const keyStats = await prisma.apiKey.groupBy({
      by: ['provider', 'isActive'],
      _count: {
        id: true
      }
    })

    const status = providers.map(provider => {
      const providerKeys = keyStats.filter(k => k.provider === provider)
      const totalKeys = providerKeys.reduce((acc, curr) => acc + curr._count.id, 0)
      const activeKeys = providerKeys
        .filter(k => k.isActive)
        .reduce((acc, curr) => acc + curr._count.id, 0)

      return {
        provider,
        available: activeKeys > 0,
        keyCount: totalKeys
      }
    })

    return NextResponse.json(status)
  } catch (error) {
    console.error('API 키 상태 조회 실패:', error)
    return NextResponse.json(
      { error: 'API 키 상태를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
})
