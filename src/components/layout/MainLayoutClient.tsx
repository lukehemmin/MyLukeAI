'use client'

import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
// Remove direct Prisma types from client bundle
import { useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface ConversationItem {
  id: string
  title: string
  updatedAt: Date
}

interface MainLayoutClientProps {
  children: React.ReactNode
  conversations: ConversationItem[]
  currentConversationId?: string
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function MainLayoutClient({ 
  children, 
  conversations, 
  currentConversationId,
  user
}: MainLayoutClientProps) {
  const router = useRouter()
  const { setSidebarOpen, setIsMobile } = useUIStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsMobile(isMobile)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile, setIsMobile, setSidebarOpen])

  const handleNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '새 대화',
        }),
      })

      if (response.ok) {
        const conversation = await response.json()
        router.push(`/c/${conversation.id}`)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleSelectConversation = (id: string) => {
    router.push(`/c/${id}`)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        user={user}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
