import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const motorcycleId = searchParams.get('motorcycleId')
    const userId = searchParams.get('userId')
    const activeOnly = searchParams.get('activeOnly') === 'true'

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
    if (activeOnly) {
      whereClause.isCompleted = false
    }

    const reminders = await db.reminder.findMany({
      where: whereClause,
      include: {
        motorcycle: {
          select: {
            brand: true,
            model: true,
            plateNumber: true,
            currentKm: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(reminders)

  } catch (error) {
    console.error('Get reminders error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      type,
      dueKm,
      dueDate,
      description,
      motorcycleId,
      userId
    } = data

    // Validasi required fields
    if (!type || !description || !motorcycleId || !userId) {
      return NextResponse.json(
        { error: 'Type, deskripsi, motor ID, dan user ID wajib diisi' },
        { status: 400 }
      )
    }

    // Validasi type-specific fields
    if (type === 'km_based' && !dueKm) {
      return NextResponse.json(
        { error: 'Due KM wajib diisi untuk reminder berdasarkan KM' },
        { status: 400 }
      )
    }

    if (type === 'time_based' && !dueDate) {
      return NextResponse.json(
        { error: 'Due date wajib diisi untuk reminder berdasarkan waktu' },
        { status: 400 }
      )
    }

    // Cek apakah motor ada dan milik user
    const motorcycle = await db.motorcycle.findFirst({
      where: {
        id: motorcycleId,
        userId: userId
      }
    })

    if (!motorcycle) {
      return NextResponse.json(
        { error: 'Motor tidak ditemukan atau bukan milik Anda' },
        { status: 404 }
      )
    }

    const reminder = await db.reminder.create({
      data: {
        type,
        dueKm: dueKm ? parseInt(dueKm) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        description,
        motorcycleId
      },
      include: {
        motorcycle: {
          select: {
            brand: true,
            model: true,
            plateNumber: true,
            currentKm: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Reminder berhasil ditambahkan',
      reminder
    })

  } catch (error) {
    console.error('Create reminder error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}