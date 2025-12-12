import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSystemSettings } from '@/lib/actions/admin-features'
import AdminSettingsClient from '@/components/admin/AdminSettingsClient'

export default async function AdminSettingsPage() {
  const session = await auth()
  
  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  const settings = await getSystemSettings()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">시스템 설정</h2>
        <p className="text-muted-foreground">
          시스템 전역 설정 및 정책을 관리합니다.
        </p>
      </div>
      <AdminSettingsClient initialSettings={settings} />
    </div>
  )
}
