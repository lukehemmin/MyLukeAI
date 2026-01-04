'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Check, CheckCircle2, RefreshCw, RotateCcw, Search, Settings2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { bulkDeleteModels, deleteModel, resetAllModels, setDefaultModel, syncModels, updateModel, updateModelOrder } from '@/lib/actions/admin-models'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface Model {
  id: string
  apiModelId: string
  provider: string
  name: string
  isEnabled: boolean
  isPublic: boolean
  supportsStreaming: boolean
  order: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  apiKey?: {
    name: string
  } | null
  type?: 'TEXT' | 'TEXT_VISION' | 'IMAGE' | 'AUDIO'
}

interface AdminModelsClientProps {
  initialModels: Model[]
}

const getApiKeyLabel = (model: Model) => model.apiKey?.name || '기본 그룹 (API 키 없음)'

export default function AdminModelsClient({ initialModels }: AdminModelsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  // 정렬된 상태로 초기화 & 로컬 상태 관리 시 순서 반영
  const [models, setModels] = useState<Model[]>(() =>
    [...initialModels].sort((a, b) => a.order - b.order)
  )

  useEffect(() => {
    setModels([...initialModels].sort((a, b) => a.order - b.order))
  }, [initialModels])

  const [isSyncing, setIsSyncing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [apiKeyFilter, setApiKeyFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  // 순서 설정 다이얼로그 상태
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [orderedModels, setOrderedModels] = useState<Model[]>([])
  const [defaultModelId, setDefaultModelId] = useState<string>('')

  const [modalState, setModalState] = useState({
    name: '',
    isEnabled: false,
    isPublic: false,
    supportsStreaming: false,
    type: 'TEXT' as 'TEXT' | 'TEXT_VISION' | 'IMAGE' | 'AUDIO'
  })

  useEffect(() => {
    if (isOrderDialogOpen) {
      // 다이얼로그 열릴 때 활성화된 모델만 가져와서 순서대로 정렬
      const activeModels = models
        .filter(m => m.isEnabled)
        .sort((a, b) => a.order - b.order)
      setOrderedModels(activeModels)

      const defaultModel = models.find(m => m.isDefault)
      setDefaultModelId(defaultModel?.id || activeModels[0]?.id || '')
    }
  }, [isOrderDialogOpen, models])

  const apiKeyOptions = useMemo(() => {
    const names = new Set<string>()
    models.forEach(model => names.add(getApiKeyLabel(model)))
    return Array.from(names)
  }, [models])

  const filteredModels = models
    .filter(model =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.apiModelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(model => apiKeyFilter === 'all' ? true : getApiKeyLabel(model) === apiKeyFilter)

  const groupedModels = filteredModels.reduce((acc, model) => {
    const groupName = getApiKeyLabel(model)
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push(model)
    return acc
  }, {} as Record<string, Model[]>)

  const filteredIds = filteredModels.map(model => model.id)
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id))
  const partiallySelected = filteredIds.some(id => selectedIds.has(id)) && !allSelected

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncModels()
      if (result.success) {
        toast({
          title: "모델 동기화 완료",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{result.count}개의 모델이 동기화되었습니다.</span>
            </div>
          ),
        })
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "동기화 실패",
        description: "모델 동기화 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('정말 모든 모델을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

    setIsResetting(true)
    try {
      await resetAllModels()
      setModels([])
      setSelectedIds(new Set())
      setModels([])
      setSelectedIds(new Set())
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>모든 모델이 삭제되었습니다.</span>
          </div>
        )
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', description: "초기화 실패" })
    } finally {
      setIsResetting(false)
    }
  }

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    const next = new Set(selectedIds)
    if (checked) {
      filteredIds.forEach(id => next.add(id))
    } else {
      filteredIds.forEach(id => next.delete(id))
    }
    setSelectedIds(next)
  }

  const handleRowSelect = (id: string, checked: boolean | 'indeterminate') => {
    const next = new Set(selectedIds)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    setSelectedIds(next)
  }

  const openModelModal = (model: Model) => {
    setSelectedModel(model)
    setModalState({
      name: model.name,
      isEnabled: model.isEnabled,
      isPublic: model.isPublic,
      supportsStreaming: model.supportsStreaming,
      type: (model.type as any) || 'TEXT'
    })
  }

  const closeModelModal = () => {
    setSelectedModel(null)
  }

  const handleSaveModel = async () => {
    if (!selectedModel) return
    const trimmedName = modalState.name.trim()
    if (!trimmedName) {
      toast({ variant: 'destructive', description: "표시 이름을 입력해주세요." })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: trimmedName,
        isEnabled: modalState.isEnabled,
        isPublic: modalState.isPublic,
        supportsStreaming: modalState.supportsStreaming,
        type: modalState.type
      }
      await updateModel(selectedModel.id, payload)
      setModels(prev => prev.map(model => model.id === selectedModel.id ? { ...model, ...payload } : model))
      setSelectedModel(prev => prev ? { ...prev, ...payload, name: trimmedName } : prev)
      setSelectedModel(prev => prev ? { ...prev, ...payload, name: trimmedName } : prev)
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>모델이 저장되었습니다.</span>
          </div>
        )
      })
      closeModelModal()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', description: "모델 저장에 실패했습니다." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSingle = async () => {
    if (!selectedModel) return
    if (!confirm('이 모델을 삭제하시겠습니까?')) return

    setIsSaving(true)
    try {
      await deleteModel(selectedModel.id)
      setModels(prev => prev.filter(model => model.id !== selectedModel.id))
      setSelectedIds(prev => {
        const next = new Set(prev)
        next.delete(selectedModel.id)
        return next
      })
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>모델이 삭제되었습니다.</span>
          </div>
        )
      })
      closeModelModal()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', description: "삭제 실패" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`선택한 ${selectedIds.size}개 모델을 삭제하시겠습니까?`)) return

    setIsBulkDeleting(true)
    try {
      const ids = Array.from(selectedIds)
      await bulkDeleteModels(ids)
      setModels(prev => prev.filter(model => !selectedIds.has(model.id)))
      setSelectedIds(new Set())
      setModels(prev => prev.filter(model => !selectedIds.has(model.id)))
      setSelectedIds(new Set())
      toast({
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>선택한 모델이 삭제되었습니다.</span>
          </div>
        )
      })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', description: "선택 삭제 실패" })
    } finally {
      setIsBulkDeleting(false)
    }
  }

  // 순서 변경 핸들러
  const moveModel = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === orderedModels.length - 1) return

    const newOrderedModels = [...orderedModels]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    // Swap
    const temp = newOrderedModels[index]
    newOrderedModels[index] = newOrderedModels[targetIndex]
    newOrderedModels[targetIndex] = temp

    setOrderedModels(newOrderedModels)
  }

  // 순서 및 기본 설정 저장
  const handleSaveOrder = async () => {
    setIsSaving(true)
    try {
      // 1. 순서 업데이트 데이터 생성
      const orderUpdates = orderedModels.map((model, index) => ({
        id: model.id,
        order: index
      }))

      // 2. 서버 액션 호출 (순서)
      await updateModelOrder(orderUpdates)

      // 3. 서버 액션 호출 (기본 모델)
      if (defaultModelId) {
        await setDefaultModel(defaultModelId)
      }

      // 4. 로컬 상태 업데이트
      setModels(prev => {
        const next = prev.map(m => {
          const newOrder = orderUpdates.find(u => u.id === m.id)?.order ?? m.order
          const isDefault = m.id === defaultModelId
          return { ...m, order: newOrder, isDefault }
        })
        return next.sort((a, b) => a.order - b.order)
      })

      toast({
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>설정이 저장되었습니다.</span>
          </div>
        )
      })
      setIsOrderDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', description: "설정 저장 실패" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">모델 관리</h2>
          <p className="text-muted-foreground">
            시스템에서 사용할 AI 모델을 관리하고 접근 권한을 설정합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* 순서 설정 버튼 추가 */}
          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" />
                모델 순서 설정
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>모델 순서 및 기본 설정</DialogTitle>
                <DialogDescription>
                  모델 목록에 표시될 순서와 기본으로 선택될 모델을 설정합니다. (활성화된 모델만 표시됩니다)
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto py-4 pr-2">
                <RadioGroup value={defaultModelId} onValueChange={setDefaultModelId}>
                  <div className="space-y-2">
                    {orderedModels.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        활성화된 모델이 없습니다.
                      </p>
                    ) : (
                      orderedModels.map((model, index) => (
                        <div
                          key={model.id}
                          className="flex items-center justify-between rounded-lg border p-3 bg-card"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                disabled={index === 0}
                                onClick={() => moveModel(index, 'up')}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                disabled={index === orderedModels.length - 1}
                                onClick={() => moveModel(index, 'down')}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-medium truncate">{model.name}</span>
                              <span className="text-xs text-muted-foreground truncate">{model.apiModelId}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={model.id} id={`default-${model.id}`} />
                              <Label htmlFor={`default-${model.id}`} className="text-sm font-normal cursor-pointer text-muted-foreground">
                                기본값
                              </Label>
                            </div>
                            {model.id === defaultModelId && (
                              <Badge variant="secondary" className="hidden sm:inline-flex">Default</Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>취소</Button>
                <Button onClick={handleSaveOrder} disabled={isSaving}>
                  {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={selectedIds.size === 0 || isBulkDeleting}
          >
            <Trash2 className={`mr-2 h-4 w-4 ${isBulkDeleting ? 'animate-spin' : ''}`} />
            선택 삭제{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
          </Button>
          <Button variant="secondary" onClick={handleReset} disabled={isResetting}>
            <RotateCcw className={`mr-2 h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            모델 초기화
          </Button>
          <Button onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? '동기화 중...' : '모델 동기화'}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="모델 이름, ID 또는 제공자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap text-sm text-muted-foreground">API 키 필터</Label>
          <Select value={apiKeyFilter} onValueChange={setApiKeyFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="모든 API 키" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 API 키</SelectItem>
              {apiKeyOptions.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(groupedModels).length === 0 ? (
          <div className="rounded-md border p-8 text-center text-muted-foreground">
            모델이 없습니다. &apos;모델 동기화&apos; 버튼을 눌러 모델을 가져오세요.
          </div>
        ) : (
          Object.entries(groupedModels).map(([groupName, groupModels]) => (
            <div key={groupName} className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Badge variant="secondary">{groupName}</Badge>
                <span className="text-sm font-normal text-muted-foreground">
                  ({groupModels.length}개 모델)
                </span>
                {/* 1.3: 기본 모델 표시 */}
              </h3>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[45px]">
                        <Checkbox
                          checked={allSelected ? true : partiallySelected ? 'indeterminate' : false}
                          onCheckedChange={handleSelectAll}
                          aria-label="모두 선택"
                        />
                      </TableHead>
                      <TableHead>제공자</TableHead>
                      <TableHead>API 키 이름</TableHead>
                      <TableHead>모델 ID (API)</TableHead>
                      <TableHead>표시 이름</TableHead>
                      <TableHead>타입</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>공개</TableHead>
                      <TableHead className="w-[80px]">기본</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupModels.map((model) => (
                      <TableRow
                        key={model.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openModelModal(model)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.has(model.id)}
                            onCheckedChange={(checked) => handleRowSelect(model.id, checked)}
                            aria-label="모델 선택"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {model.provider}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getApiKeyLabel(model)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{model.apiModelId}</TableCell>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {model.type || 'TEXT'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={model.isEnabled ? 'default' : 'outline'}>
                            {model.isEnabled ? '사용 가능' : '비활성화'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={model.isPublic ? 'secondary' : 'outline'}>
                            {model.isPublic ? '공개' : '비공개'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {model.isDefault && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedModel} onOpenChange={(open) => !open && closeModelModal()}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>모델 상세 설정</DialogTitle>
            <DialogDescription>
              API 키, 모델 ID, 표시 이름과 공개/사용 상태를 한 곳에서 관리합니다.
            </DialogDescription>
          </DialogHeader>

          {selectedModel && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>API 키 이름</Label>
                <Input value={getApiKeyLabel(selectedModel)} readOnly />
              </div>
              <div className="grid gap-2">
                <Label>모델 ID (API)</Label>
                <Input value={selectedModel.apiModelId} readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model-name">표시 이름</Label>
                <Input
                  id="model-name"
                  value={modalState.name}
                  onChange={(e) => setModalState({ ...modalState, name: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">사용 상태</p>
                  <p className="text-sm text-muted-foreground">비활성화 시 관리자 외에 노출되지 않습니다.</p>
                </div>
                <Switch
                  checked={modalState.isEnabled}
                  onCheckedChange={(checked) => setModalState({ ...modalState, isEnabled: !!checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">공개 여부</p>
                  <p className="text-sm text-muted-foreground">일반 사용자 모델 목록에 포함할지 여부입니다.</p>
                </div>
                <Switch
                  checked={modalState.isPublic}
                  onCheckedChange={(checked) => setModalState({ ...modalState, isPublic: !!checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">스트림 응답</p>
                  <p className="text-sm text-muted-foreground">활성화 시 AI 응답이 실시간으로 스트리밍됩니다.</p>
                </div>
                <Switch
                  checked={modalState.supportsStreaming}
                  onCheckedChange={(checked) => setModalState({ ...modalState, supportsStreaming: !!checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">모델 타입</p>
                  <p className="text-sm text-muted-foreground">모델의 용도를 지정합니다 (채팅 필터링 등에 사용).</p>
                </div>
                <Select
                  value={modalState.type}
                  onValueChange={(val) => setModalState({ ...modalState, type: val as any })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">텍스트 (TEXT)</SelectItem>
                    <SelectItem value="TEXT_VISION">텍스트+비전 (TEXT_VISION)</SelectItem>
                    <SelectItem value="IMAGE">이미지 생성 (IMAGE)</SelectItem>
                    <SelectItem value="AUDIO">오디오 (AUDIO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={closeModelModal} className="w-full sm:w-auto">
              닫기
            </Button>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                variant="destructive"
                onClick={handleDeleteSingle}
                disabled={isSaving || !selectedModel}
                className="w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                모델 제거
              </Button>
              <Button onClick={handleSaveModel} disabled={isSaving || !selectedModel} className="w-full sm:w-auto">
                저장
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
