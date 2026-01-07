'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ImageViewerProps {
    src: string
    alt?: string
    check?: boolean
    isOpen: boolean
    onClose: () => void
}

export function ImageViewer({ src, alt = 'Image', isOpen, onClose }: ImageViewerProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div className="absolute top-4 right-4 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>
            </div>
            <div
                className="relative max-w-full max-h-full w-auto h-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={1200}
                    className="max-w-screen max-h-screen object-contain"
                    unoptimized
                />
            </div>
        </div>
    )
}
