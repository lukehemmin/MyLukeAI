import { prisma } from '@/lib/prisma/client'
import { ModelConfig } from '@/types/chat'
import { getEnabledModels as getStaticEnabledModels } from '@/lib/constants/models'

export async function getEnabledModels(): Promise<ModelConfig[]> {
  try {
    const dbModels = await prisma.model.findMany({
      where: {
        isEnabled: true,
        isPublic: true // Or handle permission based logic if needed
      },
      orderBy: {
        order: 'asc' // Sort by order field
      }
    })

    if (dbModels.length === 0) {
      return getStaticEnabledModels()
    }

    return dbModels.map(model => ({
      id: model.id, // Use DB ID (CUID)
      name: model.name,
      provider: model.provider as any, // Cast or map strictly
      maxTokens: model.contextLength || 128000, // Default fallback
      description: model.description || undefined,
      enabled: model.isEnabled,
      isDefault: model.isDefault // Map new field
    }))
  } catch (error) {
    console.error('Failed to fetch models from DB:', error)
    return getStaticEnabledModels()
  }
}
