'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BotanicalPetalCluster } from '@/components/ui/botanical-decorations'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendation?: Recommendation
}

type Recommendation = {
  id: string
  type: 'MARKETING' | 'PRODUCT' | 'PRICING' | 'INVENTORY' | 'CUSTOMER'
  title: string
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  effort: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED'
  actions?: string[]
}

type Props = {
  storeId: string
  storeName: string
}

const SUGGESTED_ACTIONS = [
  'Analyze my store performance',
  'Give me growth recommendations',
  'How can I increase sales in INR?',
  'What floral bouquets should I promote?',
  'Review my pricing strategy',
  'Help me reduce cart abandonment',
]

export function BloomPilotInterface({ storeId, storeName }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm BloomPilot, your AI business growth advisor for ${storeName}. I continuously monitor your catalog, shoppers, and orders to formulate actionable botanical strategies.\n\nI can assist you with:\n• Revenue growth & conversion rate optimization\n• Seasonal floral collections & inventory stock levels\n• Customer retention & marketing campaigns\n• Automated pricing & packaging suggestions\n\nWhat would you like to explore today?`,
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

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/bloompilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          message: messageText,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.response || "Here is the analysis for your store:",
        timestamp: new Date(),
        recommendation: data.recommendation,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('BloomPilot request error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble analyzing your store data right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveRecommendation = async (recommendationId: string) => {
    try {
      const response = await fetch('/api/bloompilot/recommendation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId }),
      })

      if (!response.ok) throw new Error('Failed to approve recommendation')

      // Update the message with the recommendation
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.recommendation?.id === recommendationId) {
            return {
              ...msg,
              recommendation: {
                ...msg.recommendation,
                status: 'APPROVED',
              },
            }
          }
          return msg
        })
      )

      // Add a confirmation message
      const confirmMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Wonderful! I've marked this botanical recommendation as approved. You can now execute it across your catalog.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, confirmMessage])
    } catch (error) {
      alert('Failed to approve recommendation')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E8DDE0] shadow-2xs overflow-hidden">
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
              <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-[#632D40] to-[#BD7C91] flex items-center justify-center shadow-2xs">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
            )}

            <div className="max-w-[80%] space-y-3">
              <div
                className={`rounded-2xl p-4 text-sm ${
                  message.role === 'user'
                    ? 'bg-[#632D40] text-white shadow-xs'
                    : 'bg-[#F8F2F0] border border-[#E8DDE0] text-[#3D202B]'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p
                  className={`text-[10px] mt-2 font-medium ${
                    message.role === 'user' ? 'text-[#F1D9DF]' : 'text-[#806B73]'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Recommendation Card with Botanical Petal Decorations */}
              {message.recommendation && (
                <div className="relative p-5 border border-[#BD7C91]/40 bg-white rounded-2xl shadow-xs overflow-hidden">
                  {/* Delicate petal illustration around recommendation panel */}
                  <BotanicalPetalCluster className="absolute -top-2 -right-2 opacity-35" />

                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-[#3D202B]">
                          {message.recommendation.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                            message.recommendation.impact === 'HIGH'
                              ? 'bg-[#F1D9DF] text-[#632D40] border border-[#BD7C91]/30'
                              : message.recommendation.impact === 'MEDIUM'
                              ? 'bg-[#BD7C91]/20 text-[#632D40]'
                              : 'bg-gray-100 text-[#806B73]'
                          }`}
                        >
                          {message.recommendation.impact} Impact
                        </span>
                      </div>
                      <span className="text-xs text-[#806B73] capitalize font-medium">
                        {message.recommendation.type.toLowerCase()} • {message.recommendation.effort} Effort
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#3D202B] mb-3 leading-relaxed relative z-10">
                    {message.recommendation.description}
                  </p>

                  {message.recommendation.actions && message.recommendation.actions.length > 0 && (
                    <div className="mb-4 relative z-10 bg-[#F8F2F0]/80 p-3 rounded-xl border border-[#E8DDE0]">
                      <p className="text-xs font-bold text-[#632D40] mb-2">Recommended Steps:</p>
                      <ul className="space-y-1.5">
                        {message.recommendation.actions.map((action, idx) => (
                          <li key={idx} className="text-xs text-[#3D202B] flex items-start gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-[#BD7C91] mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message.recommendation.status === 'PENDING' && (
                    <div className="flex gap-2 relative z-10">
                      <button
                        onClick={() => handleApproveRecommendation(message.recommendation!.id)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-[#632D40] hover:bg-[#632D40]/90 text-white flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approve Strategy</span>
                      </button>
                      <button 
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/40 transition-colors"
                      >
                        Maybe Later
                      </button>
                    </div>
                  )}

                  {message.recommendation.status === 'APPROVED' && (
                    <div className="flex items-center gap-2 text-[#632D40] bg-[#F1D9DF] px-3 py-2 rounded-xl border border-[#BD7C91]/30">
                      <CheckCircle className="h-4 w-4 text-[#632D40]" />
                      <span className="text-xs font-bold">Approved & Queued</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-[#F1D9DF] flex items-center justify-center border border-[#BD7C91]/30">
                <span className="text-[#632D40] font-bold text-xs">You</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-[#632D40] to-[#BD7C91] flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="bg-[#F8F2F0] border border-[#E8DDE0] rounded-2xl p-4">
              <Loader2 className="h-4 w-4 animate-spin text-[#632D40]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {messages.length <= 1 && (
        <div className="px-6 py-3.5 border-t border-[#E8DDE0] bg-[#F8F2F0]/80">
          <p className="text-xs font-bold text-[#632D40] mb-2.5">Suggested Inquiries:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SUGGESTED_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(action)}
                className="text-xs px-3 py-2 bg-white text-[#3D202B] hover:text-[#632D40] rounded-xl hover:bg-[#F1D9DF]/40 transition-all border border-[#E8DDE0] text-left flex items-center gap-2 shadow-2xs"
                disabled={isLoading}
              >
                <TrendingUp className="h-3.5 w-3.5 text-[#BD7C91] flex-shrink-0" />
                <span className="truncate">{action}</span>
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
            placeholder="Ask BloomPilot for sales insights, pricing advice..."
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
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
