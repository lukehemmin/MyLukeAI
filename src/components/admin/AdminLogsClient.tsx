'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    getUsersWithChatStats,
    getUserConversations,
    getConversationMessages
} from '@/lib/actions/admin-logs'
import { ArrowLeft, MessageSquare, Trash2, User as UserIcon, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

interface UserStats {
    id: string
    name: string | null
    email: string | null
    totalConversations: number
    activeConversations: number
    deletedConversations: number
}

interface Conversation {
    id: string
    title: string
    model: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: {
        messages: number
    }
}

interface Message {
    id: string
    role: string
    content: string
    createdAt: Date
}

export default function AdminLogsClient() {
    const [view, setView] = useState<'users' | 'conversations' | 'messages'>('users')
    const [users, setUsers] = useState<UserStats[]>([])
    const [selectedUser, setSelectedUser] = useState<UserStats | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Load Users
    useEffect(() => {
        if (view === 'users') {
            setIsLoading(true)
            getUsersWithChatStats()
                .then(res => setUsers(res as unknown as UserStats[]))
                .catch(console.error)
                .finally(() => setIsLoading(false))
        }
    }, [view])

    const handleUserSelect = async (user: UserStats) => {
        setSelectedUser(user)
        setIsLoading(true)
        try {
            const convs = await getUserConversations(user.id) as unknown as Conversation[]
            setConversations(convs)
            setView('conversations')
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConversationSelect = async (conv: Conversation) => {
        setSelectedConversation(conv)
        setIsLoading(true)
        try {
            const msgs = await getConversationMessages(conv.id) as unknown as Message[]
            setMessages(msgs)
            setView('messages')
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackToUsers = () => {
        setSelectedUser(null)
        setConversations([])
        setView('users')
    }

    const handleBackToConversations = () => {
        setSelectedConversation(null)
        setMessages([])
        setView('conversations')
    }

    if (view === 'users') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>사용자 대화 로그</CardTitle>
                    <CardDescription>사용자별 대화 내역 및 삭제된 대화를 조회합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-4">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>사용자</TableHead>
                                    <TableHead>이메일</TableHead>
                                    <TableHead className="text-center">총 대화</TableHead>
                                    <TableHead className="text-center">활성</TableHead>
                                    <TableHead className="text-center">삭제됨</TableHead>
                                    <TableHead className="text-right">작업</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name || 'Unknown'}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-center">{user.totalConversations}</TableCell>
                                        <TableCell className="text-center">{user.activeConversations}</TableCell>
                                        <TableCell className="text-center">
                                            {user.deletedConversations > 0 ? (
                                                <Badge variant="destructive">{user.deletedConversations}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleUserSelect(user)}>
                                                상세보기
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        )
    }

    if (view === 'conversations' && selectedUser) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                    <Button variant="ghost" size="sm" onClick={handleBackToUsers} className="mr-2">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <CardTitle>{selectedUser.name || selectedUser.email}의 대화 목록</CardTitle>
                        <CardDescription>
                            총 {conversations.length}개의 대화가 있습니다.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-4">Loading...</div>
                    ) : (
                        <div className="space-y-2">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                    onClick={() => handleConversationSelect(conv)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <MessageSquare className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{conv.title}</span>
                                                {conv.deletedAt && (
                                                    <Badge variant="destructive" className="h-5 text-[10px] px-1.5 flex gap-1 items-center">
                                                        <Trash2 className="h-3 w-3" /> Deleted
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 flex items-center space-x-2">
                                                <span className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {format(new Date(conv.createdAt), 'yyyy-MM-dd HH:mm')}
                                                </span>
                                                <span>•</span>
                                                <span>{conv.model}</span>
                                                <span>•</span>
                                                <span>{conv._count.messages} messages</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="ghost" size="icon">
                                            <ArrowLeft className="h-4 w-4 rotate-180" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    대화 기록이 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    if (view === 'messages' && selectedConversation) {
        return (
            <Card className="h-[calc(100vh-100px)]">
                <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b">
                    <Button variant="ghost" size="sm" onClick={handleBackToConversations} className="mr-2">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <CardTitle className="text-base truncate max-w-[500px]">{selectedConversation.title}</CardTitle>
                            {selectedConversation.deletedAt && (
                                <Badge variant="destructive">Deleted</Badge>
                            )}
                        </div>
                        <CardDescription className="text-xs">
                            {selectedConversation.id} • {selectedConversation.model}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted border'
                                            }`}
                                    >
                                        <div className="text-xs opacity-70 mb-1 flex items-center justify-between gap-2">
                                            <span className="capitalize font-bold">{msg.role}</span>
                                            <span>{format(new Date(msg.createdAt), 'HH:mm:ss')}</span>
                                        </div>
                                        <div className="whitespace-pre-wrap text-sm">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    메시지가 없습니다.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        )
    }

    return null
}
