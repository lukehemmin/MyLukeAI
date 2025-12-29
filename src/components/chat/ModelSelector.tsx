'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ModelConfig } from '@/types/chat'

interface ModelSelectorProps {
  value: string
  onChange: (modelId: string) => void
  models: ModelConfig[]
}

export function ModelSelector({ value, onChange, models }: ModelSelectorProps) {
  const enabledModels = models.filter(m => m.enabled)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[140px]">
        <SelectValue placeholder="모델 선택" />
      </SelectTrigger>
      <SelectContent>
        {enabledModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2">
              <span>{model.name}</span>
              {model.badge && (
                <Badge variant="secondary" className="text-xs">
                  {model.badge}
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}