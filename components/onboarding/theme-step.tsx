'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { THEMES } from '@/lib/constants'

interface Props {
  selectedTheme?: string
  onNext: (theme: string) => void
  onBack: () => void
}

export default function ThemeStep({ selectedTheme: initial, onNext, onBack }: Props) {
  const [selectedTheme, setSelectedTheme] = useState(initial || 'modern')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose your theme</h2>
        <p className="text-gray-600">
          Select a design that matches your brand. You can customize colors and fonts later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => setSelectedTheme(theme.id)}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              selectedTheme === theme.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Theme Preview */}
            <div className="mb-4 h-32 rounded-lg overflow-hidden bg-gradient-to-br relative"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full mb-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div className="h-2 w-24 mx-auto rounded"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div>
              <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
              
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <span className="text-gray-500">Primary</span>
                </div>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                  <span className="text-gray-500">Secondary</span>
                </div>
              </div>
            </div>

            {selectedTheme === theme.id && (
              <div className="mt-4 text-primary font-medium text-sm">
                ✓ Selected
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Preview your store:</strong> You'll be able to see a live preview before publishing
        </p>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="button" onClick={() => onNext(selectedTheme)}>
          Next: Review & Publish
        </Button>
      </div>
    </div>
  )
}
