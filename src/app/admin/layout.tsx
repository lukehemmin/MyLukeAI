import { requireAdmin } from '@/lib/auth/admin-middleware'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // 관리자 권한 확인
    await requireAdmin()
  } catch (error) {
    // 관리자가 아닌 경우 메인 페이지로 리다이렉트
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}