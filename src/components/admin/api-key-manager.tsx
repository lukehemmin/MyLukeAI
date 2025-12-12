'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { KeyIcon, PlusIcon, TrashIcon, PencilIcon, EyeIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ApiKey {
  id: string
  name: string
  provider: string
  baseUrl?: string | null
  description: string | null
  isActive: boolean
  expiresAt: string | null
  lastUsedAt: string | null
  usageCount: number
  createdAt: string
  updatedAt: string
  creator: {
    id: string
    name: string | null
    email: string
  }
}

interface ApiKeyFormData {
  name: string
  apiKey: string
  provider: string
  baseUrl: string
  description: string
  expiresAt: string
}

export function ApiKeyManager() {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [deletingKey, setDeletingKey] = useState<ApiKey | null>(null)
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    apiKey: '',
    provider: 'openai',
    baseUrl: '',
    description: '',
    expiresAt: ''
  })

  const providers = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'gemini', label: 'Google Gemini' },
    { value: 'openrouter', label: 'OpenRouter' }
  ]

  const fetchApiKeys = useCallback(async (showErrorToast = true) => {
    try {
      const response = await fetch('/api/admin/keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys)
      } else {
        if (showErrorToast) {
          toast({
            title: '오류',
            description: 'API 키 목록을 불러오는데 실패했습니다.',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('API 키 목록 조회 실패:', error)
      if (showErrorToast) {
        toast({
          title: '오류',
          description: 'API 키 목록을 불러오는데 실패했습니다.',
          variant: 'destructive'
        })
      }
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchApiKeys(true)
    
    // 10초마다 자동 갱신
    const intervalId = setInterval(() => {
      fetchApiKeys(false)
    }, 10000)

    return () => clearInterval(intervalId)
  }, [fetchApiKeys])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingKey ? `/api/admin/keys/${editingKey.id}` : '/api/admin/keys'
      const method = editingKey ? 'PATCH' : 'POST'
      
      const body = editingKey ? {
        name: formData.name,
        description: formData.description,
        baseUrl: formData.baseUrl || null,
        isActive: true,
        expiresAt: formData.expiresAt || null
      } : {
        name: formData.name,
        apiKey: formData.apiKey,
        provider: formData.provider,
        baseUrl: formData.baseUrl || null,
        description: formData.description,
        expiresAt: formData.expiresAt || null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({
          title: '성공',
          description: editingKey ? 'API 키가 수정되었습니다.' : 'API 키가 생성되었습니다.'
        })
        resetForm()
        fetchApiKeys()
      } else {
        const error = await response.json()
        toast({
          title: '오류',
          description: error.error || '작업에 실패했습니다.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('API 키 저장 실패:', error)
      toast({
        title: '오류',
        description: 'API 키 저장에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingKey) return

    try {
      const response = await fetch(`/api/admin/keys/${deletingKey.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: '성공',
          description: 'API 키가 삭제되었습니다.'
        })
        setDeletingKey(null)
        fetchApiKeys()
      } else {
        const error = await response.json()
        toast({
          title: '오류',
          description: error.error || '삭제에 실패했습니다.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('API 키 삭제 실패:', error)
      toast({
        title: '오류',
        description: 'API 키 삭제에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingKey(null)
    setFormData({
      name: '',
      apiKey: '',
      provider: 'openai',
      baseUrl: '',
      description: '',
      expiresAt: ''
    })
  }

  const startEdit = (key: ApiKey) => {
    setEditingKey(key)
    setFormData({
      name: key.name,
      apiKey: '', // 보안상 실제 키는 표시하지 않음
      provider: key.provider,
      baseUrl: key.baseUrl || '',
      description: key.description || '',
      expiresAt: key.expiresAt ? key.expiresAt.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const getProviderDisplayName = (provider: string) => {
    const names = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic',
      'gemini': 'Google Gemini',
      'openrouter': 'OpenRouter'
    }
    return names[provider as keyof typeof names] || provider
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">API 키 목록</h2>
          <p className="text-sm text-gray-600">총 {apiKeys.length}개의 API 키</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          새 API 키 추가
        </Button>
      </div>

      {/* API 키 목록 */}
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <Card key={key.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{key.name}</h3>
                    <Badge 
                      variant={key.isActive && !isExpired(key.expiresAt) ? 'default' : 'destructive'}
                    >
                      {key.isActive && !isExpired(key.expiresAt) ? '활성' : '비활성'}
                    </Badge>
                    <Badge variant="outline">{getProviderDisplayName(key.provider)}</Badge>
                  </div>
                  {key.description && (
                    <p className="text-sm text-gray-600">{key.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(key)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDeletingKey(key)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">사용 횟수</p>
                  <p className="font-medium">{key.usageCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">마지막 사용</p>
                  <p className="font-medium">
                    {key.lastUsedAt ? (
                      formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true, locale: ko })
                    ) : (
                      '미사용'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">생성일</p>
                  <p className="font-medium">
                    {new Date(key.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">생성자</p>
                  <p className="font-medium">{key.creator.name || key.creator.email}</p>
                </div>
              </div>
              {key.expiresAt && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      만료일: {new Date(key.expiresAt).toLocaleDateString('ko-KR')}
                      {isExpired(key.expiresAt) && ' (만료됨)'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {apiKeys.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <KeyIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">API 키가 없습니다</h3>
            <p className="text-gray-600 mb-4">AI 제공자의 API 키를 추가하여 시작하세요.</p>
            <Button onClick={() => setShowForm(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              첫 API 키 추가
            </Button>
          </CardContent>
        </Card>
      )}

      {/* API 키 추가/수정 대화상자 */}
      <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingKey ? 'API 키 수정' : '새 API 키 추가'}</DialogTitle>
            <DialogDescription>
              {editingKey 
                ? 'API 키 정보를 수정합니다. 보안을 위해 키 값은 수정할 수 없습니다.' 
                : '새로운 API 키를 등록합니다. 키는 암호화되어 안전하게 저장됩니다.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 내 GPT-4 키"
                required
              />
            </div>
            
            {!editingKey && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API 키</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="sk-..."
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="provider">제공자</Label>
              <div className="flex space-x-2">
                <Select 
                  disabled={!!editingKey} 
                  value={providers.some(p => p.value === formData.provider) ? formData.provider : 'custom'}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setFormData({ ...formData, provider: '' })
                    } else {
                      setFormData({ ...formData, provider: value })
                    }
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                    <SelectItem value="custom">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  disabled={!!editingKey && providers.some(p => p.value === editingKey.provider)}
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="provider-id"
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                사용자 정의 제공자의 경우 &apos;custom-provider&apos;와 같이 입력하세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL (선택사항)</Label>
              <Input
                id="baseUrl"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="예: https://api.openai.com/v1"
              />
              <p className="text-xs text-gray-500">
                기본값을 사용하려면 비워두세요. (OpenAI 호환 API 사용 시 입력)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택사항)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="키에 대한 설명"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">만료일 (선택사항)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>취소</Button>
              <Button type="submit">{editingKey ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deletingKey} onOpenChange={() => setDeletingKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API 키 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 <span className="font-semibold">{deletingKey?.name}</span> API 키를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없으며, 연결된 사용 기록도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
