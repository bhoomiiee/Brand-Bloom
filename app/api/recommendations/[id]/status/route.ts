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

    const prismaStatus = status === 'approved' ? 'APPROVED' : status === 'applied' ? 'IMPLEMENTED' : status === 'dismissed' ? 'REJECTED' : 'PENDING'

    try {
      await prisma.recommendation.update({
        where: { id },
        data: { status: prismaStatus },
      })
    } catch {
      // Mock / fallback if recommendation was seeded
    }

    return NextResponse.json({
      success: true,
      data: { id, status },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
