import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const motorcycleId = searchParams.get('motorcycleId')
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    const whereClause: any = { userId }
    if (motorcycleId) {
      whereClause.motorcycleId = motorcycleId
    }

    const complaints = await db.complaint.findMany({
      where: whereClause,
      include: {
        motorcycle: {
          select: {
            brand: true,
            model: true,
            plateNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(complaints)

  } catch (error) {
    console.error('Get complaints error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}