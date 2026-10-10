'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  QrCode
} from 'lucide-react'

interface Props {
  store: {
    id?: string
    name?: string
    slug?: string
    deployedUrl?: string
    businessType?: string
  }
}

export default function DeployedSuccessStep({ store }: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [liveUrl, setLiveUrl] = useState(store.deployedUrl || '')
  const [showQr, setShowQr] = useState(false)

  useEffect(() => {
    const defaultHost = (process.env.NEXT_PUBLIC_APP_URL || 'https://brandbloom.store').replace(/\/$/, '')
    const fullUrl = store.deployedUrl && !store.deployedUrl.includes('localhost') 
      ? store.deployedUrl 
      : `${defaultHost}/store/${store.slug || ''}`
    setLiveUrl(fullUrl)
  }, [store.deployedUrl, store.slug])

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Congratulations! Our store "${store.name || 'Store'}" is officially live and deployed on BrandBloom!\n\n🛍️ Visit our storefront:\n${liveUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Your Store "${store.name || 'Store'}" is Live & Deployed!`)
    const body = encodeURIComponent(
      `Hello!\n\nYour new storefront website has been generated and deployed to BrandBloom's Global Edge Network.\n\nLive Storefront URL:\n${liveUrl}\n\nManage your inventory, themes, and orders via the merchant dashboard:\n${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard\n\nBest regards,\nBrandBloom Team`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Deployment Successful • Live on Global Edge CDN</span>
        </div>

        <h2 className="text-3xl font-extrabold text-[#3D202B] tracking-tight">
          Your Website is Live & Ready for the Store Owner!
        </h2>
        <p className="text-sm text-[#806B73] max-w-lg mx-auto">
          BrandBloom automated pipeline has provisioned the database, applied your theme, and deployed the storefront to the cloud.
        </p>
      </div>

      {/* Main Deployed URL Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white via-[#FCF9F9] to-[#F8F2F0] border-2 border-[#BD7C91] shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8DDE0]">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-[#BD7C91] mb-1">
              Live Production Storefront
            </div>
            <div className="text-xl font-bold text-[#3D202B]">
              {store.name || 'Your Storefront'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.open(liveUrl, '_blank')}
              className="bg-[#632D40] hover:bg-[#632D40]/90 text-white font-semibold text-xs shadow-xs gap-2"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQr(!showQr)}
              className="border-[#BD7C91]/40 text-[#632D40] hover:bg-[#F1D9DF]/40 text-xs gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQr ? 'Hide QR' : 'Mobile QR'}</span>
            </Button>
          </div>
        </div>

        {/* URL Display Bar */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-[#806B73]">
            Deployed Shareable URL for Store Owner & Customers:
          </label>
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#BD7C91]/40 shadow-inner">
            <Globe className="w-4 h-4 text-[#BD7C91] shrink-0 ml-1.5" />
            <input
              type="text"
              readOnly
              value={liveUrl}
              className="w-full bg-transparent text-sm font-mono text-[#3D202B] outline-none select-all"
            />
            <Button
              size="sm"
              onClick={copyToClipboard}
              className={`shrink-0 text-xs font-semibold transition-all ${
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
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* QR Code Drawer */}
        {showQr && (
          <div className="mb-6 p-4 rounded-xl bg-white border border-[#E8DDE0] flex flex-col items-center text-center space-y-2 animate-in fade-in duration-300">
            <div className="p-2 bg-white rounded-lg shadow-xs border border-gray-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(liveUrl)}`}
                alt="Storefront QR Code"
                className="w-40 h-40 object-contain"
              />
            </div>
            <p className="text-xs font-semibold text-[#3D202B]">
              Scan with mobile phone to open the live deployed website
            </p>
          </div>
        )}

        {/* Share with Owner Action Bar */}
        <div>
          <div className="text-xs font-bold text-[#806B73] mb-3 uppercase tracking-wider">
            Give Link Directly to Store Owner:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Share via WhatsApp</span>
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Send via Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Technical Verification Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8DDE0] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3D202B]">SSL / HTTPS</div>
            <div className="text-[11px] text-[#806B73]">Secure & Active</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8DDE0] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1D9DF] flex items-center justify-center text-[#632D40] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3D202B]">Global Edge CDN</div>
            <div className="text-[11px] text-[#806B73]">Multi-Region Cache</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8DDE0] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3D202B]">Real-time Database</div>
            <div className="text-[11px] text-[#806B73]">PostgreSQL Sync</div>
          </div>
        </div>
      </div>

      {/* Next Step / Enter Dashboard */}
      <div className="pt-2 flex justify-center">
        <Button
          size="lg"
          onClick={() => {
            router.push('/dashboard')
            router.refresh()
          }}
          className="bg-[#632D40] hover:bg-[#632D40]/90 text-white font-bold px-8 py-3 rounded-xl shadow-md gap-2"
        >
          <span>Open Merchant Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
