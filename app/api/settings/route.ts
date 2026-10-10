import { NextResponse } from 'next/server'

let platformSettings = {
  key: 'platform',
  general: {
    platformName: 'BrandBloom',
    supportEmail: 'support@brandbloom.store',
    primaryColor: '#632D40',
    dustyRose: '#BD7C91',
    softBlush: '#F1D9DF',
    defaultCurrency: 'USD',
  },
  aiEngine: {
    modelVersion: 'BloomPilot-Optima-v2',
    minConfidenceThreshold: 80,
    autoApproveLowEffort: false,
    scanIntervalHours: 12,
  },
  upgrades: {
    requireMerchantApproval: true,
    autoRollbackOnDrop: true,
    telemetryPeriodDays: 7,
  },
  notifications: {
    emailAlertsEnabled: true,
    slackWebhook: '',
    alertOnRevenueDropPercent: 10,
  },
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: platformSettings,
  })
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    platformSettings = {
      ...platformSettings,
      ...body,
    }
    return NextResponse.json({
      success: true,
      data: platformSettings,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
