import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma/client'

// GET: Get a specific conversation
export const GET = withAuth(async (req, userId, context) => {
  try {
    const { id } = await context!.params

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
})

// PATCH: Update a conversation
export const PATCH = withAuth(async (req, userId, context) => {
  try {
    const { id } = await context!.params

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    const { title, systemPrompt } = await req.json()

    // Verify the conversation belongs to the user
    const existing = await prisma.conversation.findFirst({
      where: { id, userId },
      select: { id: true }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(systemPrompt !== undefined && { systemPrompt }),
      },
    })

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
})

// DELETE: Delete a conversation
export const DELETE = withAuth(async (req, userId, context) => {
  try {
    const { id } = await context!.params

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    // Verify the conversation belongs to the user
    const existing = await prisma.conversation.findFirst({
      where: { id, userId },
      select: { id: true }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Check for chat logging setting
    const loggingSetting = await prisma.systemSetting.findUnique({
      where: { key: 'chat_logging_enabled' }
    })
    const isLoggingEnabled = loggingSetting?.value === 'true'

    if (isLoggingEnabled) {
      // Soft Delete
      await prisma.conversation.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
    } else {
      // Hard Delete
      await prisma.conversation.delete({
        where: { id }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
})