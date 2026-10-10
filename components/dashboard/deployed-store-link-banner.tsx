'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Share2, 
  QrCode, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  storeId: string
  storeSlug: string
  storeName: string
  publishedAt?: Date | string | null
}

export default function DeployedStoreLinkBanner({
  storeId,
  storeSlug,
  storeName,
  publishedAt,
}: Props) {
  const [liveUrl, setLiveUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploySuccessMessage, setDeploySuccessMessage] = useState<string | null>(null)
  const [lastDeployTime, setLastDeployTime] = useState<string>(
    publishedAt ? new Date(publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      setLiveUrl(`${origin}/store/${storeSlug}`)
    }
  }, [storeSlug])

  const copyToClipboard = () => {
    if (navigator.clipboard && liveUrl) {
      navigator.clipboard.writeText(liveUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Check out our live storefront website "${storeName}" on BrandBloom!\n\n🛍️ Shop here:\n${liveUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Live Website Link for "${storeName}"`)
    const body = encodeURIComponent(
      `Hello!\n\nHere is your official live deployed website link for ${storeName}:\n\n${liveUrl}\n\nThis storefront is active, SSL secured, and connected to our real-time inventory system.\n\nBest regards,\nBrandBloom Team`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const handleRedeploy = async () => {
    setIsDeploying(true)
    setDeploySuccessMessage(null)
    try {
      const res = await fetch('/api/store/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, slug: storeSlug }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setLastDeployTime(timeStr)
        setDeploySuccessMessage('Edge CDN cache purged & synced live!')
        setTimeout(() => setDeploySuccessMessage(null), 4000)
      } else {
        alert(data.error || 'Failed to trigger deployment.')
      }
    } catch (err) {
      console.error('Deploy error:', err)
      alert('Deployment trigger failed. Check network.')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white via-[#FCF9F9] to-[#F8F2F0] border-2 border-[#BD7C91] p-5 md:p-6 shadow-sm mb-6 transition-all relative overflow-hidden">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E8DDE0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#632D40] text-white flex items-center justify-center shadow-xs shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#3D202B]">
                Live Storefront Website
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>Active & Deployed</span>
              </span>
            </div>
            <p className="text-xs text-[#806B73] mt-0.5">
              Available to customers and ready to share with the store owner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={handleRedeploy}
            disabled={isDeploying}
            variant="outline"
            className="border-[#BD7C91]/40 text-[#632D40] hover:bg-[#F1D9DF]/40 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDeploying ? 'animate-spin' : ''}`} />
            <span>{isDeploying ? 'Deploying...' : 'Sync Edge CDN'}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => window.open(liveUrl, '_blank')}
            className="bg-[#632D40] hover:bg-[#632D40]/90 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <span>Open Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Deployment Success Alert */}
      {deploySuccessMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{deploySuccessMessage}</span>
        </div>
      )}

      {/* URL Display and Quick Sharing Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#BD7C91]/40 shadow-inner">
            <Globe className="w-4 h-4 text-[#BD7C91] shrink-0" />
            <input
              type="text"
              readOnly
              value={liveUrl}
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#3D202B] outline-none select-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={copyToClipboard}
              className={`text-xs font-semibold px-4 transition-all ${
                copied 
                  ? 'bg-emerald-600 hover:bg-emerald-600 text-white' 
                  : 'bg-[#632D40] hover:bg-[#632D40]/90 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy Deployed Link</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowQr(!showQr)}
              className="border-[#BD7C91]/40 text-[#632D40] hover:bg-[#F1D9DF]/40 text-xs font-semibold gap-1 px-3"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showQr ? 'Close' : 'QR'}</span>
            </Button>
          </div>
        </div>

        {/* QR Code Reveal Panel */}
        {showQr && (
          <div className="p-4 rounded-xl bg-white border border-[#E8DDE0] flex flex-col sm:flex-row items-center gap-4 animate-in fade-in duration-300">
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(liveUrl)}`}
                alt="Storefront QR Code"
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-xs font-bold text-[#3D202B]">
                Scan to Open on Mobile Device
              </h4>
              <p className="text-[11px] text-[#806B73] max-w-sm">
                Store owners can point their camera at this code to test mobile ordering, payments, and storefront styling in real time.
              </p>
            </div>
          </div>
        )}

        {/* Sharing Action Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-[#806B73] mr-1">
            Share with Store Owner:
          </span>
          <button
            onClick={shareViaWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
          >
            <Smartphone className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={shareViaEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-all"
          >
            <Share2 className="w-3 h-3 text-blue-600" />
            <span>Email</span>
          </button>

          <span className="text-[11px] text-[#806B73] ml-auto hidden md:inline">
            Last Edge Sync: <strong className="text-[#3D202B]">{lastDeployTime}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
