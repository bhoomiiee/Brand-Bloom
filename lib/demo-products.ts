/**
 * Demo Product Generator
 * 
 * Generates realistic demo products based on business type and categories
 */

export interface DemoProductTemplate {
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  imageUrl?: string
}

// Fashion products
const fashionProducts: DemoProductTemplate[] = [
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket perfect for any season. Made from premium cotton denim.',
    price: 89.99,
    comparePrice: 129.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Versatile slim fit chinos in classic colors. Perfect for casual and semi-formal occasions.',
    price: 59.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
  },
  {
    name: 'Cotton T-Shirt Pack',
    description: 'Pack of 3 premium cotton t-shirts in classic colors. Soft and comfortable.',
    price: 39.99,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Elegant leather crossbody bag with adjustable strap. Perfect for everyday use.',
    price: 124.99,
    comparePrice: 179.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
  },
  {
    name: 'Summer Sundress',
    description: 'Light and breezy sundress perfect for warm weather. Floral and solid patterns available.',
    price: 79.99,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
  },
  {
    name: 'Classic Sunglasses',
    description: 'UV protection sunglasses with timeless aviator design. Includes protective case.',
    price: 49.99,
    comparePrice: 89.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
  },
  {
    name: 'Winter Wool Coat',
    description: 'Luxurious wool blend coat for cold weather. Fully lined with interior pockets.',
    price: 249.99,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
  },
  {
    name: 'Leather Belt',
    description: 'Genuine leather belt with classic buckle. Available in black and brown.',
    price: 34.99,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=800',
  },
]

// Electronics products
const electronicsProducts: DemoProductTemplate[] = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    comparePrice: 399.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your workouts, heart rate, and sleep with this advanced fitness smartwatch.',
    price: 249.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof wireless speaker with 360-degree sound and 12-hour battery.',
    price: 79.99,
    comparePrice: 129.99,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
  },
  {
    name: 'USB-C Fast Charging Cable',
    description: 'Durable braided charging cable with fast charging support. 6ft length.',
    price: 19.99,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800',
  },
  {
    name: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 29.99,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1591290619762-f061dc3a1589?w=800',
  },
]

// Home & Garden products
const homeProducts: DemoProductTemplate[] = [
  {
    name: 'Modern LED Desk Lamp',
    description: 'Adjustable LED lamp with touch controls and USB charging port.',
    price: 49.99,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
  },
  {
    name: 'Decorative Throw Pillow Set',
    description: 'Set of 2 soft cotton pillows with geometric patterns. Multiple colors available.',
    price: 34.99,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
  },
  {
    name: 'Ceramic Plant Pot',
    description: 'Modern ceramic pot with drainage hole, perfect for indoor plants.',
    price: 24.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
  },
  {
    name: 'Aromatherapy Diffuser',
    description: 'Ultrasonic essential oil diffuser with LED lights and timer.',
    price: 39.99,
    comparePrice: 59.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
  },
]

const productsByType: Record<string, DemoProductTemplate[]> = {
  FASHION: fashionProducts,
  ELECTRONICS: electronicsProducts,
  HOME_GARDEN: homeProducts,
  BEAUTY_HEALTH: homeProducts, // Reuse for now
  SPORTS_OUTDOORS: electronicsProducts, // Reuse for now
  BOOKS_MEDIA: homeProducts, // Reuse for now
  FOOD_BEVERAGE: homeProducts, // Reuse for now
  TOYS_KIDS: homeProducts, // Reuse for now
  AUTOMOTIVE: electronicsProducts, // Reuse for now
  OTHER: fashionProducts, // Default
}

/**
 * Generate demo products for a specific business type
 */
export function getDemoProducts(businessType: string, count: number = 8): DemoProductTemplate[] {
  const products = productsByType[businessType] || fashionProducts
  return products.slice(0, Math.min(count, products.length))
}

/**
 * Generate demo products distributed across categories
 */
export function generateDemoProductsForCategories(
  categories: Array<{ id: string; name: string; slug: string }>,
  businessType: string
): Array<DemoProductTemplate & { categoryId: string }> {
  const availableProducts = getDemoProducts(businessType, 20)
  const result: Array<DemoProductTemplate & { categoryId: string }> = []

  categories.forEach((category, index) => {
    // Distribute products across categories
    const productsForCategory = availableProducts.slice(
      index * 2,
      Math.min((index + 1) * 2, availableProducts.length)
    )

    productsForCategory.forEach(product => {
      result.push({
        ...product,
        categoryId: category.id,
      })
    })
  })

  return result
}
