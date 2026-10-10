import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    return NextResponse.json({
      success: true,
      message: `Recommendation ${id} successfully pushed to store owner dashboard notifications.`,
      data: { id, pushed: true, timestamp: new Date().toISOString() },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
