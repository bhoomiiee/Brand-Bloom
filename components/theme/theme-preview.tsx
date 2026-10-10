'use client'

import { ThemeConfig, getButtonClasses, getCardClasses } from '@/lib/themes'

interface ThemePreviewProps {
  theme: ThemeConfig
  selected?: boolean
  isCurrent?: boolean
  onSelect?: () => void
}

export function ThemePreview({ theme, selected, isCurrent, onSelect }: ThemePreviewProps) {
  const themeStyles = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-foreground': theme.colors.foreground,
    '--color-muted': theme.colors.muted,
    '--color-border': theme.colors.border,
  } as React.CSSProperties

  return (
    <div
      className={`relative cursor-pointer transition-all rounded-lg ${
        selected
          ? 'ring-4 ring-purple-600 shadow-xl'
          : isCurrent
          ? 'ring-2 ring-emerald-500 shadow-md'
          : 'hover:shadow-lg opacity-85 hover:opacity-100'
      }`}
      onClick={onSelect}
    >
      {/* Theme Preview */}
      <div
        className="overflow-hidden rounded-lg border-2"
        style={themeStyles}
      >
        {/* Mini Storefront Preview */}
        <div
          className="p-4 space-y-3"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
            fontFamily: theme.fonts.body,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: theme.colors.border }}>
            <div
              className="font-bold text-lg"
              style={{ fontFamily: theme.fonts.heading }}
            >
              Store
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.muted }} />
              <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.muted }} />
            </div>
          </div>

          {/* Hero Section */}
          <div
            className={`p-4 rounded-lg`}
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
            }}
          >
            <div className="text-sm font-semibold mb-1">Featured Collection</div>
            <div className="text-xs opacity-90">Shop the latest arrivals</div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border rounded overflow-hidden"
                style={{ borderColor: theme.colors.border }}
              >
                <div
                  className="h-16"
                  style={{ backgroundColor: theme.colors.muted }}
                />
                <div className="p-2 space-y-1">
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.colors.muted, width: '80%' }}
                  />
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.colors.muted, width: '50%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-2 rounded text-xs font-semibold text-white"
            style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.layout.buttonStyle === 'pill' ? '9999px' : theme.layout.buttonStyle === 'square' ? '0' : '0.5rem',
            }}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Theme Info */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{theme.name}</h3>
          <div className="flex items-center gap-1.5">
            {isCurrent && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                Active Theme
              </span>
            )}
            {selected && !isCurrent && (
              <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full border border-purple-200">
                Selected
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600">{theme.description}</p>
        
        {/* Color Palette */}
        <div className="flex gap-1 mt-2">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.colors.primary }}
            title="Primary"
          />
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.colors.secondary }}
            title="Secondary"
          />
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.colors.accent }}
            title="Accent"
          />
        </div>
      </div>
    </div>
  )
}
