import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      total: 3,
      pending: 1,
      approved: 2,
      completed: 2,
    },
  })
}
