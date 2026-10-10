import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// In-memory state storage for real-time dynamic upgrades across sessions
let platformUpgrades: any[] = []

function initializeUpgrades(storeName: string, storeId: string) {
  if (platformUpgrades.length === 0) {
    platformUpgrades = [
      {
        id: 'upg-001',
        storeId,
        storeName,
        recommendationId: 'rec-001',
        title: 'Option 4 Botanical Burgundy Palette & High-Contrast CTA Upgrade',
        description: 'Upgrade the storefront with the Option 4 rich burgundy palette, warm off-white background, and high-conversion mobile sticky buttons.',
        category: 'UI/UX Redesign',
        ownerApprovalStatus: 'Approved',
        implementationStatus: 'Completed',
        ownerNotes: 'Approved for modern seasonal aesthetic.',
        proposedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        decidedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        appliedAt: new Date(Date.now() - 86400000).toISOString(),
        rollbackAvailable: true,
        previewData: {
          palette: 'Burgundy & Soft Blush',
          version: 'v2.4.0',
          components: ['StickyBuyBar', 'BotanicalDecorations', 'CustomerAuthModal'],
        },
        auditLogs: [
          { timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), message: 'AI generated upgrade proposal from store performance audit.' },
          { timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), message: 'Store owner approved upgrade via merchant dashboard.' },
          { timestamp: new Date(Date.now() - 86400000).toISOString(), message: 'Automated deployment succeeded. Live on production storefront.' },
        ],
      },
      {
        id: 'upg-002',
        storeId,
        storeName,
        recommendationId: 'rec-002',
        title: 'Customer Self-Service Order Tracking & Login Modal',
        description: 'Introduce customer signin/signup authentication modal to track order history and repeat buyer profiles.',
        category: 'Customer Retention',
        ownerApprovalStatus: 'Approved',
        implementationStatus: 'Completed',
        ownerNotes: 'Essential for repeat purchasers.',
        proposedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        decidedAt: new Date(Date.now() - 86400000).toISOString(),
        appliedAt: new Date().toISOString(),
        rollbackAvailable: true,
        previewData: {
          feature: 'CustomerAuthModal',
          version: 'v1.2.0',
        },
        auditLogs: [
          { timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), message: 'Proposal drafted for customer authentication modal.' },
          { timestamp: new Date().toISOString(), message: 'Verified active on Demo Fashion Store.' },
        ],
      },
      {
        id: 'upg-003',
        storeId,
        storeName,
        recommendationId: 'rec-003',
        title: 'AI Smart Bundle Cross-Sell Engine',
        description: 'Dynamically bundle accessories and jewelry with autumn dresses on product detail pages for 15% discount.',
        category: 'Revenue Optimization',
        ownerApprovalStatus: 'Pending Approval',
        implementationStatus: 'Pending Approval',
        ownerNotes: null,
        proposedAt: new Date().toISOString(),
        decidedAt: null,
        appliedAt: null,
        rollbackAvailable: false,
        previewData: {
          algorithm: 'BloomPilot-Bundle-v1',
          estimatedLift: '+$1,450/month',
        },
        auditLogs: [
          { timestamp: new Date().toISOString(), message: 'BloomPilot AI proposed cross-sell bundle algorithm.' },
        ],
      },
    ]
  }
}

export async function GET(req: Request) {
  try {
    const demoStore = await prisma.store.findFirst({ where: { slug: 'demo-fashion-store' } })
    const storeName = demoStore?.name || 'Demo Fashion Store'
    const storeId = demoStore?.id || 'cmv1dc76l0002inwbyjzvdxhd'

    initializeUpgrades(storeName, storeId)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('implementationStatus')

    let data = [...platformUpgrades]
    if (status && status !== 'all') {
      data = data.filter(u => u.implementationStatus.toLowerCase() === status.toLowerCase())
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
