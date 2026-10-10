'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, TrendingUp, Package, ShoppingCart, Users as UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
}

type Props = {
  storeId: string
  storeName: string
}

const SUGGESTED_QUESTIONS = [
  'What are my top selling products?',
  'How many orders did I get today?',
  'Show me products with low stock',
  'What is my total revenue this month?',
  'How many customers do I have?',
  'Which products are out of stock?',
]

export function ChatInterface({ storeId, storeName }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your ${storeName} store assistant. I can help you find information about your products, orders, customers, and analytics. What would you like to know?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          storeId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        data: data.data,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-[#F1D9DF] flex items-center justify-center border border-[#BD7C91]/30">
                <Bot className="h-4.5 w-4.5 text-[#632D40]" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                message.role === 'user'
                  ? 'bg-[#632D40] text-white shadow-xs'
                  : 'bg-[#F8F2F0] border border-[#E8DDE0] text-[#3D202B]'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.data && (
                <div className="mt-3 pt-3 border-t border-[#E8DDE0]">
                  {renderData(message.data)}
                </div>
              )}
              <p
                className={`text-[10px] mt-2 font-medium ${
                  message.role === 'user' ? 'text-[#F1D9DF]' : 'text-[#806B73]'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-[#F1D9DF] flex items-center justify-center border border-[#BD7C91]/30">
                <User className="h-4.5 w-4.5 text-[#632D40]" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-[#F1D9DF] flex items-center justify-center">
              <Bot className="h-4.5 w-4.5 text-[#632D40]" />
            </div>
            <div className="bg-[#F8F2F0] border border-[#E8DDE0] rounded-2xl p-4">
              <Loader2 className="h-4 w-4 animate-spin text-[#632D40]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-6 py-3.5 border-t border-[#E8DDE0] bg-[#F8F2F0]/60">
          <p className="text-xs font-bold text-[#632D40] mb-2.5">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="text-xs px-3 py-1.5 bg-white text-[#632D40] rounded-full hover:bg-[#F1D9DF]/40 transition-all border border-[#BD7C91]/30 shadow-2xs font-medium cursor-pointer"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3.5 border-t border-[#E8DDE0] bg-white">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your products, orders..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs border border-[#E8DDE0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#632D40]/30 text-[#3D202B] bg-[#F8F2F0]/50 placeholder:text-[#806B73]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#632D40] hover:bg-[#632D40]/90 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </Card>
  )
}

function renderData(data: any) {
  if (!data) return null

  // Render products list
  if (data.products && Array.isArray(data.products)) {
    return (
      <div className="space-y-2">
        {data.products.map((product: any, index: number) => (
          <div key={index} className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{product.name}</span>
            </div>
            <span className="text-gray-600">
              {product.stock !== undefined && `Stock: ${product.stock}`}
              {product.sales !== undefined && `Sales: ${product.sales}`}
              {product.price !== undefined && formatCurrency(product.price)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Render orders list
  if (data.orders && Array.isArray(data.orders)) {
    return (
      <div className="space-y-2">
        {data.orders.map((order: any, index: number) => (
          <div key={index} className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-gray-600" />
              <span className="font-medium">#{order.orderNumber}</span>
            </div>
            <span className="text-gray-600">{formatCurrency(order.total)}</span>
          </div>
        ))}
      </div>
    )
  }

  // Render customers list
  if (data.customers && Array.isArray(data.customers)) {
    return (
      <div className="space-y-2">
        {data.customers.map((customer: any, index: number) => (
          <div key={index} className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{customer.name}</span>
            </div>
            <span className="text-gray-600">{customer.email}</span>
          </div>
        ))}
      </div>
    )
  }

  // Render stats
  if (data.stats) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data.stats).map(([key, value]) => (
          <div key={key} className="text-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
            </div>
            <p className="font-semibold text-lg">{String(value)}</p>
          </div>
        ))}
      </div>
    )
  }

  return null
}
