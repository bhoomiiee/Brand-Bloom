import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getCategoriesForBusinessType, DEMO_PRODUCTS_BY_CATEGORY, getTailoredContentForStore } from '@/lib/constants'
import { slugify, getAppBaseUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      storeDetails,
      categories = [],
      customCategories = [],
      productsMethod = 'skip',
      theme = 'modern',
    } = body

    if (!storeDetails) {
      return NextResponse.json({ error: 'Store details are required' }, { status: 400 })
    }

    // Create store
    const store = await db.store.create({
      data: {
        name: storeDetails.name,
        slug: storeDetails.slug,
        description: storeDetails.description || null,
        email: storeDetails.email || null,
        phone: storeDetails.phone || null,
        address: storeDetails.address || null,
        businessType: storeDetails.businessType,
        theme,
        status: 'ACTIVE',
        publishedAt: new Date(),
      },
    })

    // Create owner membership
    await db.membership.create({
      data: {
        userId: session.user.id,
        storeId: store.id,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    })

    // Get tailored content based on store details & description
    const tailored = getTailoredContentForStore(
      storeDetails.businessType,
      storeDetails.description || '',
      storeDetails.name
    )

    // Create categories
    const predefinedCategories = getCategoriesForBusinessType(storeDetails.businessType)
    const allCategories: { name: string; slug: string; isCustom: boolean }[] = []

    // Add selected predefined categories
    for (const categorySlug of categories) {
      const predefinedCat = predefinedCategories.find(c => c.slug === categorySlug)
      if (predefinedCat) {
        allCategories.push({
          name: predefinedCat.name,
          slug: predefinedCat.slug,
          isCustom: false,
        })
      }
    }

    // Add custom categories
    for (const customCat of customCategories) {
      allCategories.push({
        name: customCat,
        slug: slugify(customCat),
        isCustom: true,
      })
    }

    // If no categories were selected (e.g. OTHER category with no custom categories added), use tailored categories!
    if (allCategories.length === 0 && tailored.suggestedCategories) {
      for (const catName of tailored.suggestedCategories) {
        allCategories.push({
          name: catName,
          slug: slugify(catName),
          isCustom: true,
        })
      }
    }

    // Insert categories
    const createdCategories = await Promise.all(
      allCategories.map((cat, index) =>
        db.category.create({
          data: {
            storeId: store.id,
            name: cat.name,
            slug: cat.slug,
            isCustom: cat.isCustom,
            sortOrder: index,
          },
        })
      )
    )

    // Add tailored demo products if requested (with high-res pictures!)
    if (productsMethod === 'demo' && createdCategories.length > 0) {
      const demoProducts = tailored.demoProducts || DEMO_PRODUCTS_BY_CATEGORY.fashion || []
      
      for (let i = 0; i < Math.min(demoProducts.length, 6); i++) {
        const product = demoProducts[i]
        const category = createdCategories[i % createdCategories.length]

        const createdProduct = await db.product.create({
          data: {
            storeId: store.id,
            categoryId: category.id,
            name: product.name,
            slug: slugify(product.name),
            description: product.description,
            price: product.price,
            stock: product.stock || 20,
            isActive: true,
            isFeatured: i < 4, // First 4 are featured
          },
        })

        // IMPORTANT: Create ProductImage record so pictures load beautifully!
        if (product.imageUrl) {
          await db.productImage.create({
            data: {
              productId: createdProduct.id,
              url: product.imageUrl,
              altText: product.name,
              sortOrder: 0,
            },
          })
        }
      }
    }

    // Create initial site content tailored to store description
    await db.siteContent.createMany({
      data: [
        {
          storeId: store.id,
          key: 'hero_title',
          value: tailored.heroTitle || `Welcome to ${store.name}`,
          type: 'text',
        },
        {
          storeId: store.id,
          key: 'hero_subtitle',
          value: tailored.heroSubtitle || 'Discover amazing products',
          type: 'text',
        },
        {
          storeId: store.id,
          key: 'hero_image',
          value: tailored.heroImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&auto=format&fit=crop',
          type: 'image',
        },
        {
          storeId: store.id,
          key: 'hero_cta',
          value: tailored.heroCta || 'Shop Now',
          type: 'text',
        },
        {
          storeId: store.id,
          key: 'footer_text',
          value: `© ${new Date().getFullYear()} ${store.name}. All rights reserved.`,
          type: 'text',
        },
      ],
    })

    const baseUrl = getAppBaseUrl(request)
    const deployedUrl = `${baseUrl}/store/${store.slug}`

    return NextResponse.json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        deployedUrl,
        status: store.status,
        publishedAt: store.publishedAt,
        businessType: store.businessType,
        theme: store.theme,
      },
      deployment: {
        status: 'READY',
        provider: 'BrandBloom Global Edge CDN',
        deployedAt: store.publishedAt?.toISOString(),
      },
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
