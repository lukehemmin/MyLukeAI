import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAuditLogs } from '@/lib/actions/admin-features'
import AdminAuditLogsClient from '@/components/admin/AdminAuditLogsClient'

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const session = await auth()
  
  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  const page = Number(searchParams.page) || 1
  const { logs, totalPages, currentPage } = await getAuditLogs(page)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">감사 로그</h2>
        <p className="text-muted-foreground">
          관리자의 주요 활동 이력을 조회합니다.
        </p>
      </div>
      <AdminAuditLogsClient 
        logs={logs} 
        totalPages={totalPages} 
        currentPage={currentPage} 
      />
    </div>
  )
}
