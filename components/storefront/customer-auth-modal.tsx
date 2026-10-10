'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { useCustomer } from './customer-provider'

interface CustomerAuthModalProps {
  storeName: string
  theme: ThemeConfig
}

export function CustomerAuthModal({ storeName, theme }: CustomerAuthModalProps) {
  const { isAuthModalOpen, closeAuthModal, loginOrRegister } = useCustomer()
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      return
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMessage('Please enter your full name')
      return
    }

    setIsSubmitting(true)

    const result = await loginOrRegister({
      email: email.trim(),
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      action: mode,
    })

    setIsSubmitting(false)

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to authenticate')
    } else {
      if (result.isNewCustomer) {
        setSuccessMessage(`Welcome to ${storeName}! Your customer account is created and saved.`)
      } else {
        setSuccessMessage(`Welcome back! You are logged in.`)
      }
      setTimeout(() => {
        closeAuthModal()
        setSuccessMessage(null)
      }, 1200)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        style={{ fontFamily: theme.fonts?.body }}
      >
        {/* Top Header Banner */}
        <div 
          className="p-6 text-white text-center relative"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">{storeName}</h3>
          <p className="text-xs text-white/80 mt-1">
            {mode === 'register' ? 'Create your customer account to save details & track orders' : 'Log in to your customer account'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 p-1">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); setSuccessMessage(null) }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null) }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': theme.colors.primary } as any}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': theme.colors.primary } as any}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone Number {mode === 'register' ? <span className="text-gray-400 font-normal">(Optional)</span> : null}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': theme.colors.primary } as any}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'register' ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Register as Customer</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] text-gray-500 pt-1">
            Registered customers receive order updates, delivery tracking & express checkout.
          </p>
        </form>
      </div>
    </div>
  )
}
