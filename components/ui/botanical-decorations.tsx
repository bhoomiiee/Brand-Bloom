import React from 'react'

/**
 * Botanical Illustrations & Decorations
 * Crafted for BrandBloom's Burgundy (#632D40), Dusty Rose (#BD7C91), and Blush (#F1D9DF) Palette.
 * Layered, artistic, responsive SVGs with gentle opacity and organic curves.
 */

// 1. Large Botanical Branch for Sidebar (Bottom-Left)
export function BotanicalSidebarBranch({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 240 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-64 object-contain opacity-75 transition-opacity duration-300"
      >
        <defs>
          <linearGradient id="stemGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#632D40" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#BD7C91" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BD7C91" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#632D40" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1D9DF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#BD7C91" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BD7C91" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#F1D9DF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#632D40" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Main curved central stem */}
        <path
          d="M 20 280 Q 50 180 110 110 T 170 30"
          stroke="url(#stemGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Secondary branch left */}
        <path
          d="M 52 205 Q 30 170 15 140"
          stroke="url(#stemGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Secondary branch right */}
        <path
          d="M 85 145 Q 120 125 155 110"
          stroke="url(#stemGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Secondary branch upper left */}
        <path
          d="M 125 90 Q 95 65 80 40"
          stroke="url(#stemGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Leaf 1 - Lower left */}
        <path
          d="M 15 140 C 5 125 10 105 28 112 C 40 118 35 135 15 140 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M 15 140 Q 22 124 28 112"
          stroke="#632D40"
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />

        {/* Leaf 2 - Mid left small */}
        <path
          d="M 35 175 C 20 165 24 150 40 155 C 50 160 48 172 35 175 Z"
          fill="url(#leafGrad2)"
        />

        {/* Leaf 3 - Mid stem broad leaf */}
        <path
          d="M 68 175 C 80 155 105 160 102 180 C 100 195 80 195 68 175 Z"
          fill="url(#leafGrad1)"
        />

        {/* Leaf 4 - Mid right branch leaf */}
        <path
          d="M 155 110 C 175 100 185 115 175 130 C 165 142 148 130 155 110 Z"
          fill="url(#leafGrad2)"
        />

        {/* Flower bud / Petal cluster at right */}
        <path
          d="M 175 130 C 190 120 205 135 190 148 C 175 155 165 140 175 130 Z"
          fill="url(#petalGrad)"
        />

        {/* Upper branch leaf */}
        <path
          d="M 80 40 C 65 30 75 15 90 22 C 102 28 98 42 80 40 Z"
          fill="url(#leafGrad2)"
        />

        {/* Top blooming flower bud */}
        <g transform="translate(170, 30)">
          {/* Petal 1 */}
          <path
            d="M 0 0 C 15 -18 30 -5 18 10 C 8 20 -5 12 0 0 Z"
            fill="url(#petalGrad)"
          />
          {/* Petal 2 */}
          <path
            d="M 0 0 C -12 -16 5 -25 15 -10 C 20 0 10 8 0 0 Z"
            fill="url(#leafGrad1)"
            opacity="0.8"
          />
          {/* Petal 3 - soft overlay */}
          <circle cx="8" cy="-2" r="4" fill="#F1D9DF" opacity="0.8" />
        </g>

        {/* Small floating accent petals */}
        <ellipse cx="60" cy="115" rx="6" ry="3.5" transform="rotate(-25 60 115)" fill="#F1D9DF" opacity="0.65" />
        <ellipse cx="130" cy="70" rx="7" ry="4" transform="rotate(35 130 70)" fill="#BD7C91" opacity="0.45" />
        <ellipse cx="105" cy="130" rx="5" ry="3" transform="rotate(15 105 130)" fill="#632D40" opacity="0.3" />
      </svg>
    </div>
  )
}

// 2. Decorative Leaves for Header (Top-Right)
export function BotanicalHeaderLeaves({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 180 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-44 h-16 opacity-60"
      >
        <defs>
          <linearGradient id="headerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BD7C91" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#632D40" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="headerGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F1D9DF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#BD7C91" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Flowing stem arching from top right */}
        <path
          d="M 180 10 C 130 5 90 25 40 45"
          stroke="#BD7C91"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* Leaves */}
        <path
          d="M 140 12 C 145 -2 165 0 160 16 C 152 24 138 22 140 12 Z"
          fill="url(#headerGrad1)"
        />
        <path
          d="M 115 18 C 105 6 122 -3 130 10 C 135 18 122 24 115 18 Z"
          fill="url(#headerGrad2)"
        />
        <path
          d="M 85 28 C 75 16 92 10 98 22 C 102 30 90 35 85 28 Z"
          fill="url(#headerGrad1)"
        />
        <path
          d="M 55 38 C 45 28 60 22 66 34 C 70 42 60 45 55 38 Z"
          fill="url(#headerGrad2)"
        />

        {/* Petal accents */}
        <ellipse cx="40" cy="45" rx="5" ry="3" transform="rotate(-30 40 45)" fill="#F1D9DF" opacity="0.7" />
        <circle cx="128" cy="8" r="2.5" fill="#632D40" opacity="0.3" />
        <circle cx="95" cy="18" r="2" fill="#BD7C91" opacity="0.4" />
      </svg>
    </div>
  )
}

// 3. Elegant Botanical Corner Ornament (Top-Right or Bottom-Right of Viewports/Pages)
export function BotanicalCornerFloral({ 
  position = 'top-right', 
  className = '' 
}: { 
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  className?: string 
}) {
  const rotationClass = 
    position === 'bottom-right' ? 'rotate-90' :
    position === 'bottom-left' ? 'rotate-180' :
    position === 'top-left' ? '-rotate-90' : ''

  return (
    <div 
      className={`pointer-events-none select-none ${rotationClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-48 opacity-45"
      >
        <defs>
          <linearGradient id="cornerBurgundy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#632D40" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#BD7C91" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="cornerBlush" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F1D9DF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BD7C91" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Soft radial background aura */}
        <circle cx="180" cy="20" r="100" fill="#F1D9DF" opacity="0.25" />

        {/* Main corner stem */}
        <path
          d="M 200 0 Q 140 40 90 100 T 20 190"
          stroke="#BD7C91"
          strokeWidth="2"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* Foliage leaves along arc */}
        <path
          d="M 160 30 C 150 10 175 5 185 25 C 190 38 170 45 160 30 Z"
          fill="url(#cornerBurgundy)"
        />
        <path
          d="M 130 55 C 110 40 125 25 145 42 C 152 52 140 65 130 55 Z"
          fill="url(#cornerBlush)"
        />
        <path
          d="M 105 85 C 85 75 95 55 118 70 C 126 80 115 92 105 85 Z"
          fill="url(#cornerBurgundy)"
        />
        <path
          d="M 75 120 C 55 110 68 95 88 108 C 95 118 85 130 75 120 Z"
          fill="url(#cornerBlush)"
        />
        <path
          d="M 45 155 C 28 145 40 130 58 142 C 65 152 55 165 45 155 Z"
          fill="url(#cornerBurgundy)"
        />

        {/* Floating petals */}
        <path
          d="M 120 110 C 110 100 115 90 128 98 C 135 105 130 115 120 110 Z"
          fill="#F1D9DF"
          opacity="0.7"
        />
        <ellipse cx="60" cy="180" rx="8" ry="4" transform="rotate(-40 60 180)" fill="#BD7C91" opacity="0.4" />
      </svg>
    </div>
  )
}

// 4. Subtle Card Watermark Accent for Dashboard & Metrics
export function BotanicalCardAccent({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`pointer-events-none select-none absolute right-0 bottom-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-20 opacity-25"
      >
        <path
          d="M 100 90 C 80 70 70 50 60 20"
          stroke="#BD7C91"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        <path
          d="M 85 65 C 70 60 75 45 90 52 C 98 58 95 70 85 65 Z"
          fill="#BD7C91"
        />
        <path
          d="M 70 42 C 55 35 62 22 75 30 C 82 36 80 46 70 42 Z"
          fill="#F1D9DF"
        />
        <path
          d="M 60 20 C 48 10 55 0 68 8 C 74 14 70 24 60 20 Z"
          fill="#632D40"
        />
      </svg>
    </div>
  )
}

// 5. Decorative Flowing Botanical Footer Banner
export function BotanicalFooterBanner({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`relative w-full pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background soft wave SVG */}
      <svg
        viewBox="0 0 1200 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-16 sm:h-20 object-cover opacity-60"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="footerWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1D9DF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#BD7C91" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F1D9DF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <path
          d="M 0 45 C 200 15 400 65 600 35 C 800 10 1000 60 1200 30 L 1200 90 L 0 90 Z"
          fill="url(#footerWaveGrad)"
        />

        {/* Small flowing leaves and petals along wave */}
        <g opacity="0.6">
          <ellipse cx="180" cy="35" rx="7" ry="3.5" transform="rotate(-20 180 35)" fill="#632D40" />
          <ellipse cx="320" cy="48" rx="8" ry="4" transform="rotate(25 320 48)" fill="#BD7C91" />
          <ellipse cx="580" cy="38" rx="6" ry="3" transform="rotate(-15 580 38)" fill="#F1D9DF" />
          <ellipse cx="760" cy="28" rx="8" ry="4" transform="rotate(30 760 28)" fill="#BD7C91" />
          <ellipse cx="940" cy="46" rx="7" ry="3.5" transform="rotate(-10 940 46)" fill="#632D40" />
          <ellipse cx="1080" cy="36" rx="6" ry="3" transform="rotate(18 1080 36)" fill="#BD7C91" />
        </g>
      </svg>
    </div>
  )
}

// 6. Delicate Petal Cluster for BloomPilot AI & Recommendation panels
export function BotanicalPetalCluster({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 opacity-40"
      >
        {/* Flower Blossom in Burgundy & Dusty Rose */}
        <circle cx="60" cy="60" r="14" fill="#F1D9DF" opacity="0.8" />
        <ellipse cx="60" cy="40" rx="10" ry="16" fill="#BD7C91" opacity="0.6" />
        <ellipse cx="60" cy="80" rx="10" ry="16" fill="#BD7C91" opacity="0.6" />
        <ellipse cx="40" cy="60" rx="16" ry="10" fill="#632D40" opacity="0.45" />
        <ellipse cx="80" cy="60" rx="16" ry="10" fill="#632D40" opacity="0.45" />
        {/* Center core */}
        <circle cx="60" cy="60" r="6" fill="#632D40" opacity="0.75" />
      </svg>
    </div>
  )
}
