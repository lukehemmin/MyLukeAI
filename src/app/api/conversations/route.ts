import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma/client'

// GET: Get all conversations for the user
export const GET = withAuth(async (req, userId) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })
    
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
})

// POST: Create a new conversation
export const POST = withAuth(async (req, userId) => {
  try {
    const { title, model } = await req.json()
    
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title || 'New Chat',
        model: model || 'gpt-4o-mini',
      },
    })
    
    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
})