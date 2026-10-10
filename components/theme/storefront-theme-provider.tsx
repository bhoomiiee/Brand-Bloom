'use client'

import { ThemeConfig, getThemeStyles } from '@/lib/themes'
import { useEffect } from 'react'

interface StorefrontThemeProviderProps {
  theme: ThemeConfig
  children: React.ReactNode
}

export function StorefrontThemeProvider({ theme, children }: StorefrontThemeProviderProps) {
  useEffect(() => {
    // Apply theme CSS variables to document root
    const root = document.documentElement
    const styles = getThemeStyles(theme.id)
    
    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })

    // Load Google Fonts if needed
    const fontsToLoad = new Set<string>()
    
    if (theme.fonts.heading.includes('Playfair')) fontsToLoad.add('Playfair+Display:wght@400;700;900')
    if (theme.fonts.heading.includes('Montserrat')) fontsToLoad.add('Montserrat:wght@400;600;700;900')
    if (theme.fonts.heading.includes('Poppins')) fontsToLoad.add('Poppins:wght@400;600;700;900')
    if (theme.fonts.body.includes('Lora')) fontsToLoad.add('Lora:wght@400;500;600')
    if (theme.fonts.body.includes('Roboto')) fontsToLoad.add('Roboto:wght@400;500;700')
    
    if (fontsToLoad.size > 0) {
      const fontLink = document.createElement('link')
      fontLink.href = `https://fonts.googleapis.com/css2?${Array.from(fontsToLoad).map(f => `family=${f}`).join('&')}&display=swap`
      fontLink.rel = 'stylesheet'
      document.head.appendChild(fontLink)

      return () => {
        document.head.removeChild(fontLink)
      }
    }
  }, [theme])

  const themeStyles = getThemeStyles(theme.id)

  return (
    <div 
      className="min-h-screen"
      style={{
        ...themeStyles,
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        fontFamily: theme.fonts.body,
      }}
    >
      {children}
    </div>
  )
}
