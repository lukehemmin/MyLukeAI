'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'

export async function updatePreferences(preferences: any) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // 기존 preferences를 가져와서 병합
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true }
  })

  const currentPreferences = (user?.preferences as Record<string, any>) || {}
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      preferences: {
        ...currentPreferences,
        ...preferences
      }
    }
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteAllConversations() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await prisma.conversation.deleteMany({
    where: { userId: session.user.id }
  })

  revalidatePath('/')
  return { success: true }
}
