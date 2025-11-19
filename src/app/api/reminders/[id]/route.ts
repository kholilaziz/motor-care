import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { isCompleted } = data

    // Cek apakah reminder ada
    const existingReminder = await db.reminder.findUnique({
      where: { id: params.id }
    })

    if (!existingReminder) {
      return NextResponse.json(
        { error: 'Reminder tidak ditemukan' },
        { status: 404 }
      )
    }

    const reminder = await db.reminder.update({
      where: { id: params.id },
      data: {
        isCompleted: isCompleted !== undefined ? isCompleted : false
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
      message: 'Reminder berhasil diperbarui',
      reminder
    })

  } catch (error) {
    console.error('Update reminder error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah reminder ada
    const existingReminder = await db.reminder.findUnique({
      where: { id: params.id }
    })

    if (!existingReminder) {
      return NextResponse.json(
        { error: 'Reminder tidak ditemukan' },
        { status: 404 }
      )
    }

    await db.reminder.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Reminder berhasil dihapus'
    })

  } catch (error) {
    console.error('Delete reminder error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}