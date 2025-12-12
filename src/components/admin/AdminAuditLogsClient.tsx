'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface AuditLog {
  id: string
  action: string
  resource: string
  details: string | null
  ipAddress: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string | null
  }
}

interface AdminAuditLogsClientProps {
  logs: AuditLog[]
  totalPages: number
  currentPage: number
}

export default function AdminAuditLogsClient({ logs }: AdminAuditLogsClientProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>시간</TableHead>
            <TableHead>관리자</TableHead>
            <TableHead>작업</TableHead>
            <TableHead>대상</TableHead>
            <TableHead>상세</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                로그가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: ko })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{log.user.name}</span>
                    <span className="text-xs text-muted-foreground">{log.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.action}</Badge>
                </TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell className="max-w-[300px] truncate" title={log.details || ''}>
                  {log.details || '-'}
                </TableCell>
                <TableCell className="font-mono text-xs">{log.ipAddress || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
