import { NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const store = await getCurrentStore()

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Update store branding
    await prisma.store.update({
      where: { id: store.id },
      data: {
        logo: data.logo || null,
        description: data.description || null,
      },
    })

    // Update site content
    await prisma.siteContent.update({
      where: { id: data.siteContentId },
      data: {
        heroTitle: data.heroTitle || null,
        heroSubtitle: data.heroSubtitle || null,
        heroCta: data.heroCta || null,
        heroImage: data.heroImage || null,
        banner1Title: data.banner1Title || null,
        banner1Image: data.banner1Image || null,
        banner2Title: data.banner2Title || null,
        banner2Image: data.banner2Image || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
    })
  } catch (error) {
    console.error('Failed to update content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
