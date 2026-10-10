import Link from 'next/link'
import { Store, SiteContent } from '@prisma/client'
import { ThemeConfig, getButtonClasses } from '@/lib/themes'

interface StorefrontHeroProps {
  store: Store
  siteContent?: any
  theme: ThemeConfig
}

export function StorefrontHero({ store, siteContent, theme }: StorefrontHeroProps) {
  // Support both key-value dictionary and SiteContent models
  const contentMap: Record<string, string> = {}
  if (Array.isArray(siteContent)) {
    for (const item of siteContent) {
      if (item?.key && item?.value) contentMap[item.key] = item.value
    }
  } else if (siteContent && typeof siteContent === 'object') {
    Object.assign(contentMap, siteContent)
    if (siteContent.key && siteContent.value) {
      contentMap[siteContent.key] = siteContent.value
    }
  }

  // Also check if siteContent is attached directly on store
  if (Array.isArray((store as any).siteContent)) {
    for (const item of (store as any).siteContent) {
      if (item?.key && item?.value && !contentMap[item.key]) {
        contentMap[item.key] = item.value
      }
    }
  }

  const descLower = (store.description || '').toLowerCase()
  const nameLower = store.name.toLowerCase()
  const isFlowers =
    descLower.includes('bouquet') ||
    descLower.includes('flower') ||
    descLower.includes('florist') ||
    descLower.includes('bloom') ||
    descLower.includes('blossom') ||
    descLower.includes('hamper') ||
    descLower.includes('rose') ||
    descLower.includes('floral') ||
    nameLower.includes('flower') ||
    nameLower.includes('bloom') ||
    nameLower.includes('bouquet')

  const isBoutique = descLower.includes('boutique') || nameLower.includes('boutique')

  const defaultHeroImage = isFlowers
    ? 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1600&auto=format&fit=crop'
    : isBoutique
    ? 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop'
    : store.businessType === 'ELECTRONICS'
    ? 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&auto=format&fit=crop'
    : store.businessType === 'HOME_GARDEN'
    ? 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop'
    : store.businessType === 'BEAUTY_HEALTH'
    ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop'
    : store.businessType === 'FOOD_BEVERAGE' || descLower.includes('cafe') || descLower.includes('bakery')
    ? 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop'
    : store.businessType === 'BOOKS_MEDIA'
    ? 'https://images.unsplash.com/photo-1507842229458-574a62e08479?w=1600&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop'

  const heroTitle = contentMap['hero_title'] || contentMap['heroTitle'] || `Welcome to ${store.name}`
  const heroSubtitle =
    contentMap['hero_subtitle'] ||
    contentMap['heroSubtitle'] ||
    (isFlowers
      ? 'Fresh Imported Flowers, Hand-Tied Bouquets & Luxury Gift Hampers'
      : isBoutique
      ? 'Curated Boutique Collections & Handcrafted Finds'
      : 'Discover amazing products')
  const heroCta = contentMap['hero_cta'] || contentMap['heroCta'] || (isFlowers ? 'Order Bouquets' : 'Shop Now')
  const heroImage = contentMap['hero_image'] || contentMap['heroImage'] || defaultHeroImage

  return (
    <section 
      className="relative h-[500px] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.colors.muted }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.7)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <h1
          className="text-4xl md:text-6xl font-bold mb-4 theme-font-heading text-white"
        >
          {heroTitle}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90">
          {heroSubtitle}
        </p>
        <Link href={`/store/${store.slug}/products`}>
          <button
            className={`${getButtonClasses(theme)} text-white shadow-xl hover:shadow-2xl`}
            style={{ backgroundColor: theme.colors.primary }}
          >
            {heroCta}
          </button>
        </Link>
      </div>
    </section>
  )
}
