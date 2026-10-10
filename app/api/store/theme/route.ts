import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { THEMES } from '@/lib/themes'

export async function PATCH(request: Request) {
  try {
    const store = await getCurrentStore()

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { themeId } = await request.json()

    // Validate theme exists
    if (!THEMES[themeId]) {
      return NextResponse.json(
        { error: 'Invalid theme ID' },
        { status: 400 }
      )
    }

    // Update store theme
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: { theme: themeId },
    })

    revalidatePath(`/store/${store.slug}`)
    revalidatePath(`/store/${store.slug}/products`)
    revalidatePath('/dashboard/appearance')

    return NextResponse.json({
      success: true,
      theme: themeId,
      store: updatedStore,
    })
  } catch (error) {
    console.error('Failed to update theme:', error)
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const store = await getCurrentStore()

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      theme: store.theme || 'modern',
      availableThemes: Object.keys(THEMES),
    })
  } catch (error) {
    console.error('Failed to get theme:', error)
    return NextResponse.json(
      { error: 'Failed to get theme' },
      { status: 500 }
    )
  }
}
