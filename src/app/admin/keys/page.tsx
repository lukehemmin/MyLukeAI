import { Suspense } from 'react'
import { ApiKeyManager } from '@/components/admin/api-key-manager'
import { ApiKeyManagerSkeleton } from '@/components/admin/api-key-manager-skeleton'

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API 키 관리</h1>
        <p className="mt-2 text-gray-600">
          AI 제공자의 API 키를 안전하게 관리하고 사용 현황을 추적합니다.
        </p>
      </div>

      <Suspense fallback={<ApiKeyManagerSkeleton />}>
        <ApiKeyManager />
      </Suspense>
    </div>
  )
}