import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSystemStatus } from '@/lib/actions/admin-features'
import AdminSystemClient from '@/components/admin/AdminSystemClient'

export default async function AdminSystemPage() {
  const session = await auth()
  
  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  const status = await getSystemStatus()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">시스템 상태</h2>
        <p className="text-muted-foreground">
          서버 리소스 및 서비스 상태를 모니터링합니다.
        </p>
      </div>
      <AdminSystemClient status={status} />
    </div>
  )
}
