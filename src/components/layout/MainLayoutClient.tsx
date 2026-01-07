'use client'

import { useRouter, useParams } from 'next/navigation'
import { Sidebar } from './Sidebar'
// Remove direct Prisma types from client bundle
import { useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { ModelConfig } from '@/types/chat'

interface ConversationItem {
  id: string
  title: string
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
  isShared: boolean
  orderIndex: number
}

interface MainLayoutClientProps {
  children: React.ReactNode
  conversations: ConversationItem[]
  currentConversationId?: string // This is optional props but we will override it with params
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
  models?: ModelConfig[]
  userDefaultModelId?: string | null
}

export function MainLayoutClient({
  children,
  conversations,
  currentConversationId: propConversationId,
  user,
  models,
  userDefaultModelId
}: MainLayoutClientProps) {
  const router = useRouter()
  const params = useParams()
  const currentConversationId = (params?.id as string) || propConversationId

  const { setSidebarOpen, setIsMobile } = useUIStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsMobile(isMobile)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile, setIsMobile, setSidebarOpen])

  const handleNewConversation = async () => {
    router.push('/')
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
        models={models}
        userDefaultModelId={userDefaultModelId}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
