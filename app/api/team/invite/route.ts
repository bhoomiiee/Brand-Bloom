import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

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
        { error: 'Only owners can invite team members' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, name, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Validate role
    if (role !== 'OWNER' && role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Invalid role. Must be OWNER or STAFF' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let invitedUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // If user doesn't exist, create a new user account
    if (!invitedUser) {
      // Generate a temporary password (they should reset it on first login)
      const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!'
      const hashedPassword = await bcrypt.hash(tempPassword, 10)

      invitedUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name?.trim() || null,
          password: hashedPassword,
        },
      })

      // In a real app, send an email with the temp password or a reset link
      console.log(`New user created: ${normalizedEmail} with temp password: ${tempPassword}`)
    }

    // Check if user is already a member of this store
    const existingMembership = await prisma.membership.findFirst({
      where: {
        storeId: store.id,
        userId: invitedUser.id,
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'This user is already a member of your store' },
        { status: 400 }
      )
    }

    // Create the membership
    const membership = await prisma.membership.create({
      data: {
        storeId: store.id,
        userId: invitedUser.id,
        role: role,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json({
      message: 'Team member invited successfully',
      membership: {
        id: membership.id,
        role: membership.role,
        user: {
          id: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
        },
      },
    })
  } catch (error) {
    console.error('Invite team member error:', error)
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    )
  }
}
