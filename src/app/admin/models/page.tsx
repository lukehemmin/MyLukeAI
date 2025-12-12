import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getModels } from '@/lib/actions/admin-models'
import AdminModelsClient from '@/components/admin/AdminModelsClient'

export default async function AdminModelsPage() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  const models = await getModels()

  return (
    <div className="container mx-auto py-10">
      <AdminModelsClient initialModels={models} />
    </div>
  )
}
