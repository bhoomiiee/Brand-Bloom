import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const [store, user] = await Promise.all([
      getCurrentStore(),
      getCurrentUser(),
    ])

    if (!store || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is an owner
    const currentMembership = await prisma.membership.findFirst({
      where: {
        storeId: store.id,
        userId: user.id,
      },
    })

    if (currentMembership?.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Only owners can remove team members' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { membershipId } = body

    if (!membershipId) {
      return NextResponse.json(
        { error: 'Membership ID is required' },
        { status: 400 }
      )
    }

    // Get the membership to be removed
    const membershipToRemove = await prisma.membership.findUnique({
      where: { id: membershipId },
    })

    if (!membershipToRemove) {
      return NextResponse.json(
        { error: 'Membership not found' },
        { status: 404 }
      )
    }

    // Verify it belongs to the current store
    if (membershipToRemove.storeId !== store.id) {
      return NextResponse.json(
        { error: 'Membership does not belong to your store' },
        { status: 403 }
      )
    }

    // Prevent removing yourself
    if (membershipToRemove.userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot remove yourself from the team' },
        { status: 400 }
      )
    }

    // Prevent removing other owners (only they can leave voluntarily)
    if (membershipToRemove.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Cannot remove other owners. They must leave voluntarily.' },
        { status: 400 }
      )
    }

    // Check if this is the last member
    const memberCount = await prisma.membership.count({
      where: { storeId: store.id },
    })

    if (memberCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last member of the store' },
        { status: 400 }
      )
    }

    // Delete the membership
    await prisma.membership.delete({
      where: { id: membershipId },
    })

    return NextResponse.json({
      message: 'Team member removed successfully',
    })
  } catch (error) {
    console.error('Remove team member error:', error)
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    )
  }
}
