/**
 * Application Constants
 */

// ============================================================================
// PREDEFINED CATEGORIES
// ============================================================================

export const PREDEFINED_CATEGORIES = [
  // Fashion
  { name: 'Women', slug: 'women', businessTypes: ['FASHION'] },
  { name: 'Men', slug: 'men', businessTypes: ['FASHION'] },
  { name: 'Accessories', slug: 'accessories', businessTypes: ['FASHION'] },
  { name: 'Shoes', slug: 'shoes', businessTypes: ['FASHION'] },
  { name: 'Jewelry', slug: 'jewelry', businessTypes: ['FASHION'] },
  
  // Electronics
  { name: 'Computers', slug: 'computers', businessTypes: ['ELECTRONICS'] },
  { name: 'Phones & Tablets', slug: 'phones-tablets', businessTypes: ['ELECTRONICS'] },
  { name: 'Audio', slug: 'audio', businessTypes: ['ELECTRONICS'] },
  { name: 'Gaming', slug: 'gaming', businessTypes: ['ELECTRONICS'] },
  { name: 'Cameras', slug: 'cameras', businessTypes: ['ELECTRONICS'] },
  
  // Home & Garden
  { name: 'Furniture', slug: 'furniture', businessTypes: ['HOME_GARDEN'] },
  { name: 'Decor', slug: 'decor', businessTypes: ['HOME_GARDEN'] },
  { name: 'Kitchen', slug: 'kitchen', businessTypes: ['HOME_GARDEN'] },
  { name: 'Garden', slug: 'garden', businessTypes: ['HOME_GARDEN'] },
  { name: 'Bedding', slug: 'bedding', businessTypes: ['HOME_GARDEN'] },
  
  // Beauty & Health
  { name: 'Skincare', slug: 'skincare', businessTypes: ['BEAUTY_HEALTH'] },
  { name: 'Makeup', slug: 'makeup', businessTypes: ['BEAUTY_HEALTH'] },
  { name: 'Haircare', slug: 'haircare', businessTypes: ['BEAUTY_HEALTH'] },
  { name: 'Fragrance', slug: 'fragrance', businessTypes: ['BEAUTY_HEALTH'] },
  { name: 'Wellness', slug: 'wellness', businessTypes: ['BEAUTY_HEALTH'] },
  
  // Sports & Outdoors
  { name: 'Exercise & Fitness', slug: 'exercise-fitness', businessTypes: ['SPORTS_OUTDOORS'] },
  { name: 'Outdoor Recreation', slug: 'outdoor-recreation', businessTypes: ['SPORTS_OUTDOORS'] },
  { name: 'Sports Equipment', slug: 'sports-equipment', businessTypes: ['SPORTS_OUTDOORS'] },
  { name: 'Camping', slug: 'camping', businessTypes: ['SPORTS_OUTDOORS'] },
  
  // Books & Media
  { name: 'Books', slug: 'books', businessTypes: ['BOOKS_MEDIA'] },
  { name: 'Movies', slug: 'movies', businessTypes: ['BOOKS_MEDIA'] },
  { name: 'Music', slug: 'music', businessTypes: ['BOOKS_MEDIA'] },
  { name: 'Games', slug: 'games', businessTypes: ['BOOKS_MEDIA'] },
  
  // Food & Beverage
  { name: 'Beverages', slug: 'beverages', businessTypes: ['FOOD_BEVERAGE'] },
  { name: 'Snacks', slug: 'snacks', businessTypes: ['FOOD_BEVERAGE'] },
  { name: 'Pantry', slug: 'pantry', businessTypes: ['FOOD_BEVERAGE'] },
  { name: 'Specialty Foods', slug: 'specialty-foods', businessTypes: ['FOOD_BEVERAGE'] },
  
  // Toys & Kids
  { name: 'Toys', slug: 'toys', businessTypes: ['TOYS_KIDS'] },
  { name: 'Baby Products', slug: 'baby-products', businessTypes: ['TOYS_KIDS'] },
  { name: 'Kids Clothing', slug: 'kids-clothing', businessTypes: ['TOYS_KIDS'] },
  { name: 'Educational', slug: 'educational', businessTypes: ['TOYS_KIDS'] },
  
  // Automotive
  { name: 'Parts', slug: 'parts', businessTypes: ['AUTOMOTIVE'] },
  { name: 'Accessories', slug: 'auto-accessories', businessTypes: ['AUTOMOTIVE'] },
  { name: 'Tools', slug: 'tools', businessTypes: ['AUTOMOTIVE'] },
  { name: 'Car Care', slug: 'car-care', businessTypes: ['AUTOMOTIVE'] },
  
  // Universal
  { name: 'New Arrivals', slug: 'new-arrivals', businessTypes: ['FASHION', 'ELECTRONICS', 'HOME_GARDEN', 'BEAUTY_HEALTH', 'SPORTS_OUTDOORS', 'BOOKS_MEDIA', 'FOOD_BEVERAGE', 'TOYS_KIDS', 'AUTOMOTIVE', 'OTHER'] },
  { name: 'Sale', slug: 'sale', businessTypes: ['FASHION', 'ELECTRONICS', 'HOME_GARDEN', 'BEAUTY_HEALTH', 'SPORTS_OUTDOORS', 'BOOKS_MEDIA', 'FOOD_BEVERAGE', 'TOYS_KIDS', 'AUTOMOTIVE', 'OTHER'] },
  { name: 'Best Sellers', slug: 'best-sellers', businessTypes: ['FASHION', 'ELECTRONICS', 'HOME_GARDEN', 'BEAUTY_HEALTH', 'SPORTS_OUTDOORS', 'BOOKS_MEDIA', 'FOOD_BEVERAGE', 'TOYS_KIDS', 'AUTOMOTIVE', 'OTHER'] },
]

/**
 * Get predefined categories for a business type
 */
export function getCategoriesForBusinessType(businessType: string) {
  return PREDEFINED_CATEGORIES.filter(cat => 
    cat.businessTypes.includes(businessType)
  )
}

// ============================================================================
// THEMES
// ============================================================================

export const THEMES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design with focus on products',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    fontFamily: 'inter',
    preview: '/themes/modern-preview.jpg',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional e-commerce layout with familiar navigation',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'roboto',
    preview: '/themes/classic-preview.jpg',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-impact visuals with strong typography',
    primaryColor: '#EF4444',
    secondaryColor: '#F59E0B',
    fontFamily: 'montserrat',
    preview: '/themes/bold-preview.jpg',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography',
    primaryColor: '#1F2937',
    secondaryColor: '#D97706',
    fontFamily: 'playfair',
    preview: '/themes/elegant-preview.jpg',
  },
]

// ============================================================================
// BUSINESS TYPES
// ============================================================================

export const BUSINESS_TYPES = [
  { value: 'FASHION', label: 'Fashion & Apparel', icon: '👔' },
  { value: 'ELECTRONICS', label: 'Electronics & Technology', icon: '💻' },
  { value: 'HOME_GARDEN', label: 'Home & Garden', icon: '🏡' },
  { value: 'BEAUTY_HEALTH', label: 'Beauty & Health', icon: '💄' },
  { value: 'SPORTS_OUTDOORS', label: 'Sports & Outdoors', icon: '⚽' },
  { value: 'BOOKS_MEDIA', label: 'Books & Media', icon: '📚' },
  { value: 'FOOD_BEVERAGE', label: 'Food & Beverage', icon: '🍔' },
  { value: 'TOYS_KIDS', label: 'Toys & Kids', icon: '🧸' },
  { value: 'AUTOMOTIVE', label: 'Automotive', icon: '🚗' },
  { value: 'OTHER', label: 'Other', icon: '🏪' },
]

// ============================================================================
// ORDER STATUS
// ============================================================================

export const ORDER_STATUSES = [
  { value: 'PLACED', label: 'Placed', color: 'bg-blue-100 text-blue-800', icon: '📦' },
  { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800', icon: '💳' },
  { value: 'PACKED', label: 'Packed', color: 'bg-purple-100 text-purple-800', icon: '📦' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: '🚚' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: '✅' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' },
]

export function getOrderStatusConfig(status: string) {
  return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0]
}

// ============================================================================
// DEMO PRODUCT TEMPLATES
// ============================================================================

// ============================================================================
// DEMO PRODUCT TEMPLATES (WITH HIGH-RESOLUTION IMAGES)
// ============================================================================

export const DEMO_PRODUCTS_BY_CATEGORY: Record<string, any[]> = {
  flowers_bouquets: [
    {
      name: 'Signature Imported Rose Bouquet',
      description: 'Handcrafted luxury bouquet featuring 24 premium imported long-stem red roses wrapped in elegant matte paper.',
      price: 2499.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop',
    },
    {
      name: 'Luxury Celebration Gift Hamper',
      description: 'Curated gift hamper packed with gourmet artisan treats, scented botanical candle, and luxury keepsake box.',
      price: 3999.00,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop',
    },
    {
      name: 'Blushing Peony & Hydrangea Bunch',
      description: 'Delicate pastel arrangement of fresh seasonal Dutch peonies, blush pink hydrangeas, and fragrant eucalyptus.',
      price: 2899.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop',
    },
    {
      name: 'Golden Sunflower Joy Bouquet',
      description: 'Bright cheerful sunflowers paired with white statice blossoms and rustic burlap tying ribbon.',
      price: 1599.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop',
    },
    {
      name: 'Artisan Gourmet & Blossom Hamper',
      description: 'Festive gift basket with imported floral bouquet, specialty chocolates, and greeting card for loved ones.',
      price: 3499.00,
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop',
    },
  ],
  boutique: [
    {
      name: 'Silk Floral Wrap Dress',
      description: 'Elegant silk blend wrap dress with delicate botanical pattern, designed for timeless chic styling.',
      price: 2499.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
    },
    {
      name: 'Handwoven Leather Crossbody Bag',
      description: 'Artisanal genuine leather bag crafted with intricate woven details and brass hardware.',
      price: 3899.00,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop',
    },
    {
      name: 'Golden Pearl Statement Earrings',
      description: 'Handcrafted baroque pearl earrings dipped in 18k gold plating for an effortless elevated look.',
      price: 1299.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
    },
    {
      name: 'Artisan Botanical Scented Candle',
      description: 'Hand-poured soy wax candle infused with lavender, bergamot, and wild amber essential oils.',
      price: 799.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop',
    },
    {
      name: 'Embroidered Bohemian Linen Blouse',
      description: 'Breathable organic linen blouse adorned with fine tone-on-tone artisan embroidery.',
      price: 1899.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
    },
  ],
  fashion: [
    {
      name: 'Classic Denim Jacket',
      description: 'Timeless premium cotton denim jacket with reinforced stitching and comfortable relaxed fit.',
      price: 2999.00,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
    },
    {
      name: 'Slim Fit Chinos',
      description: 'Versatile stretch-cotton chinos crafted for effortless day-to-night styling.',
      price: 1999.00,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop',
    },
    {
      name: 'Leather Crossbody Bag',
      description: 'Smooth full-grain leather everyday bag featuring zippered compartments and adjustable strap.',
      price: 3499.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop',
    },
    {
      name: 'Summer Floral Dress',
      description: 'Breezy sundress tailored with lightweight fabric and feminine ruffled hemline.',
      price: 2299.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
    },
  ],
  jewelry: [
    {
      name: 'Solitaire Crystal Necklace',
      description: 'Dainty 18k gold-plated chain featuring a sparkling brilliant-cut cubic zirconia pendant.',
      price: 1599.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
    },
    {
      name: 'Vintage Gold Band Ring',
      description: 'Hand-finished hammered gold ring designed to be worn solo or stacked.',
      price: 999.00,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop',
    },
    {
      name: 'Pearl Drop Earrings',
      description: 'Elegant freshwater pearl drop earrings with hypoallergenic titanium posts.',
      price: 1299.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
    },
  ],
  electronics: [
    {
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Immersive sound with active noise cancellation and 30-hour battery life.',
      price: 7999.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Health and workout tracker with AMOLED display and heart rate monitoring.',
      price: 4999.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: '360-degree deep bass waterproof speaker with 12 hours of continuous playback.',
      price: 2499.00,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop',
    },
  ],
  home_garden: [
    {
      name: 'Modern Ceramic Table Lamp',
      description: 'Minimalist warm-light LED lamp crafted from ribbed matte ceramic.',
      price: 2199.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop',
    },
    {
      name: 'Textured Geometric Cushion',
      description: 'Woven organic cotton cushion cover with plush hypoallergenic filling.',
      price: 899.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop',
    },
    {
      name: 'Minimalist Ceramic Planter',
      description: 'Handcrafted stoneware planter complete with drainage plate for indoor foliage.',
      price: 1199.00,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop',
    },
  ],
  beauty_health: [
    {
      name: 'Radiance Glow Botanical Serum',
      description: 'Vitamin C & Hyaluronic acid infused antioxidant face serum for luminous hydration.',
      price: 1499.00,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop',
    },
    {
      name: 'Rosewater Hydrating Face Mist',
      description: 'Pure organic steam-distilled Bulgarian rose water that refreshes and tones.',
      price: 799.00,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-00f723824057?w=800&auto=format&fit=crop',
    },
    {
      name: 'Overnight Rejuvenating Face Oil',
      description: 'Nourishing squalane and jojoba elixir that locks in moisture overnight.',
      price: 1899.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop',
    },
  ],
  food_beverage: [
    {
      name: 'Artisan Single-Origin Coffee Beans',
      description: 'Medium roast Arabica whole bean coffee with rich caramel and chocolate notes.',
      price: 699.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop',
    },
    {
      name: 'Handcrafted Organic Sourdough',
      description: 'Slow-fermented artisan crusty sourdough loaf made with whole grain flours.',
      price: 349.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
    },
    {
      name: 'Artisan Dark Chocolate Truffles Box',
      description: 'Assortment of rich 70% cacao truffles dusted with Dutch cocoa and sea salt.',
      price: 899.00,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop',
    },
  ],
  pet_supplies: [
    {
      name: 'Organic Salmon & Sweet Potato Pet Treats',
      description: 'All-natural grain-free crunchy treats enriched with omega-3 fatty acids.',
      price: 649.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&auto=format&fit=crop',
    },
    {
      name: 'Orthopedic Memory Foam Pet Bed',
      description: 'Ultra-plush washable calming pet bed with supportive ergonomic bolsters.',
      price: 2899.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop',
    },
    {
      name: 'Durable Braided Cotton Tug Rope Toy',
      description: 'Non-toxic natural cotton dental chew rope for active play and teething.',
      price: 399.00,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800&auto=format&fit=crop',
    },
  ],
  books_stationery: [
    {
      name: 'Handbound Leather Travel Journal',
      description: 'Vintage refillable deckle-edge paper journal with brass lock and bookmark ribbon.',
      price: 1199.00,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
    },
    {
      name: 'Curated World Classics Hardcover Edition',
      description: 'Collector foil-stamped clothbound classic literature with archival acid-free paper.',
      price: 1499.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop',
    },
    {
      name: 'Matte Brass Fountain Pen & Ink Set',
      description: 'Precision German iridium nib pen presented in a velvet gift box with black archival ink.',
      price: 1899.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop',
    },
  ],
  sports_fitness: [
    {
      name: 'Non-Slip Eco Alignment Yoga Mat',
      description: 'Extra-thick biodegradable natural rubber mat with laser-engraved alignment guides.',
      price: 1899.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop',
    },
    {
      name: 'Insulated Stainless Steel Sport Bottle',
      description: 'Vacuum insulated 1-liter canteen keeping drinks cold for 24 hours with leakproof spout.',
      price: 999.00,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop',
    },
    {
      name: 'Adjustable Resistance Bands Set',
      description: 'Heavy-duty 5-tube workout bands with foam handles, ankle straps, and carry pouch.',
      price: 1299.00,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
    },
  ],
}

/**
 * Intelligent tailored content generator based on business type & user description
 */
export function getTailoredContentForStore(
  businessType: string,
  description: string = '',
  storeName: string = 'Store'
) {
  const descLower = (description || '').toLowerCase()
  const nameLower = (storeName || '').toLowerCase()
  const combined = `${descLower} ${nameLower}`

  // 1. Flowers, Bouquets, Florist, Hampers
  if (
    combined.includes('bouquet') ||
    combined.includes('flower') ||
    combined.includes('florist') ||
    combined.includes('bloom') ||
    combined.includes('blossom') ||
    combined.includes('hamper') ||
    combined.includes('rose') ||
    combined.includes('floral') ||
    combined.includes('plant')
  ) {
    return {
      categoryKey: 'flowers_bouquets',
      heroImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Fresh Imported Flowers, Hand-Tied Bouquets & Luxury Gift Hampers',
      heroCta: 'Order Bouquets',
      suggestedCategories: ['Imported Bouquets', 'Luxury Gift Hampers', 'Fresh Flowers', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.flowers_bouquets,
    }
  }

  // 2. Boutique / Artisan Shop
  if (
    combined.includes('boutique') ||
    combined.includes('handmade') ||
    combined.includes('artisan') ||
    combined.includes('handcrafted') ||
    combined.includes('chic')
  ) {
    return {
      categoryKey: 'boutique',
      heroImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Curated Boutique Collections & Handcrafted Finds',
      heroCta: 'Explore Collection',
      suggestedCategories: ['Boutique Collection', 'New Arrivals', 'Handcrafted Accessories', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.boutique,
    }
  }

  // 2. Jewelry
  if (
    combined.includes('jewel') ||
    combined.includes('gem') ||
    combined.includes('diamond') ||
    combined.includes('necklace') ||
    combined.includes('earring')
  ) {
    return {
      categoryKey: 'jewelry',
      heroImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Exquisite Fine Jewelry & Artisan Handcrafted Pieces',
      heroCta: 'Shop Jewelry',
      suggestedCategories: ['Necklaces', 'Earrings', 'Rings', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.jewelry,
    }
  }

  // 3. Cafe / Bakery / Food
  if (
    businessType === 'FOOD_BEVERAGE' ||
    combined.includes('bakery') ||
    combined.includes('cafe') ||
    combined.includes('coffee') ||
    combined.includes('food') ||
    combined.includes('cake')
  ) {
    return {
      categoryKey: 'food_beverage',
      heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Freshly Baked Delights & Artisan Specialty Treats',
      heroCta: 'Order Fresh',
      suggestedCategories: ['Bakery Favorites', 'Artisan Coffee', 'Treats & Snacks', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.food_beverage,
    }
  }

  // 4. Beauty & Skincare
  if (
    businessType === 'BEAUTY_HEALTH' ||
    combined.includes('beauty') ||
    combined.includes('skin') ||
    combined.includes('cosmetic') ||
    combined.includes('glow')
  ) {
    return {
      categoryKey: 'beauty_health',
      heroImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Pure Organic Botanicals & Clean Beauty Rituals',
      heroCta: 'Shop Skincare',
      suggestedCategories: ['Serums & Oils', 'Hydration', 'Cleansers', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.beauty_health,
    }
  }

  // 5. Home & Living / Decor
  if (
    businessType === 'HOME_GARDEN' ||
    combined.includes('home') ||
    combined.includes('decor') ||
    combined.includes('furniture') ||
    combined.includes('living')
  ) {
    return {
      categoryKey: 'home_garden',
      heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Thoughtful Living & Inspiring Home Accents',
      heroCta: 'Shop Home',
      suggestedCategories: ['Lighting', 'Decor & Accents', 'Planters', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.home_garden,
    }
  }

  // 6. Electronics
  if (
    businessType === 'ELECTRONICS' ||
    combined.includes('tech') ||
    combined.includes('electronics') ||
    combined.includes('gadget')
  ) {
    return {
      categoryKey: 'electronics',
      heroImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Next-Generation Technology & Premium Smart Gadgets',
      heroCta: 'Shop Electronics',
      suggestedCategories: ['Audio', 'Wearables', 'Accessories', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.electronics,
    }
  }

  // 7. Pet Shop & Supplies
  if (
    businessType === 'OTHER' && (
      combined.includes('pet') ||
      combined.includes('dog') ||
      combined.includes('cat') ||
      combined.includes('puppy') ||
      combined.includes('kitten') ||
      combined.includes('animal')
    )
  ) {
    return {
      categoryKey: 'pet_supplies',
      heroImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Nutritious Treats, Cozy Beds & Playful Essentials for Pets',
      heroCta: 'Shop Pet Care',
      suggestedCategories: ['Organic Treats', 'Cozy Beds', 'Playful Toys', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.pet_supplies,
    }
  }

  // 8. Books & Stationery
  if (
    businessType === 'BOOKS_MEDIA' ||
    combined.includes('book') ||
    combined.includes('stationery') ||
    combined.includes('journal') ||
    combined.includes('novel') ||
    combined.includes('reading')
  ) {
    return {
      categoryKey: 'books_stationery',
      heroImage: 'https://images.unsplash.com/photo-1507842229458-574a62e08479?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Timeless Literature, Fine Stationery & Thoughtful Reads',
      heroCta: 'Explore Books',
      suggestedCategories: ['Hardcovers', 'Fine Stationery', 'Journals & Pens', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.books_stationery,
    }
  }

  // 9. Sports & Fitness
  if (
    businessType === 'SPORTS_OUTDOORS' ||
    combined.includes('sport') ||
    combined.includes('fitness') ||
    combined.includes('gym') ||
    combined.includes('workout') ||
    combined.includes('yoga')
  ) {
    return {
      categoryKey: 'sports_fitness',
      heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Performance Athletic Gear & Everyday Wellness Essentials',
      heroCta: 'Shop Fitness',
      suggestedCategories: ['Yoga & Training', 'Hydration', 'Accessories', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.sports_fitness,
    }
  }

  // 10. General Fashion (only if explicitly fashion and not boutique)
  if (businessType === 'FASHION' || combined.includes('clothing') || combined.includes('apparel')) {
    return {
      categoryKey: 'fashion',
      heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop',
      heroTitle: `Welcome to ${storeName}`,
      heroSubtitle: 'Elevate Your Everyday Style with Curated Pieces',
      heroCta: 'Shop Fashion',
      suggestedCategories: ['New Arrivals', 'Outerwear', 'Essentials', 'Best Sellers'],
      demoProducts: DEMO_PRODUCTS_BY_CATEGORY.fashion,
    }
  }

  // Default fallback for Other: lifestyle boutique
  return {
    categoryKey: 'boutique',
    heroImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop',
    heroTitle: `Welcome to ${storeName}`,
    heroSubtitle: description ? description : 'Discover Handcrafted & Curated Quality Products',
    heroCta: 'Shop Now',
    suggestedCategories: ['Featured Collection', 'New Arrivals', 'Handcrafted Picks', 'Best Sellers'],
    demoProducts: DEMO_PRODUCTS_BY_CATEGORY.boutique,
  }
}

// ============================================================================
// RESERVED SLUGS
// ============================================================================

export const RESERVED_SLUGS = [
  'admin',
  'api',
  'auth',
  'dashboard',
  'store',
  'login',
  'register',
  'signup',
  'signin',
  'signout',
  'logout',
  'profile',
  'settings',
  'account',
  'cart',
  'checkout',
  'orders',
  'products',
  'categories',
  'search',
  'about',
  'contact',
  'help',
  'support',
  'terms',
  'privacy',
  'legal',
]

/**
 * Check if slug is reserved
 */
export function isSlugReserved(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase())
}

// ============================================================================
// PAGINATION
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ============================================================================
// FILE UPLOAD LIMITS
// ============================================================================

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_CSV_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_IMPORT_TYPES = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

// ============================================================================
// CSV IMPORT TEMPLATE
// ============================================================================

export const CSV_TEMPLATE_HEADERS = [
  'name',
  'category',
  'description',
  'price',
  'comparePrice',
  'stock',
  'sku',
  'barcode',
  'imageUrl',
]

export const CSV_TEMPLATE_EXAMPLE = [
  {
    name: 'Example Product',
    category: 'accessories',
    description: 'A great product with excellent features',
    price: '29.99',
    comparePrice: '39.99',
    stock: '50',
    sku: 'EX-001',
    barcode: '123456789',
    imageUrl: 'https://example.com/image.jpg',
  },
]

// ============================================================================
// BLOOMPILOT RECOMMENDATION TYPES
// ============================================================================

export const RECOMMENDATION_TYPES = [
  {
    value: 'PRODUCT_OPTIMIZATION',
    label: 'Product Optimization',
    description: 'Improve product details and presentation',
    icon: '📦',
  },
  {
    value: 'INVENTORY_ALERT',
    label: 'Inventory Alert',
    description: 'Stock management recommendations',
    icon: '📊',
  },
  {
    value: 'PRICING_STRATEGY',
    label: 'Pricing Strategy',
    description: 'Pricing and discount suggestions',
    icon: '💰',
  },
  {
    value: 'CONTENT_IMPROVEMENT',
    label: 'Content Improvement',
    description: 'Page and content optimization',
    icon: '📝',
  },
  {
    value: 'MARKETING_OPPORTUNITY',
    label: 'Marketing Opportunity',
    description: 'Promotion and marketing ideas',
    icon: '📣',
  },
]

// ============================================================================
// ANALYTICS THRESHOLDS
// ============================================================================

export const LOW_STOCK_THRESHOLD = 10
export const HIGH_VIEW_LOW_PURCHASE_RATIO = 0.05 // 5% conversion
export const SLOW_MOVING_DAYS = 30
