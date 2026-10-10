import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({
    success: true,
    data: {
      id,
      title: 'Upgrade Details',
      implementationStatus: 'Completed',
      ownerApprovalStatus: 'Approved',
    },
  })
}
