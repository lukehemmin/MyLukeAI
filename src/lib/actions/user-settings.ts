'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'

export async function setUserDefaultModel(modelId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const currentPreferences = (user.preferences as Record<string, any>) || {}

  // Update preferences with new default model (or toggle if needed, but usually we just set it)
  // If modelId is empty, maybe unset it? But UI will probably just send a valid ID.

  const newPreferences = {
    ...currentPreferences,
    defaultModelId: modelId
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      preferences: newPreferences
    }
  })

  revalidatePath('/')
  revalidatePath('/c/[id]', 'page')
  return { success: true }
}
