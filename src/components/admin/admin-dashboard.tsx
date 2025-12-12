'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Clock, Key, Users, Activity, BarChart2, Shield, Settings } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface SystemStats {
  totalUsers: number
  totalConversations: number
  totalMessages: number
  totalApiKeys: number
  activeApiKeys: number
  systemStatus: 'healthy' | 'warning' | 'error'
}

interface ApiKeyStatus {
  provider: string
  available: boolean
  keyCount: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 시스템 통계 가져오기
      const statsResponse = await fetch('/api/admin/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // API 키 상태 가져오기
      const statusResponse = await fetch('/api/admin/keys/status')
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setApiKeyStatus(statusData)
      }
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
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

  const getStatusColor = (available: boolean) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStatusIcon = (available: boolean) => {
    return available ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    )
  }

  if (loading) {
    return <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  }

  return (
    <div className="space-y-6">
      {/* 시스템 상태 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              등록된 사용자 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대화 수</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalConversations || 0}</div>
            <p className="text-xs text-muted-foreground">
              생성된 대화 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">메시지 수</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
            <p className="text-xs text-muted-foreground">
              전체 메시지 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API 키</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeApiKeys || 0} / {stats?.totalApiKeys || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              활성 / 전체 API 키
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API 키 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>API 키 상태</CardTitle>
          <CardDescription>
            각 AI 제공자의 API 키 가용성 상태
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeyStatus.map((status) => (
              <div key={status.provider} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status.available)}
                  <span className="font-medium">
                    {getProviderDisplayName(status.provider)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(status.available)}>
                    {status.available ? '사용 가능' : '키 없음'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {status.keyCount}개 키
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 빠른 액션 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 액션</CardTitle>
          <CardDescription>
            자주 사용하는 관리 작업
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="justify-start">
              <a href="/admin/keys">
                <Key className="mr-2 h-4 w-4" />
                API 키 관리
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <a href="/admin/stats">
                <BarChart2 className="mr-2 h-4 w-4" />
                사용 통계
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <a href="/admin/audit-logs">
                <Shield className="mr-2 h-4 w-4" />
                감사 로그
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <a href="/admin/system">
                <Activity className="mr-2 h-4 w-4" />
                시스템 상태
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <a href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                시스템 설정
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
