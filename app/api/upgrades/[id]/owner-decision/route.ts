import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { decision, notes } = body

    return NextResponse.json({
      success: true,
      data: {
        id,
        ownerApprovalStatus: decision,
        implementationStatus: decision === 'Approved' ? 'Ready to Deploy' : 'Rejected',
        ownerNotes: notes,
        decidedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
