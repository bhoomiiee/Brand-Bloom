import { NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(request: Request) {
  try {
    const store = await getCurrentStore()

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Update store settings
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        name: data.name,
        businessType: data.businessType || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        country: data.country || null,
      },
    })

    return NextResponse.json({
      success: true,
      store: updatedStore,
    })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
