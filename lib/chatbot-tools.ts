import { prisma } from './db'
import { formatCurrency } from './utils'

type QueryResult = {
  response: string
  data?: any
}

/**
 * Analyze user query and execute appropriate read-only tools
 */
export async function analyzeChatQuery(
  message: string,
  storeId: string
): Promise<QueryResult> {
  const lowerMessage = message.toLowerCase()

  // Top selling products
  if (
    lowerMessage.includes('top') &&
    (lowerMessage.includes('product') || lowerMessage.includes('selling'))
  ) {
    return await getTopSellingProducts(storeId)
  }

  // Low stock products
  if (
    (lowerMessage.includes('low') || lowerMessage.includes('running out')) &&
    lowerMessage.includes('stock')
  ) {
    return await getLowStockProducts(storeId)
  }

  // Out of stock products
  if (lowerMessage.includes('out of stock') || lowerMessage.includes('no stock')) {
    return await getOutOfStockProducts(storeId)
  }

  // Recent orders
  if (lowerMessage.includes('recent') && lowerMessage.includes('order')) {
    return await getRecentOrders(storeId)
  }

  // Orders today
  if (
    lowerMessage.includes('today') &&
    (lowerMessage.includes('order') || lowerMessage.includes('sale'))
  ) {
    return await getOrdersToday(storeId)
  }

  // Revenue
  if (
    lowerMessage.includes('revenue') ||
    lowerMessage.includes('sales') ||
    lowerMessage.includes('earnings') ||
    lowerMessage.includes('income')
  ) {
    if (lowerMessage.includes('today')) {
      return await getRevenueToday(storeId)
    } else if (lowerMessage.includes('month') || lowerMessage.includes('this month')) {
      return await getRevenueThisMonth(storeId)
    } else if (lowerMessage.includes('total') || lowerMessage.includes('all time')) {
      return await getTotalRevenue(storeId)
    } else {
      return await getTotalRevenue(storeId)
    }
  }

  // Customer count
  if (
    (lowerMessage.includes('how many') || lowerMessage.includes('number of')) &&
    lowerMessage.includes('customer')
  ) {
    return await getCustomerCount(storeId)
  }

  // Product count
  if (
    (lowerMessage.includes('how many') || lowerMessage.includes('number of')) &&
    lowerMessage.includes('product')
  ) {
    return await getProductCount(storeId)
  }

  // Order count
  if (
    (lowerMessage.includes('how many') || lowerMessage.includes('number of')) &&
    lowerMessage.includes('order')
  ) {
    return await getOrderCount(storeId)
  }

  // Store overview
  if (
    lowerMessage.includes('overview') ||
    lowerMessage.includes('summary') ||
    lowerMessage.includes('stats')
  ) {
    return await getStoreOverview(storeId)
  }

  // Customers list
  if (lowerMessage.includes('customer') && lowerMessage.includes('list')) {
    return await getRecentCustomers(storeId)
  }

  // Default response
  return {
    response:
      "I can help you with:\n\n" +
      "• Top selling products\n" +
      "• Low stock or out of stock products\n" +
      "• Recent orders and order counts\n" +
      "• Revenue (today, this month, or total)\n" +
      "• Customer and product counts\n" +
      "• Store overview and statistics\n\n" +
      "What would you like to know?",
  }
}

// Read-only tool functions

async function getTopSellingProducts(storeId: string): Promise<QueryResult> {
  const topOrderItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: { storeId },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  })

  if (topOrderItems.length === 0) {
    const products = await prisma.product.findMany({
      where: { storeId, isActive: true },
      take: 5,
      select: { id: true, name: true, price: true, stock: true },
    })

    if (products.length === 0) {
      return {
        response: "You don't have any products with sales data yet.",
      }
    }

    const productList = products
      .map((p, i) => `${i + 1}. ${p.name} (${formatCurrency(p.price)})`)
      .join('\n')

    return {
      response: `Here are your top products:\n\n${productList}`,
      data: { products },
    }
  }

  const productIds = topOrderItems.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  })

  const productList = topOrderItems
    .map((item, i) => {
      const p = products.find((prod) => prod.id === item.productId)
      return `${i + 1}. ${p?.name || 'Product'} - ${item._sum?.quantity || 0} sales (${formatCurrency(p?.price || 0)} each)`
    })
    .join('\n')

  return {
    response: `Here are your top 5 best-selling products:\n\n${productList}`,
    data: { products },
  }
}

async function getLowStockProducts(storeId: string): Promise<QueryResult> {
  const products = await prisma.product.findMany({
    where: {
      storeId,
      stock: { lte: 5, gt: 0 },
      isActive: true,
    },
    orderBy: { stock: 'asc' },
    select: {
      name: true,
      stock: true,
      sku: true,
    },
  })

  if (products.length === 0) {
    return {
      response: 'Great news! All your products are well-stocked.',
    }
  }

  const productList = products
    .map((p) => `• ${p.name} - Only ${p.stock} left (SKU: ${p.sku || 'N/A'})`)
    .join('\n')

  return {
    response: `You have ${products.length} product(s) running low on stock:\n\n${productList}`,
    data: { products },
  }
}

async function getOutOfStockProducts(storeId: string): Promise<QueryResult> {
  const products = await prisma.product.findMany({
    where: {
      storeId,
      stock: 0,
      isActive: true,
    },
    select: {
      name: true,
      sku: true,
    },
  })

  if (products.length === 0) {
    return {
      response: 'Good news! No products are currently out of stock.',
    }
  }

  const productList = products
    .map((p) => `• ${p.name} (SKU: ${p.sku || 'N/A'})`)
    .join('\n')

  return {
    response: `You have ${products.length} product(s) out of stock:\n\n${productList}\n\nConsider restocking these items soon.`,
    data: { products },
  }
}

async function getRecentOrders(storeId: string): Promise<QueryResult> {
  const orders = await prisma.order.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      orderNumber: true,
      total: true,
      status: true,
      customerName: true,
      createdAt: true,
    },
  })

  if (orders.length === 0) {
    return {
      response: "You don't have any orders yet.",
    }
  }

  const orderList = orders
    .map(
      (o) =>
        `• Order #${o.orderNumber} - ${formatCurrency(o.total)} - ${o.status} - ${o.customerName}`
    )
    .join('\n')

  return {
    response: `Here are your 5 most recent orders:\n\n${orderList}`,
    data: { orders },
  }
}

async function getOrdersToday(storeId: string): Promise<QueryResult> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: {
      storeId,
      createdAt: { gte: today },
    },
    select: {
      orderNumber: true,
      total: true,
      customerName: true,
    },
  })

  const totalRevenue = orders.reduce((sum, o) => sum + o.total.toNumber(), 0)

  if (orders.length === 0) {
    return {
      response: "You haven't received any orders today yet.",
    }
  }

  return {
    response: `Today you received ${orders.length} order(s) with total revenue of ${formatCurrency(totalRevenue)}.`,
    data: {
      stats: {
        orders_today: orders.length,
        revenue_today: formatCurrency(totalRevenue),
      },
    },
  }
}

async function getRevenueToday(storeId: string): Promise<QueryResult> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const result = await prisma.order.aggregate({
    where: {
      storeId,
      createdAt: { gte: today },
    },
    _sum: { total: true },
    _count: true,
  })

  const revenue = result._sum.total?.toNumber() || 0
  const orderCount = result._count

  return {
    response: `Today's revenue is ${formatCurrency(revenue)} from ${orderCount} order(s).`,
    data: {
      stats: {
        revenue: formatCurrency(revenue),
        orders: orderCount,
      },
    },
  }
}

async function getRevenueThisMonth(storeId: string): Promise<QueryResult> {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const result = await prisma.order.aggregate({
    where: {
      storeId,
      createdAt: { gte: firstDayOfMonth },
    },
    _sum: { total: true },
    _count: true,
  })

  const revenue = result._sum.total?.toNumber() || 0
  const orderCount = result._count

  return {
    response: `This month's revenue is ${formatCurrency(revenue)} from ${orderCount} order(s).`,
    data: {
      stats: {
        revenue: formatCurrency(revenue),
        orders: orderCount,
      },
    },
  }
}

async function getTotalRevenue(storeId: string): Promise<QueryResult> {
  const result = await prisma.order.aggregate({
    where: { storeId },
    _sum: { total: true },
    _count: true,
  })

  const revenue = result._sum.total?.toNumber() || 0
  const orderCount = result._count

  return {
    response: `Your total all-time revenue is ${formatCurrency(revenue)} from ${orderCount} order(s).`,
    data: {
      stats: {
        total_revenue: formatCurrency(revenue),
        total_orders: orderCount,
      },
    },
  }
}

async function getCustomerCount(storeId: string): Promise<QueryResult> {
  const count = await prisma.customer.count({
    where: { storeId },
  })

  return {
    response: `You have ${count} customer(s) in your store.`,
    data: {
      stats: {
        total_customers: count,
      },
    },
  }
}

async function getProductCount(storeId: string): Promise<QueryResult> {
  const [totalCount, activeCount] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.product.count({ where: { storeId, isActive: true } }),
  ])

  return {
    response: `You have ${totalCount} total product(s), with ${activeCount} currently active.`,
    data: {
      stats: {
        total_products: totalCount,
        active_products: activeCount,
      },
    },
  }
}

async function getOrderCount(storeId: string): Promise<QueryResult> {
  const count = await prisma.order.count({
    where: { storeId },
  })

  return {
    response: `You have received ${count} total order(s).`,
    data: {
      stats: {
        total_orders: count,
      },
    },
  }
}

async function getStoreOverview(storeId: string): Promise<QueryResult> {
  const [productCount, orderCount, customerCount, revenueData] = await Promise.all([
    prisma.product.count({ where: { storeId, isActive: true } }),
    prisma.order.count({ where: { storeId } }),
    prisma.customer.count({ where: { storeId } }),
    prisma.order.aggregate({
      where: { storeId },
      _sum: { total: true },
    }),
  ])

  const revenue = revenueData._sum.total?.toNumber() || 0

  return {
    response: `Here's your store overview:\n\n• Active Products: ${productCount}\n• Total Orders: ${orderCount}\n• Customers: ${customerCount}\n• Total Revenue: ${formatCurrency(revenue)}`,
    data: {
      stats: {
        active_products: productCount,
        total_orders: orderCount,
        customers: customerCount,
        revenue: formatCurrency(revenue),
      },
    },
  }
}

async function getRecentCustomers(storeId: string): Promise<QueryResult> {
  const customers = await prisma.customer.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      name: true,
      email: true,
      createdAt: true,
    },
  })

  if (customers.length === 0) {
    return {
      response: "You don't have any customers yet.",
    }
  }

  const customerList = customers
    .map((c) => `• ${c.name} (${c.email})`)
    .join('\n')

  return {
    response: `Here are your 5 most recent customers:\n\n${customerList}`,
    data: { customers },
  }
}
