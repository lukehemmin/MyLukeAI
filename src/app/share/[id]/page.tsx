import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import { ChatArea } from '@/components/chat/ChatArea'
import { Metadata } from 'next'

interface SharePageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
    const conversation = await prisma.conversation.findUnique({
        where: { id: params.id },
    })

    if (!conversation || !conversation.isShared) {
        return {
            title: 'Not Found',
        }
    }

    return {
        title: `${conversation.title} - Shared Chat`,
    }
}

export default async function SharePage({ params }: SharePageProps) {
    const conversation = await prisma.conversation.findUnique({
        where: { id: params.id },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!conversation || !conversation.isShared) {
        notFound()
    }

    // We reuse ChatArea but in read-only mode if possible, or we create a simple viewer.
    // ChatArea might need a "readOnly" prop or we just render messages.
    // For quick implementation reusing ChatArea with a flag is best, or passing empty 'models'.
    // However, ChatArea interacts with AI. Shared view should be just static.
    // Let's create a simple read-only view here to avoid complex logic in ChatArea for now.

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="border-b p-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-lg">{conversation.title}</h1>
                    <span className="text-sm text-muted-foreground">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </header>
            <div className="flex-1 overflow-auto p-4 max-w-3xl mx-auto w-full space-y-4">
                {conversation.messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[85%] ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                        >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
