import { Suspense } from 'react'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminDashboardSkeleton } from '@/components/admin/admin-dashboard-skeleton'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-2 text-gray-600">
          MyLukeAI 시스템의 전반적인 상태를 확인하고 관리합니다.
        </p>
      </div>

      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </div>
  )
}