import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUsageStats } from '@/lib/actions/admin-features'
import AdminStatsClient from '@/components/admin/AdminStatsClient'

export default async function AdminStatsPage() {
  const session = await auth()
  
  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  const data = await getUsageStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">사용 통계</h2>
        <p className="text-muted-foreground">
          토큰 사용량 및 사용자 활동 통계를 확인합니다.
        </p>
      </div>
      <AdminStatsClient data={data} />
    </div>
  )
}
