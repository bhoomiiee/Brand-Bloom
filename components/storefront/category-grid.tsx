import Link from 'next/link'
import { Category } from '@prisma/client'
import { ThemeConfig, getCardClasses } from '@/lib/themes'

interface CategoryGridProps {
  categories: Category[]
  storeSlug: string
  theme: ThemeConfig
}

export function CategoryGrid({ categories, storeSlug, theme }: CategoryGridProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 
          className="text-3xl font-bold mb-8 text-center theme-font-heading"
          style={{ color: theme.colors.foreground }}
        >
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/store/${storeSlug}/category/${category.slug}`}
            >
              <div
                className={`${getCardClasses(theme)} p-6 text-center cursor-pointer group`}
                style={{ borderColor: theme.colors.border }}
              >
                {/* Category Icon/Image */}
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Category Name */}
                <h3
                  className="font-semibold theme-font-heading"
                  style={{ color: theme.colors.foreground }}
                >
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-sm mt-1" style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
