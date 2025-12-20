'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

// 사용자 목록과 채팅 통계 가져오기
export async function getUsersWithChatStats() {
    const session = await auth()
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized')

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            _count: {
                select: {
                    conversations: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    // 각 사용자별 삭제된 대화 수 등 추가 통계 필요 시 여기서 계산
    // 하지만 prisma _count는 deletedAt 조건 없이 전체 카운트함 (relation field count)
    // 세부적으로 하려면 groupBy 등을 써야 하나, 일단 전체 카운트로 만족하거나
    // 별도 쿼리로 deleted count를 가져올 수 있음.
    // 성능을 위해 일단 전체 카운트만 가져오고, 필요한 경우 개선.

    // 삭제된 대화 수를 정확히 알고 싶다면:
    const deletedCounts = await prisma.conversation.groupBy({
        by: ['userId'],
        where: {
            deletedAt: { not: null }
        },
        _count: {
            _all: true
        }
    })

    // 매핑
    const deletedCountMap = deletedCounts.reduce((acc, curr) => {
        acc[curr.userId] = curr._count._all
        return acc
    }, {} as Record<string, number>)

    return users.map(user => ({
        ...user,
        totalConversations: user._count.conversations,
        deletedConversations: deletedCountMap[user.id] || 0,
        activeConversations: user._count.conversations - (deletedCountMap[user.id] || 0)
    }))
}

// 특정 사용자의 대화 목록 가져오기 (삭제된 것 포함)
export async function getUserConversations(userId: string) {
    const session = await auth()
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized')

    return await prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            model: true,
            _count: {
                select: { messages: true }
            }
        }
    })
}

// 특정 대화의 메시지 가져오기
export async function getConversationMessages(conversationId: string) {
    const session = await auth()
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized')

    return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
    })
}
