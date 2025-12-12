import { getModelConfig, DEFAULT_MODEL } from '@/lib/constants/models'

export function getMaxTokensForModel(modelId: string): number {
  const config = getModelConfig(modelId)
  return config?.maxTokens ?? getModelConfig(DEFAULT_MODEL)!.maxTokens
}

export function calculateTokenUsage(messages: any[]): number {
  // This is a simplified token calculation
  // In a real app, you'd use js-tiktoken for accurate counting
  return messages.reduce((total, message) => {
    return total + Math.ceil(message.content.length / 4)
  }, 0)
}

export function getTokenUsagePercentage(usedTokens: number, maxTokens: number): number {
  return (usedTokens / maxTokens) * 100
}

export function getTokenUsageStatus(percentage: number): {
  label: string
  color: string
} {
  if (percentage < 70) {
    return { label: '충분', color: 'text-muted-foreground' }
  } else if (percentage < 90) {
    return { label: '보통', color: 'text-yellow-500' }
  } else {
    return { label: '부족', color: 'text-destructive' }
  }
}
 
