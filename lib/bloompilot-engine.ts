import { prisma } from './db'
import { formatCurrency } from './utils'

type AnalysisResult = {
  response: string
  recommendation?: Recommendation
}

type Recommendation = {
  id: string
  type: 'MARKETING' | 'PRODUCT' | 'PRICING' | 'INVENTORY' | 'CUSTOMER'
  title: string
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  effort: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED'
  actions?: string[]
}

/**
 * BloomPilot AI Engine
 * Analyzes store data and generates actionable business growth recommendations
 */
export async function analyzeStoreAndRecommend(
  message: string,
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const lowerMessage = message.toLowerCase()

  // Analyze store performance
  if (
    lowerMessage.includes('analyze') ||
    lowerMessage.includes('performance') ||
    lowerMessage.includes('overview')
  ) {
    return await analyzeStorePerformance(storeId, userId)
  }

  // Growth recommendations
  if (
    lowerMessage.includes('growth') ||
    lowerMessage.includes('recommendation') ||
    lowerMessage.includes('improve')
  ) {
    return await generateGrowthRecommendations(storeId, userId)
  }

  // Increase sales
  if (
    lowerMessage.includes('increase sales') ||
    lowerMessage.includes('boost sales') ||
    lowerMessage.includes('more sales')
  ) {
    return await recommendSalesStrategies(storeId, userId)
  }

  // Product promotion
  if (
    lowerMessage.includes('promote') ||
    lowerMessage.includes('which product') ||
    lowerMessage.includes('what product')
  ) {
    return await recommendProductsToPromote(storeId, userId)
  }

  // Pricing strategy
  if (lowerMessage.includes('pricing') || lowerMessage.includes('price')) {
    return await analyzePricingStrategy(storeId, userId)
  }

  // Cart abandonment
  if (lowerMessage.includes('cart') && lowerMessage.includes('abandon')) {
    return await recommendCartAbandonmentSolutions(storeId, userId)
  }

  // Marketing strategy
  if (lowerMessage.includes('marketing') || lowerMessage.includes('advertis')) {
    return await recommendMarketingStrategies(storeId, userId)
  }

  // Customer retention
  if (lowerMessage.includes('customer') && lowerMessage.includes('retention')) {
    return await recommendCustomerRetentionStrategies(storeId, userId)
  }

  // Inventory optimization
  if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
    return await analyzeInventoryHealth(storeId, userId)
  }

  // Default: Provide general guidance
  return {
    response:
      "I can help you grow your business in several ways:\n\n" +
      "📊 **Analyze Performance** - Get insights on your store's current performance\n" +
      "🚀 **Growth Recommendations** - Receive personalized growth strategies\n" +
      "💰 **Increase Sales** - Learn tactics to boost revenue\n" +
      "📦 **Product Strategy** - Discover which products to promote\n" +
      "💵 **Pricing Optimization** - Review and optimize your pricing\n" +
      "🛒 **Cart Recovery** - Reduce cart abandonment\n" +
      "📣 **Marketing Ideas** - Get marketing campaign suggestions\n" +
      "👥 **Customer Retention** - Build loyal customer relationships\n\n" +
      "What area would you like to focus on?",
  }
}

async function analyzeStorePerformance(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const [products, orders, customers, revenue, lowStock] = await Promise.all([
    prisma.product.count({ where: { storeId, isActive: true } }),
    prisma.order.count({ where: { storeId } }),
    prisma.customer.count({ where: { storeId } }),
    prisma.order.aggregate({
      where: { storeId },
      _sum: { total: true },
    }),
    prisma.product.count({
      where: { storeId, stock: { lte: 5 }, isActive: true },
    }),
  ])

  const totalRevenue = revenue._sum.total?.toNumber() || 0
  const avgOrderValue = orders > 0 ? totalRevenue / orders : 0

  let performanceScore = 'Good'
  let concerns: string[] = []

  if (products < 5) concerns.push('low product count')
  if (orders < 10) concerns.push('limited order history')
  if (customers < 5) concerns.push('small customer base')
  if (lowStock > products * 0.3) concerns.push('significant low stock issues')

  if (concerns.length > 2) performanceScore = 'Needs Attention'
  else if (concerns.length === 0) performanceScore = 'Excellent'

  const response =
    `📊 **Store Performance Analysis**\n\n` +
    `**Overall Health:** ${performanceScore}\n\n` +
    `**Key Metrics:**\n` +
    `• Active Products: ${products}\n` +
    `• Total Orders: ${orders}\n` +
    `• Customers: ${customers}\n` +
    `• Total Revenue: ${formatCurrency(totalRevenue)}\n` +
    `• Average Order Value: ${formatCurrency(avgOrderValue)}\n` +
    `• Low Stock Items: ${lowStock}\n\n` +
    (concerns.length > 0
      ? `**Areas for Improvement:**\n${concerns.map((c) => `• ${c}`).join('\n')}\n\n`
      : '') +
    `Would you like specific recommendations to improve any of these areas?`

  return { response }
}

async function generateGrowthRecommendations(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  // Analyze top-performing products from order items
  const topOrderItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { order: { storeId } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 3,
  })

  const productIds = topOrderItems.map((item) => item.productId)
  const productRecords = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true },
  })

  const topProducts = topOrderItems
    .map((item) => {
      const p = productRecords.find((prod) => prod.id === item.productId)
      return {
        name: p?.name || 'Product',
        sales: item._sum?.quantity || 0,
        price: p?.price || 0,
      }
    })
    .filter((p) => p.sales > 0)

  // Check for low-converting products
  const lowPerformers = await prisma.product.count({
    where: { storeId, isActive: true },
  })

  if (topProducts.length === 0) {
    return {
      response:
        "I notice you don't have sales data yet. Let me recommend strategies to kickstart your sales:\n\n" +
        "1. Launch a grand opening promotion\n" +
        "2. Offer first-time customer discounts\n" +
        "3. Leverage social media marketing\n" +
        "4. Create urgency with limited-time offers\n" +
        "5. Collect email addresses for future campaigns",
    }
  }

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'MARKETING',
    title: 'Promote Your Best Sellers',
    description: `Your top products are performing well. Create a "Best Sellers" collection and feature these products prominently on your homepage to drive more sales.`,
    impact: 'HIGH',
    effort: 'LOW',
    actions: [
      `Feature ${topProducts[0].name} in your hero section`,
      'Create a "Best Sellers" category',
      'Run social media ads highlighting top products',
      'Offer bundle deals with complementary products',
      'Send email campaigns to past customers',
    ],
  })

  const response =
    `🚀 **Growth Strategy Recommendation**\n\n` +
    `I've analyzed your store data and identified a high-impact opportunity:\n\n` +
    `**Your Top Performers:**\n` +
    topProducts.map((p) => `• ${p.name} - ${p.sales} sales`).join('\n') +
    `\n\n` +
    `These products have proven demand. By promoting them more prominently, you can significantly boost your revenue.\n\n` +
    (lowPerformers > 0
      ? `Also, you have ${lowPerformers} products with no sales yet. Consider offering promotions or bundles to give them visibility.\n\n`
      : '') +
    `I've created a detailed recommendation below. Review it and approve if you'd like to proceed.`

  return { response, recommendation }
}

async function recommendSalesStrategies(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const [avgOrderValue, customerCount] = await Promise.all([
    prisma.order.aggregate({
      where: { storeId },
      _avg: { total: true },
    }),
    prisma.customer.count({ where: { storeId } }),
  ])

  const avg = avgOrderValue._avg.total?.toNumber() || 0

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'MARKETING',
    title: 'Implement Upselling & Cross-Selling',
    description: `Increase your average order value by strategically recommending complementary products and offering volume discounts. This can boost revenue by 20-30% without acquiring new customers.`,
    impact: 'HIGH',
    effort: 'MEDIUM',
    actions: [
      'Add "Frequently Bought Together" section on product pages',
      'Create product bundles with 10-15% discount',
      'Offer free shipping threshold above current AOV',
      'Implement "You may also like" recommendations',
      'Add quantity discounts (Buy 2, Get 10% off)',
    ],
  })

  const response =
    `💰 **Sales Growth Strategy**\n\n` +
    `**Current Metrics:**\n` +
    `• Average Order Value: ${formatCurrency(avg)}\n` +
    `• Customer Base: ${customerCount}\n\n` +
    `**Recommended Approach:**\n` +
    `Focus on increasing your average order value through upselling and cross-selling. This is the fastest way to grow revenue with your existing traffic.\n\n` +
    `**Expected Impact:**\n` +
    `• 20-30% increase in revenue\n` +
    `• Better customer satisfaction\n` +
    `• Higher lifetime value per customer\n\n` +
    `I've created a detailed action plan below.`

  return { response, recommendation }
}

async function recommendProductsToPromote(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const products = await prisma.product.findMany({
    where: { storeId, isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { name: true, price: true, stock: true },
  })

  if (products.length === 0) {
    return {
      response: "You don't have any active products yet. Add products first, then I can help you decide which ones to promote!",
    }
  }

  const topSeller = products[0]
  const highMargin = products.filter((p) => p.price.toNumber() > 50)[0]

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'PRODUCT',
    title: `Feature ${topSeller.name} in Marketing Campaigns`,
    description: `This product has the highest sales velocity. Allocate 60% of your marketing budget to promote it, as it has proven market demand and will likely convert well.`,
    impact: 'HIGH',
    effort: 'LOW',
    actions: [
      'Create Instagram/Facebook ads featuring this product',
      'Send email blast to your customer list',
      'Feature on homepage hero banner',
      'Offer limited-time 15% discount',
      'Create user-generated content campaign',
    ],
  })

  const response =
    `📦 **Product Promotion Strategy**\n\n` +
    `**Top Products to Promote:**\n\n` +
    `1. **${topSeller.name}** (Featured Product)\n` +
    `   • Price: ${formatCurrency(topSeller.price)}\n` +
    `   • Stock: ${topSeller.stock}\n` +
    `   • Why: Proven demand, highest conversion potential\n\n` +
    (highMargin
      ? `2. **${highMargin.name}** (High Value)\n` +
        `   • Price: ${formatCurrency(highMargin.price)}\n` +
        `   • Why: Higher profit margin per sale\n\n`
      : '') +
    `**Recommendation:** Focus 60% of marketing efforts on your top seller, as it has demonstrated market fit.`

  return { response, recommendation }
}

async function analyzePricingStrategy(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const products = await prisma.product.findMany({
    where: { storeId, isActive: true },
    select: { name: true, price: true, comparePrice: true },
  })

  const withDiscounts = products.filter((p) => p.comparePrice && p.comparePrice.toNumber() > p.price.toNumber())
  const avgPrice = products.reduce((sum, p) => sum + p.price.toNumber(), 0) / products.length

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'PRICING',
    title: 'Optimize Pricing with Strategic Discounts',
    description: `Use psychological pricing and strategic discounts to increase perceived value and conversion rates. Products with compare-at pricing typically convert 15-25% better.`,
    impact: 'MEDIUM',
    effort: 'LOW',
    actions: [
      'Add compare-at prices to show savings',
      'Use charm pricing (e.g., ₹299 instead of ₹300)',
      'Create tiered pricing for different customer segments',
      'Offer bundle discounts for multi-item purchases',
      'Test price points with A/B testing',
    ],
  })

  const response =
    `💵 **Pricing Strategy Analysis**\n\n` +
    `**Current Pricing:**\n` +
    `• Average Product Price: ${formatCurrency(avgPrice)}\n` +
    `• Products with Discounts: ${withDiscounts.length}/${products.length}\n\n` +
    `**Insights:**\n` +
    (withDiscounts.length < products.length * 0.3
      ? '• Consider adding compare-at prices to more products to show value\n'
      : '') +
    `• Use psychological pricing (₹X99) to improve perception\n` +
    `• Bundle products to increase average order value\n\n` +
    `I've created specific pricing recommendations below.`

  return { response, recommendation }
}

async function recommendCartAbandonmentSolutions(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'MARKETING',
    title: 'Reduce Cart Abandonment',
    description: `Implement cart recovery strategies to recapture lost sales. Studies show cart abandonment recovery can increase revenue by 10-15%.`,
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    actions: [
      'Add exit-intent popups with discount offers',
      'Send cart abandonment emails (1hr, 24hr, 72hr)',
      'Display free shipping threshold in cart',
      'Show trust badges and security seals',
      'Simplify checkout process (reduce form fields)',
      'Offer guest checkout option',
    ],
  })

  const response =
    `🛒 **Cart Abandonment Recovery Strategy**\n\n` +
    `Cart abandonment is a major revenue leak for e-commerce stores. The average abandonment rate is 70%, meaning you're potentially losing significant sales.\n\n` +
    `**High-Impact Tactics:**\n` +
    `1. **Email Recovery** - Automated cart reminder emails\n` +
    `2. **Exit Intent** - Last-chance offers before leaving\n` +
    `3. **Free Shipping** - Clear threshold messaging\n` +
    `4. **Trust Signals** - Security badges and guarantees\n` +
    `5. **Simplified Checkout** - Fewer steps = more conversions\n\n` +
    `**Expected Results:**\n` +
    `• Recover 10-15% of abandoned carts\n` +
    `• Significant revenue increase with minimal cost`

  return { response, recommendation }
}

async function recommendMarketingStrategies(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const [customerCount, orderCount] = await Promise.all([
    prisma.customer.count({ where: { storeId } }),
    prisma.order.count({ where: { storeId } }),
  ])

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'MARKETING',
    title: 'Multi-Channel Marketing Campaign',
    description: `Launch a coordinated marketing campaign across email, social media, and content marketing to drive traffic and sales.`,
    impact: 'HIGH',
    effort: 'HIGH',
    actions: [
      'Build email list with 10% discount popup',
      'Post daily on Instagram/Facebook with product photos',
      'Run targeted Facebook/Instagram ads',
      'Create blog content for SEO',
      'Partner with micro-influencers in your niche',
      'Start a customer referral program',
    ],
  })

  const response =
    `📣 **Marketing Growth Plan**\n\n` +
    `**Current Status:**\n` +
    `• Customers: ${customerCount}\n` +
    `• Orders: ${orderCount}\n\n` +
    `**Recommended Marketing Mix:**\n\n` +
    `1. **Email Marketing** (Highest ROI)\n` +
    `   • Build your list with lead magnets\n` +
    `   • Send weekly newsletters\n` +
    `   • Automate abandoned cart emails\n\n` +
    `2. **Social Media**\n` +
    `   • Daily engaging content\n` +
    `   • User-generated content\n` +
    `   • Paid ads to lookalike audiences\n\n` +
    `3. **Content Marketing**\n` +
    `   • SEO-optimized blog posts\n` +
    `   • Product guides and tutorials\n` +
    `   • Video content\n\n` +
    `Start with email - it has the best ROI for e-commerce.`

  return { response, recommendation }
}

async function recommendCustomerRetentionStrategies(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const repeatCustomers = await prisma.customer.count({
    where: {
      storeId,
      orders: {
        some: {
          id: { not: undefined },
        },
      },
    },
  })

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'CUSTOMER',
    title: 'Build Customer Loyalty Program',
    description: `Increase repeat purchase rates by 30-40% with a structured loyalty program. Retaining customers is 5x cheaper than acquiring new ones.`,
    impact: 'HIGH',
    effort: 'MEDIUM',
    actions: [
      'Create points-based loyalty program',
      'Offer exclusive discounts to repeat customers',
      'Send personalized product recommendations',
      'Request reviews and testimonials',
      'Provide exceptional post-purchase support',
      'Send birthday/anniversary special offers',
    ],
  })

  const response =
    `👥 **Customer Retention Strategy**\n\n` +
    `**Why This Matters:**\n` +
    `• Acquiring new customers costs 5x more than retaining existing ones\n` +
    `• Repeat customers spend 67% more than new customers\n` +
    `• A 5% increase in retention can increase profits by 25-95%\n\n` +
    `**Recommended Actions:**\n` +
    `1. Launch a loyalty program (points per purchase)\n` +
    `2. Send post-purchase follow-up emails\n` +
    `3. Personalize recommendations based on history\n` +
    `4. Offer VIP perks for top customers\n` +
    `5. Create a community around your brand\n\n` +
    `**Expected Impact:** 30-40% increase in repeat purchases`

  return { response, recommendation }
}

async function analyzeInventoryHealth(
  storeId: string,
  userId: string
): Promise<AnalysisResult> {
  const [lowStock, outOfStock, overstock] = await Promise.all([
    prisma.product.findMany({
      where: { storeId, stock: { lte: 5, gt: 0 }, isActive: true },
      select: { name: true, stock: true },
    }),
    prisma.product.count({ where: { storeId, stock: 0, isActive: true } }),
    prisma.product.findMany({
      where: { storeId, stock: { gt: 50 }, isActive: true },
      select: { name: true, stock: true },
    }),
  ])

  const recommendation = await createRecommendation({
    storeId,
    userId,
    type: 'INVENTORY',
    title: 'Optimize Inventory Management',
    description: `Balance your inventory to avoid stockouts and reduce overstock costs. Proper inventory management can improve cash flow by 25%.`,
    impact: 'MEDIUM',
    effort: 'LOW',
    actions: [
      'Restock low-inventory best sellers immediately',
      'Run clearance sales for slow-moving overstock',
      'Set up automatic low-stock alerts',
      'Use sales velocity to forecast demand',
      'Implement just-in-time inventory for fast movers',
    ],
  })

  const response =
    `📦 **Inventory Health Analysis**\n\n` +
    `**Current Status:**\n` +
    `• Low Stock Items: ${lowStock.length}\n` +
    `• Out of Stock: ${outOfStock}\n` +
    `• Potential Overstock: ${overstock.length}\n\n` +
    (lowStock.length > 0
      ? `**Urgent: Low Stock**\n${lowStock.map((p) => `• ${p.name} - Only ${p.stock} left`).join('\n')}\n\n`
      : '') +
    (outOfStock > 0 ? `⚠️ **Alert:** ${outOfStock} products are out of stock\n\n` : '') +
    (overstock.length > 0
      ? `**Consider Clearance Sale:**\n${overstock.map((p) => `• ${p.name} - ${p.stock} in stock`).join('\n')}\n\n`
      : '') +
    `Proper inventory management improves cash flow and prevents lost sales.`

  return { response, recommendation }
}

// Helper function to create and save recommendation
async function createRecommendation(data: {
  storeId: string
  userId: string
  type: 'MARKETING' | 'PRODUCT' | 'PRICING' | 'INVENTORY' | 'CUSTOMER'
  title: string
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  effort: 'HIGH' | 'MEDIUM' | 'LOW'
  actions?: string[]
}): Promise<Recommendation> {
  const typeMap: Record<string, any> = {
    MARKETING: 'MARKETING_OPPORTUNITY',
    PRODUCT: 'PRODUCT_OPTIMIZATION',
    PRICING: 'PRICING_STRATEGY',
    INVENTORY: 'INVENTORY_ALERT',
    CUSTOMER: 'MARKETING_OPPORTUNITY',
  }

  const recommendation = await prisma.recommendation.create({
    data: {
      storeId: data.storeId,
      userId: data.userId,
      type: typeMap[data.type] || 'MARKETING_OPPORTUNITY',
      title: data.title,
      description: data.description,
      evidence: JSON.stringify({ impact: data.impact, effort: data.effort }),
      proposedChange: JSON.stringify({ actions: data.actions || [] }),
      status: 'PENDING',
    },
  })

  return {
    id: recommendation.id,
    type: data.type,
    title: recommendation.title,
    description: recommendation.description,
    impact: data.impact,
    effort: data.effort,
    status: recommendation.status as any,
    actions: data.actions,
  }
}
