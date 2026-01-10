'use client'

import { Copy, Pencil, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MessageActionsProps {
    content: string
    onEdit: () => void
    isEditable?: boolean
}

export function MessageActions({ content, onEdit, isEditable = true }: MessageActionsProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
                title="복사"
            >
                {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                ) : (
                    <Copy className="h-3 w-3" />
                )}
            </Button>
            {isEditable && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={onEdit}
                    title="수정"
                >
                    <Pencil className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
}
