import { ChatArea } from '@/components/chat/ChatArea'
import { getEnabledModels } from '@/lib/data/models'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

export default async function HomePage() {
  const models = await getEnabledModels()
  const session = await auth()

  let userDefaultModelId: string | null = null
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true }
    })
    if (user?.preferences && typeof user.preferences === 'object') {
      userDefaultModelId = (user.preferences as any).defaultModelId || null
    }
  }

  return (
    <div className="h-full">
      <ChatArea models={models} userDefaultModelId={userDefaultModelId} />
    </div>
  )
}