'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'

// 통계 데이터 가져오기
export async function getUsageStats() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // 1. 모델별 토큰 사용량
  const modelUsage = await prisma.tokenUsage.groupBy({
    by: ['model'],
    _sum: {
      promptTokens: true,
      completionTokens: true,
    },
  })

  // 2. 최근 7일간 일별 사용량
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const dailyUsage = await prisma.tokenUsage.groupBy({
    by: ['createdAt'],
    _sum: {
      promptTokens: true,
      completionTokens: true,
    },
    where: {
      createdAt: {
        gte: sevenDaysAgo
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // 날짜별로 그룹화 (Prisma groupBy의 날짜 처리가 DB마다 다르므로 JS에서 처리)
  const allUsages = await prisma.tokenUsage.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo
      }
    },
    select: {
      createdAt: true,
      model: true,
      promptTokens: true,
      completionTokens: true
    }
  })

  const dailyStats = allUsages.reduce((acc, usage) => {
    const date = usage.createdAt.toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    }
    acc[date].promptTokens += usage.promptTokens
    acc[date].completionTokens += usage.completionTokens
    acc[date].totalTokens += usage.promptTokens + usage.completionTokens
    return acc
  }, {} as Record<string, any>)

  // 3. 사용자별 사용량 Top 5
  const userUsage = await prisma.tokenUsage.groupBy({
    by: ['userId'],
    _sum: {
      promptTokens: true,
      completionTokens: true,
    },
    orderBy: {
      _sum: {
        completionTokens: 'desc' // 총 토큰으로 정렬하고 싶으나 Prisma 제한으로 completionTokens 기준
      }
    },
    take: 5
  })

  // 사용자 이름 가져오기
  const userIds = userUsage.map(u => u.userId)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true }
  })

  const userStats = userUsage.map(usage => {
    const user = users.find(u => u.id === usage.userId)
    return {
      name: user?.name || user?.email || 'Unknown',
      promptTokens: usage._sum.promptTokens || 0,
      completionTokens: usage._sum.completionTokens || 0,
      totalTokens: (usage._sum.promptTokens || 0) + (usage._sum.completionTokens || 0)
    }
  })

  // 1-1. 모델 정보 가져오기 (매핑용)
  const models = await prisma.model.findMany({
    select: { id: true, name: true }
  })

  const modelNameMap = models.reduce((acc, model) => {
    acc[model.id] = model.name
    return acc
  }, {} as Record<string, string>)

  return {
    modelStats: modelUsage.map(m => ({
      name: modelNameMap[m.model] || m.model,
      value: (m._sum.promptTokens || 0) + (m._sum.completionTokens || 0)
    })),
    dailyStats: Object.values(dailyStats).sort((a: any, b: any) => a.date.localeCompare(b.date)),
    userStats
  }
}

// 감사 로그 가져오기
export async function getAuditLogs(page = 1, limit = 20) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const skip = (page - 1) * limit

  const [logs, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.adminAuditLog.count()
  ])

  return {
    logs,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

// 시스템 상태 가져오기 (Mock)
export async function getSystemStatus() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const os = require('os')

  return {
    uptime: os.uptime(),
    loadAvg: os.loadavg(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    platform: os.platform(),
    release: os.release(),
    nodeVersion: process.version,
    dbStatus: 'Connected', // Prisma가 에러 없이 호출되면 연결된 것
    serverTime: new Date().toISOString()
  }
}

// 시스템 설정 가져오기
export async function getSystemSettings() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const settings = await prisma.systemSetting.findMany()
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)
}

// 시스템 설정 업데이트
export async function updateSystemSetting(key: string, value: string) {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  await prisma.systemSetting.upsert({
    where: { key },
    update: {
      value,
      updatedBy: session.user.id
    },
    create: {
      key,
      value,
      updatedBy: session.user.id
    }
  })

  revalidatePath('/admin/settings')
  return { success: true }
}
