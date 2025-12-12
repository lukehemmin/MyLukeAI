import { ModelConfig } from '@/types/chat'

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    maxTokens: 128000,
    badge: '추천',
    description: '빠르고 효율적인 범용 모델',
    enabled: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 128000,
    badge: '고급',
    description: '최고 성능의 멀티모달 모델',
    enabled: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    maxTokens: 128000,
    description: '비용 효율적인 고성능 모델',
    enabled: true,
  },
] as const

export const DEFAULT_MODEL = 'gpt-4o-mini'

// 활성화된 모델만 필터링
export const getEnabledModels = () => 
  AVAILABLE_MODELS.filter(m => m.enabled)

// 모델 ID로 설정 조회
export const getModelConfig = (id: string) => 
  AVAILABLE_MODELS.find(m => m.id === id)