/**
 * Theme System
 * 
 * Defines themes with colors, fonts, and layout configurations
 */

export interface ThemeConfig {
  id: string
  name: string
  description: string
  
  // Colors
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
  
  // Typography
  fonts: {
    heading: string
    body: string
  }
  
  // Layout
  layout: {
    headerStyle: 'classic' | 'modern' | 'minimal' | 'bold'
    cardStyle: 'rounded' | 'sharp' | 'soft'
    buttonStyle: 'rounded' | 'pill' | 'square'
  }
  
  // Preview
  preview: {
    thumbnail: string
    heroImage?: string
  }
}

export const THEMES: Record<string, ThemeConfig> = {
  botanical: {
    id: 'botanical',
    name: 'Option 4: Burgundy & Blush',
    description: 'Burgundy, Dusty Rose, and Soft Blush with botanical identity',
    colors: {
      primary: '#632D40', // Burgundy
      secondary: '#BD7C91', // Dusty Rose
      accent: '#F1D9DF', // Soft Blush
      background: '#F8F2F0', // Warm Off-White
      foreground: '#3D202B', // Dark Text
      muted: '#F1D9DF',
      border: '#E8DDE0',
    },
    fonts: {
      heading: 'Playfair Display, Georgia, serif',
      body: 'Inter, system-ui, sans-serif',
    },
    layout: {
      headerStyle: 'modern',
      cardStyle: 'rounded',
      buttonStyle: 'rounded',
    },
    preview: {
      thumbnail: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop',
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design with focus on products',
    colors: {
      primary: '#8B5CF6', // Purple
      secondary: '#EC4899', // Pink
      accent: '#F59E0B', // Amber
      background: '#FFFFFF',
      foreground: '#1F2937',
      muted: '#F3F4F6',
      border: '#E5E7EB',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    layout: {
      headerStyle: 'modern',
      cardStyle: 'rounded',
      buttonStyle: 'rounded',
    },
    preview: {
      thumbnail: '/themes/modern.jpg',
    },
  },
  
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional e-commerce layout with familiar navigation',
    colors: {
      primary: '#3B82F6', // Blue
      secondary: '#10B981', // Green
      accent: '#6366F1', // Indigo
      background: '#FFFFFF',
      foreground: '#111827',
      muted: '#F9FAFB',
      border: '#D1D5DB',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Roboto, system-ui, sans-serif',
    },
    layout: {
      headerStyle: 'classic',
      cardStyle: 'soft',
      buttonStyle: 'rounded',
    },
    preview: {
      thumbnail: '/themes/classic.jpg',
    },
  },
  
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'High-impact visuals with strong typography',
    colors: {
      primary: '#EF4444', // Red
      secondary: '#F59E0B', // Amber
      accent: '#EC4899', // Pink
      background: '#FFFFFF',
      foreground: '#000000',
      muted: '#FEF2F2',
      border: '#FCA5A5',
    },
    fonts: {
      heading: 'Montserrat, system-ui, sans-serif',
      body: 'Montserrat, system-ui, sans-serif',
    },
    layout: {
      headerStyle: 'bold',
      cardStyle: 'sharp',
      buttonStyle: 'square',
    },
    preview: {
      thumbnail: '/themes/bold.jpg',
    },
  },
  
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography',
    colors: {
      primary: '#1F2937', // Gray-800
      secondary: '#D97706', // Amber-600
      accent: '#92400E', // Amber-800
      background: '#FEFCE8', // Amber-50
      foreground: '#1C1917', // Stone-900
      muted: '#FEF3C7', // Amber-100
      border: '#D4D4D4', // Neutral-300
    },
    fonts: {
      heading: 'Playfair Display, Georgia, serif',
      body: 'Lora, Georgia, serif',
    },
    layout: {
      headerStyle: 'minimal',
      cardStyle: 'soft',
      buttonStyle: 'pill',
    },
    preview: {
      thumbnail: '/themes/elegant.jpg',
    },
  },
  
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Energetic and colorful design for dynamic brands',
    colors: {
      primary: '#7C3AED', // Violet
      secondary: '#06B6D4', // Cyan
      accent: '#F43F5E', // Rose
      background: '#FFFFFF',
      foreground: '#18181B', // Zinc-900
      muted: '#FAFAFA',
      border: '#E4E4E7',
    },
    fonts: {
      heading: 'Poppins, system-ui, sans-serif',
      body: 'Poppins, system-ui, sans-serif',
    },
    layout: {
      headerStyle: 'modern',
      cardStyle: 'rounded',
      buttonStyle: 'pill',
    },
    preview: {
      thumbnail: '/themes/vibrant.jpg',
    },
  },
}

/**
 * Get theme configuration by ID
 */
export function getTheme(themeId: string): ThemeConfig {
  return THEMES[themeId] || THEMES.modern
}

/**
 * Get all available themes
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES)
}

/**
 * Generate CSS variables for a theme
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  const { colors } = theme
  
  return `
    --color-primary: ${colors.primary};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    --color-background: ${colors.background};
    --color-foreground: ${colors.foreground};
    --color-muted: ${colors.muted};
    --color-border: ${colors.border};
    --font-heading: ${theme.fonts.heading};
    --font-body: ${theme.fonts.body};
  `.trim()
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Generate inline style object for theme
 */
export function getThemeStyles(themeId: string): React.CSSProperties {
  const theme = getTheme(themeId)
  
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-foreground': theme.colors.foreground,
    '--color-muted': theme.colors.muted,
    '--color-border': theme.colors.border,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
  } as React.CSSProperties
}

/**
 * Get button classes based on theme layout style
 */
export function getButtonClasses(theme: ThemeConfig): string {
  const base = 'px-6 py-3 font-semibold transition-colors'
  
  switch (theme.layout.buttonStyle) {
    case 'pill':
      return `${base} rounded-full`
    case 'square':
      return `${base} rounded-none`
    case 'rounded':
    default:
      return `${base} rounded-lg`
  }
}

/**
 * Get card classes based on theme layout style
 */
export function getCardClasses(theme: ThemeConfig): string {
  const base = 'bg-white border overflow-hidden transition-shadow hover:shadow-lg'
  
  switch (theme.layout.cardStyle) {
    case 'sharp':
      return `${base} rounded-none`
    case 'soft':
      return `${base} rounded-2xl`
    case 'rounded':
    default:
      return `${base} rounded-lg`
  }
}

/**
 * Get header classes based on theme layout style
 */
export function getHeaderClasses(theme: ThemeConfig): string {
  const base = 'w-full border-b'
  
  switch (theme.layout.headerStyle) {
    case 'modern':
      return `${base} bg-white/80 backdrop-blur-sm sticky top-0 z-50`
    case 'bold':
      return `${base} bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white`
    case 'minimal':
      return `${base} bg-transparent border-0 py-8`
    case 'classic':
    default:
      return `${base} bg-white shadow-sm`
  }
}

/**
 * Apply theme to store
 */
export async function applyTheme(storeId: string, themeId: string) {
  // This would typically update the database
  // Implementation in API route
  return { success: true, themeId }
}
