'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Server, Clock, Cpu, HardDrive } from "lucide-react"

interface SystemStatus {
  uptime: number
  loadAvg: number[]
  memory: {
    total: number
    free: number
  }
  platform: string
  release: string
  nodeVersion: string
  dbStatus: string
  serverTime: string
}

interface AdminSystemClientProps {
  status: SystemStatus
}

export default function AdminSystemClient({ status }: AdminSystemClientProps) {
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${d}일 ${h}시간 ${m}분`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">서버 상태</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">정상</div>
          <p className="text-xs text-muted-foreground">
            가동 시간: {formatUptime(status.uptime)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">데이터베이스</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {status.dbStatus === 'Connected' ? (
              <span className="text-green-600">연결됨</span>
            ) : (
              <span className="text-red-600">오류</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">PostgreSQL</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">메모리</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatBytes(status.memory.total - status.memory.free)} / {formatBytes(status.memory.total)}
          </div>
          <div className="h-2 w-full bg-secondary mt-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${((status.memory.total - status.memory.free) / status.memory.total) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>시스템 정보</CardTitle>
          <CardDescription>서버 환경 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">OS</span>
            <span className="text-sm font-medium">{status.platform} ({status.release})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Node.js</span>
            <span className="text-sm font-medium">{status.nodeVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">서버 시간</span>
            <span className="text-sm font-medium">{new Date(status.serverTime).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>부하 (Load Average)</CardTitle>
          <CardDescription>1분, 5분, 15분 평균 부하</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold">{status.loadAvg[0].toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">1분</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{status.loadAvg[1].toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">5분</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{status.loadAvg[2].toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">15분</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
