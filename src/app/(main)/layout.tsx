import { MainLayoutClient } from '@/components/layout/MainLayoutClient'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { getEnabledModels } from '@/lib/data/models'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // 2FA 체크: 활성화되어 있고 아직 인증되지 않은 경우
  if (session.user.twoFactorEnabled && !session.twoFactorVerified) {
    redirect('/verify-2fa')
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      userId: session.user.id,
      isArchived: false, // 기본적으로 보관된 채팅은 숨김
      deletedAt: null, // 삭제된 채팅 제외
    },
    orderBy: [
      { isPinned: 'desc' },
      { orderIndex: 'asc' }, // 커스텀 정렬 순서
      { updatedAt: 'desc' },
    ],
    take: 50,
  })

  const models = await getEnabledModels()

  let userDefaultModelId: string | null = null
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true }
  })
  if (user?.preferences && typeof user.preferences === 'object') {
    userDefaultModelId = (user.preferences as any).defaultModelId || null
  }

  return (
    <MainLayoutClient
      conversations={conversations}
      user={session.user}
      models={models}
      userDefaultModelId={userDefaultModelId}
    >
      {children}
    </MainLayoutClient>
  )
}
