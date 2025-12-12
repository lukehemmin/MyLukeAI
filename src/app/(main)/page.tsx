import { ChatArea } from '@/components/chat/ChatArea'
import { getEnabledModels } from '@/lib/data/models'

export default async function HomePage() {
  const models = await getEnabledModels()

  return (
    <div className="h-full">
      <ChatArea models={models} />
    </div>
  )
}