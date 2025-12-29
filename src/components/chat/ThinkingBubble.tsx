'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, BrainCircuit } from 'lucide-react'

interface ThinkingBubbleProps {
    content: string
}

export function ThinkingBubble({ content }: ThinkingBubbleProps) {
    const [isOpen, setIsOpen] = useState(true)

    if (!content) return null

    return (
        <div className="mb-2 rounded-md border border-border/50 bg-muted/30 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors text-left"
            >
                <BrainCircuit size={14} />
                <span>생각 과정 {isOpen ? '접기' : '펼치기'}</span>
                <div className="ml-auto">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
            </button>

            {isOpen && (
                <div className="px-3 pb-3 pt-0">
                    <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-border/50 pt-2 mt-1">
                        {content}
                    </div>
                </div>
            )}
        </div>
    )
}
