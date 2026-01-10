'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'

export async function shareConversation(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    const conversation = await prisma.conversation.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
    })

    if (!conversation) {
        throw new Error('Conversation not found')
    }

    const updated = await prisma.conversation.update({
        where: { id },
        data: { isShared: true },
    })

    revalidatePath('/')
    revalidatePath(`/c/${id}`)

    return { success: true, conversation: updated }
}

export async function renameConversation(id: string, title: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    await prisma.conversation.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: { title },
    })

    revalidatePath('/')
    revalidatePath(`/c/${id}`)
}

export async function togglePinConversation(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id, userId: session.user.id },
    })

    if (!conversation) {
        throw new Error('Conversation not found')
    }

    await prisma.conversation.update({
        where: { id },
        data: { isPinned: !conversation.isPinned },
    })

    revalidatePath('/')
}

export async function toggleArchiveConversation(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id, userId: session.user.id },
    })

    if (!conversation) {
        throw new Error('Conversation not found')
    }

    await prisma.conversation.update({
        where: { id },
        data: { isArchived: !conversation.isArchived },
    })

    revalidatePath('/')
}

export async function deleteConversation(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    // Soft delete
    await prisma.conversation.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: {
            deletedAt: new Date(),
        },
    })

    revalidatePath('/')
}

export async function restoreConversation(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    await prisma.conversation.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: {
            deletedAt: null,
        },
    })

    revalidatePath('/')
}

export async function permanentDeleteConversation(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    await prisma.conversation.delete({
        where: {
            id,
            userId: session.user.id,
        },
    })

    revalidatePath('/')
}

export async function getTrashConversations() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    return await prisma.conversation.findMany({
        where: {
            userId: session.user.id,
            deletedAt: { not: null },
        },
        orderBy: { deletedAt: 'desc' },
    })
}

export async function getArchivedConversations() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    return await prisma.conversation.findMany({
        where: {
            userId: session.user.id,
            isArchived: true,
            deletedAt: null, // Ensure we don't fetch deleted archived chats
        },
        orderBy: { updatedAt: 'desc' },
    })
}

export async function reorderConversations(items: { id: string, orderIndex: number }[]) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    // 트랜잭션으로 일괄 업데이트
    await prisma.$transaction(
        items.map((item) =>
            prisma.conversation.update({
                where: {
                    id: item.id,
                    userId: session.user.id
                },
                // @ts-ignore
                data: { orderIndex: item.orderIndex }
            })
        )
    )

    revalidatePath('/')
}
