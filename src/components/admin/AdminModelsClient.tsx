'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { bulkDeleteModels, deleteModel, resetAllModels, syncModels, updateModel } from '@/lib/actions/admin-models'

interface Model {
  id: string
  apiModelId: string
  provider: string
  name: string
  isEnabled: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  apiKey?: {
    name: string
  } | null
}

interface AdminModelsClientProps {
  initialModels: Model[]
}

const getApiKeyLabel = (model: Model) => model.apiKey?.name || '기본 그룹 (API 키 없음)'

export default function AdminModelsClient({ initialModels }: AdminModelsClientProps) {
  const router = useRouter()
  const [models, setModels] = useState<Model[]>(initialModels)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [apiKeyFilter, setApiKeyFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [modalState, setModalState] = useState({
    name: '',
    isEnabled: false,
    isPublic: false
  })

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
        alert(`${result.count}개의 모델이 동기화되었습니다.`)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      alert('동기화 실패')
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
      alert('모든 모델이 삭제되었습니다.')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('초기화 실패')
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
      isPublic: model.isPublic
    })
  }

  const closeModelModal = () => {
    setSelectedModel(null)
  }

  const handleSaveModel = async () => {
    if (!selectedModel) return
    const trimmedName = modalState.name.trim()
    if (!trimmedName) {
      alert('표시 이름을 입력해주세요.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: trimmedName,
        isEnabled: modalState.isEnabled,
        isPublic: modalState.isPublic
      }
      await updateModel(selectedModel.id, payload)
      setModels(prev => prev.map(model => model.id === selectedModel.id ? { ...model, ...payload } : model))
      setSelectedModel(prev => prev ? { ...prev, ...payload, name: trimmedName } : prev)
      alert('모델이 저장되었습니다.')
      closeModelModal()
    } catch (error) {
      console.error(error)
      alert('모델 저장에 실패했습니다.')
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
      alert('모델이 삭제되었습니다.')
      closeModelModal()
    } catch (error) {
      console.error(error)
      alert('삭제 실패')
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
      alert('선택한 모델이 삭제되었습니다.')
    } catch (error) {
      console.error(error)
      alert('선택 삭제 실패')
    } finally {
      setIsBulkDeleting(false)
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
            모델 동기화
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
                      <TableHead>상태</TableHead>
                      <TableHead>공개</TableHead>
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
                          <Badge variant={model.isEnabled ? 'default' : 'outline'}>
                            {model.isEnabled ? '사용 가능' : '비활성화'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={model.isPublic ? 'secondary' : 'outline'}>
                            {model.isPublic ? '공개' : '비공개'}
                          </Badge>
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
    </div>
  )
}
