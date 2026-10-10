import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status } = body

    const prismaStatus = status === 'suspended' ? 'SUSPENDED' : status === 'inactive' ? 'ARCHIVED' : 'ACTIVE'

    const updated = await prisma.store.update({
      where: { id },
      data: { status: prismaStatus },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        status: status,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
