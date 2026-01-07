'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { ModelConfig } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  value: string
  onChange: (modelId: string) => void
  models: ModelConfig[]
  userDefaultModelId?: string | null
  onSetDefaultModel: (modelId: string) => void
}

export function ModelSelector({ value, onChange, models, userDefaultModelId, onSetDefaultModel }: ModelSelectorProps) {
  const enabledModels = models.filter(m => m.enabled)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[140px]">
        <SelectValue placeholder="모델 선택" />
      </SelectTrigger>
      <SelectContent>
        {enabledModels.map((model) => {
          const isUserDefault = userDefaultModelId === model.id
          const isSystemDefault = model.isDefault

          return (
            <SelectItem key={model.id} value={model.id} className="group">
              <div className="flex items-center justify-between w-full min-w-[240px] gap-2">
                <div className="flex items-center gap-2">
                  <span>{model.name}</span>
                  {model.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {model.badge}
                    </Badge>
                  )}
                  {isSystemDefault && !userDefaultModelId && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1 text-muted-foreground">
                      기본
                    </Badge>
                  )}
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100",
                    isUserDefault && "opacity-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSetDefaultModel(model.id)
                  }}
                  title="기본 모델로 설정"
                >
                  <Star
                    className={cn(
                      "h-3.5 w-3.5",
                      isUserDefault ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
                    )}
                  />
                </div>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}