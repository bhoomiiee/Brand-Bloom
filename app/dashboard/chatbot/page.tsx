import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { ChatInterface } from '@/components/chatbot/chat-interface'

export const metadata: Metadata = {
  title: 'Store Assistant | BrandBloom',
  description: 'Ask questions about your store data',
}

export default async function ChatbotPage() {
  const [store, user] = await Promise.all([
    getCurrentStore(),
    getCurrentUser(),
  ])

  if (!store || !user) {
    redirect('/onboarding')
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Store Assistant</h1>
        <p className="text-gray-600 mt-2">
          Ask questions about your products, orders, customers, and analytics
        </p>
      </div>

      <ChatInterface storeId={store.id} storeName={store.name} />
    </div>
  )
}
