'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Coins } from 'lucide-react'

interface TokenCounterProps {
  usedTokens: number
  maxTokens: number
}

export function TokenCounter({ usedTokens, maxTokens }: TokenCounterProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show counter when there are tokens to display
    if (usedTokens > 0) {
      setIsVisible(true)
    }
  }, [usedTokens])

  if (!isVisible && usedTokens === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Coins className="h-4 w-4 text-muted-foreground" />
      <Badge variant="outline" className="font-mono text-xs">
        {usedTokens.toLocaleString()} / {maxTokens.toLocaleString()}
      </Badge>
    </div>
  )
}
