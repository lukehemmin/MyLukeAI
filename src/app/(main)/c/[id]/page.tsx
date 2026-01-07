import { ChatArea } from '@/components/chat/ChatArea'
import { prisma } from '@/lib/prisma/client'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getEnabledModels } from '@/lib/data/models'

async function getConversation(id: string, userId: string) {
  try {
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

    return conversation
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return null
  }
}

export default async function ConversationPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const conversation = await getConversation(params.id, session.user.id)
  const models = await getEnabledModels()

  let userDefaultModelId: string | null = null
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true }
  })
  if (user?.preferences && typeof user.preferences === 'object') {
    userDefaultModelId = (user.preferences as any).defaultModelId || null
  }

  if (!conversation) {
    return <div className="flex items-center justify-center h-full">대화를 찾을 수 없습니다</div>
  }

  return (
    <div className="h-full">
      <ChatArea conversationId={conversation.id} models={models} userDefaultModelId={userDefaultModelId} />
    </div>
  )
}
