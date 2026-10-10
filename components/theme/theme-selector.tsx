'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAllThemes } from '@/lib/themes'
import { ThemePreview } from './theme-preview'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, ExternalLink, Sparkles, Store } from 'lucide-react'

interface ThemeSelectorProps {
  storeId: string
  storeSlug: string
  currentTheme: string
}

export function ThemeSelector({ storeId, storeSlug, currentTheme }: ThemeSelectorProps) {
  const [activeTheme, setActiveTheme] = useState(currentTheme)
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const themes = getAllThemes()
  const hasUnsavedChanges = selectedTheme !== activeTheme
  const currentThemeConfig = themes.find(t => t.id === selectedTheme) || themes[0]

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId)
    setSuccessMessage(null)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/store/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: selectedTheme }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update theme')
      }

      setActiveTheme(selectedTheme)
      setSuccessMessage(`Theme updated to "${currentThemeConfig.name}"! Your storefront is updated.`)
      router.refresh()
    } catch (error) {
      console.error('Failed to update theme:', error)
      alert(error instanceof Error ? error.message : 'Failed to update theme')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 bg-[#F1D9DF]/50 border border-[#BD7C91]/30 rounded-2xl flex items-start gap-3">
        <Store className="w-5 h-5 text-[#632D40] mt-0.5 flex-shrink-0" />
        <div className="text-sm text-[#3D202B]">
          <p className="font-bold text-[#632D40]">Storefront Theme Customization</p>
          <p className="text-[#806B73] mt-0.5 text-xs">
            Themes customize your <strong>public storefront</strong> at{' '}
            <Link
              href={`/store/${storeSlug}`}
              target="_blank"
              className="underline font-semibold text-[#632D40] hover:text-[#BD7C91] inline-flex items-center gap-1"
            >
              /store/{storeSlug} <ExternalLink className="w-3 h-3 inline" />
            </Link>
            . Choose a style below and click <strong>Save Theme</strong> to update its colors, typography, and layout.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-[#F1D9DF] border border-[#BD7C91]/40 rounded-2xl flex items-center justify-between gap-3 text-[#632D40]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#632D40] flex-shrink-0" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
          <Link
            href={`/store/${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 bg-[#632D40] text-white rounded-xl hover:bg-[#632D40]/90 transition-colors inline-flex items-center gap-1 shadow-xs"
          >
            <ExternalLink className="w-3 h-3" />
            View Storefront
          </Link>
        </div>
      )}

      {/* Action Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base text-[#3D202B]">Choose Your Theme</h2>
            <p className="text-xs text-[#806B73] mt-0.5">
              Select a botanical or modern theme that matches your brand identity
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-xs text-[#BD7C91] font-bold">Unsaved changes</span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isLoading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                hasUnsavedChanges 
                  ? 'bg-[#632D40] hover:bg-[#632D40]/90 text-white cursor-pointer' 
                  : 'bg-gray-100 text-[#806B73] cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Saving...' : hasUnsavedChanges ? 'Save Theme' : 'Theme Saved'}
            </button>
            <Link
              href={`/store/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/40 transition-colors flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#BD7C91]" />
                <span>View Store</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <ThemePreview
            key={theme.id}
            theme={theme}
            selected={selectedTheme === theme.id}
            isCurrent={activeTheme === theme.id}
            onSelect={() => handleSelectTheme(theme.id)}
          />
        ))}
      </div>

      {/* Theme Details */}
      {selectedTheme && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Theme Details: {currentThemeConfig.name}</h3>
            {activeTheme === selectedTheme ? (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-300">
                Currently Live on Storefront
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-300">
                Click &quot;Save Theme&quot; above to apply
              </span>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Colors */}
            <div>
              <h4 className="text-sm font-medium mb-3">Color Palette</h4>
              <div className="space-y-2">
                {Object.entries(currentThemeConfig.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded border shadow-sm"
                      style={{ backgroundColor: value }}
                    />
                    <div>
                      <div className="text-sm font-medium capitalize">{key}</div>
                      <div className="text-xs text-gray-500">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Layout */}
            <div>
              <h4 className="text-sm font-medium mb-3">Typography &amp; Layout</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Heading Font</div>
                  <div className="text-xs text-gray-500">
                    {currentThemeConfig.fonts.heading}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Body Font</div>
                  <div className="text-xs text-gray-500">
                    {currentThemeConfig.fonts.body}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Header Style</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {currentThemeConfig.layout.headerStyle}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Card Style</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {currentThemeConfig.layout.cardStyle}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Button Style</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {currentThemeConfig.layout.buttonStyle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Preview Store Link */}
      <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Preview Your Live Storefront
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              See your selected theme live in action with your products, categories, and shopping cart.
            </p>
          </div>
          <Link
            href={`/store/${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Live Storefront
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
