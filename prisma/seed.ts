/**
 * Database Seed Script
 * 
 * Creates demo stores, products, and data for testing
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const ownerPassword = await hash('demo123', 10)
  
  const demoOwner = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: {
      email: 'owner@demo.com',
      name: 'Demo Owner',
      password: ownerPassword,
    },
  })

  const demoStaff = await prisma.user.upsert({
    where: { email: 'staff@demo.com' },
    update: {},
    create: {
      email: 'staff@demo.com',
      name: 'Demo Staff',
      password: ownerPassword,
    },
  })

  console.log('✓ Created demo users')

  // Create demo store
  const demoStore = await prisma.store.upsert({
    where: { slug: 'demo-fashion-store' },
    update: {},
    create: {
      name: 'Demo Fashion Store',
      slug: 'demo-fashion-store',
      description: 'A beautiful fashion boutique showcasing the latest trends',
      businessType: 'FASHION',
      status: 'ACTIVE',
      theme: 'modern',
      email: 'contact@demofashion.com',
      phone: '(555) 123-4567',
      address: '123 Fashion Ave, Style City, ST 12345',
      publishedAt: new Date(),
    },
  })

  console.log('✓ Created demo store')

  // Create memberships
  await prisma.membership.upsert({
    where: {
      userId_storeId: {
        userId: demoOwner.id,
        storeId: demoStore.id,
      },
    },
    update: {},
    create: {
      userId: demoOwner.id,
      storeId: demoStore.id,
      role: 'OWNER',
      status: 'ACTIVE',
    },
  })

  await prisma.membership.upsert({
    where: {
      userId_storeId: {
        userId: demoStaff.id,
        storeId: demoStore.id,
      },
    },
    update: {},
    create: {
      userId: demoStaff.id,
      storeId: demoStore.id,
      role: 'STAFF',
      status: 'ACTIVE',
    },
  })

  console.log('✓ Created memberships')

  // Create categories
  const categories = [
    { name: 'Women', slug: 'women', description: 'Women\'s fashion and accessories' },
    { name: 'Men', slug: 'men', description: 'Men\'s clothing and accessories' },
    { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories for everyone' },
    { name: 'Sale', slug: 'sale', description: 'Special offers and discounted items' },
  ]

  const createdCategories = []
  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: {
        storeId_slug: {
          storeId: demoStore.id,
          slug: category.slug,
        },
      },
      update: {},
      create: {
        ...category,
        storeId: demoStore.id,
        isCustom: false,
      },
    })
    createdCategories.push(cat)
  }

  console.log('✓ Created categories')

  // Create sample products
  const products = [
    {
      name: 'Classic Denim Jacket',
      slug: 'classic-denim-jacket',
      description: 'Timeless denim jacket perfect for any season. Made from premium cotton denim with a comfortable fit.',
      categoryId: createdCategories[0].id,
      price: 89.99,
      comparePrice: 129.99,
      stock: 25,
      sku: 'DNM-JKT-001',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      ],
    },
    {
      name: 'Slim Fit Chinos',
      slug: 'slim-fit-chinos',
      description: 'Versatile slim fit chinos available in multiple colors. Perfect for both casual and semi-formal occasions.',
      categoryId: createdCategories[1].id,
      price: 59.99,
      stock: 40,
      sku: 'CHN-SLM-001',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      ],
    },
    {
      name: 'Leather Crossbody Bag',
      slug: 'leather-crossbody-bag',
      description: 'Elegant leather crossbody bag with adjustable strap. Perfect size for everyday essentials.',
      categoryId: createdCategories[2].id,
      price: 124.99,
      comparePrice: 179.99,
      stock: 15,
      sku: 'BAG-CRS-001',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      ],
    },
    {
      name: 'Cotton T-Shirt Pack',
      slug: 'cotton-tshirt-pack',
      description: 'Pack of 3 premium cotton t-shirts in classic colors. Comfortable and durable.',
      categoryId: createdCategories[1].id,
      price: 39.99,
      stock: 50,
      sku: 'TSH-PCK-001',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ],
    },
    {
      name: 'Summer Sundress',
      slug: 'summer-sundress',
      description: 'Light and breezy sundress perfect for warm weather. Available in floral and solid patterns.',
      categoryId: createdCategories[0].id,
      price: 79.99,
      stock: 20,
      sku: 'DRS-SUM-001',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      ],
    },
    {
      name: 'Classic Sunglasses',
      slug: 'classic-sunglasses',
      description: 'UV protection sunglasses with timeless aviator design. Comes with protective case.',
      categoryId: createdCategories[2].id,
      price: 49.99,
      comparePrice: 89.99,
      stock: 30,
      sku: 'SUN-AVI-001',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      ],
    },
    {
      name: 'Winter Wool Coat',
      slug: 'winter-wool-coat',
      description: 'Luxurious wool blend coat for cold weather. Fully lined with interior pockets.',
      categoryId: createdCategories[0].id,
      price: 249.99,
      stock: 8,
      sku: 'COT-WOL-001',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      ],
    },
    {
      name: 'Leather Belt',
      slug: 'leather-belt',
      description: 'Genuine leather belt with classic buckle. Available in black and brown.',
      categoryId: createdCategories[2].id,
      price: 34.99,
      stock: 45,
      sku: 'BLT-LTH-001',
      images: [
        'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=800',
      ],
    },
  ]

  for (const product of products) {
    const { images, ...productData } = product
    
    const createdProduct = await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: demoStore.id,
          slug: product.slug,
        },
      },
      update: {},
      create: {
        ...productData,
        storeId: demoStore.id,
      },
    })

    // Add product images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.upsert({
        where: {
          id: `${createdProduct.id}-img-${i}`,
        },
        update: {},
        create: {
          id: `${createdProduct.id}-img-${i}`,
          productId: createdProduct.id,
          url: images[i],
          altText: product.name,
          sortOrder: i,
        },
      })
    }
  }

  console.log('✓ Created sample products')

  // Create site content
  const contentKeys = [
    { key: 'hero_title', value: 'Discover Your Style', type: 'text' },
    { key: 'hero_subtitle', value: 'Shop the latest fashion trends with confidence', type: 'text' },
    { key: 'hero_banner', value: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920', type: 'image' },
    { key: 'footer_text', value: '© 2026 Demo Fashion Store. All rights reserved.', type: 'text' },
    { key: 'primary_color', value: '#8B5CF6', type: 'color' },
    { key: 'secondary_color', value: '#EC4899', type: 'color' },
  ]

  for (const content of contentKeys) {
    await prisma.siteContent.upsert({
      where: {
        storeId_key: {
          storeId: demoStore.id,
          key: content.key,
        },
      },
      update: {},
      create: {
        ...content,
        storeId: demoStore.id,
      },
    })
  }

  console.log('✓ Created site content')

  // Create sample customer and order
  const customer = await prisma.customer.create({
    data: {
      storeId: demoStore.id,
      email: 'customer@example.com',
      name: 'Jane Customer',
      phone: '(555) 987-6543',
    },
  })

  const order = await prisma.order.create({
    data: {
      storeId: demoStore.id,
      customerId: customer.id,
      orderNumber: 'ORD-' + Date.now(),
      status: 'PLACED',
      customerName: customer.name!,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: '456 Customer St',
      shippingCity: 'Buyerville',
      shippingState: 'CA',
      shippingZip: '90210',
      shippingCountry: 'US',
      subtotal: 169.98,
      tax: 13.60,
      shipping: 10.00,
      discount: 0,
      total: 193.58,
    },
  })

  // Add order items
  const firstProduct = await prisma.product.findFirst({
    where: { storeId: demoStore.id },
  })

  if (firstProduct) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: firstProduct.id,
        productName: firstProduct.name,
        productSku: firstProduct.sku,
        price: firstProduct.price,
        quantity: 2,
        subtotal: firstProduct.price.toNumber() * 2,
      },
    })

    // Create order event
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        storeId: demoStore.id,
        userId: demoOwner.id,
        newStatus: 'PLACED',
        notes: 'Order placed successfully',
      },
    })
  }

  console.log('✓ Created sample order')

  // Create analytics data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.storeAnalytics.upsert({
    where: {
      storeId_date: {
        storeId: demoStore.id,
        date: today,
      },
    },
    update: {},
    create: {
      storeId: demoStore.id,
      date: today,
      views: 150,
      visitors: 89,
      orders: 12,
      revenue: 1456.78,
      productViews: 342,
      cartAdds: 28,
    },
  })

  console.log('✓ Created analytics data')

  console.log('\n✅ Seeding completed successfully!\n')
  console.log('Demo credentials:')
  console.log('  Owner: owner@demo.com / demo123')
  console.log('  Staff: staff@demo.com / demo123')
  console.log('  Store: /store/demo-fashion-store\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
