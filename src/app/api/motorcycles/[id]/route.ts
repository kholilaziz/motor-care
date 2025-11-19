import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const motorcycle = await db.motorcycle.findUnique({
      where: { id: params.id },
      include: {
        serviceRecords: {
          orderBy: { date: 'desc' },
          take: 5
        },
        reminders: {
          where: { isCompleted: false },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!motorcycle) {
      return NextResponse.json(
        { error: 'Motor tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(motorcycle)

  } catch (error) {
    console.error('Get motorcycle error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const {
      brand,
      model,
      variant,
      plateNumber,
      year,
      stnkExpiry,
      usageType,
      initialKm,
      currentKm
    } = data

    // Cek apakah motor ada
    const existingMotorcycle = await db.motorcycle.findUnique({
      where: { id: params.id }
    })

    if (!existingMotorcycle) {
      return NextResponse.json(
        { error: 'Motor tidak ditemukan' },
        { status: 404 }
      )
    }

    // Cek apakah plat nomor sudah ada (jika diubah)
    if (plateNumber !== existingMotorcycle.plateNumber) {
      const duplicatePlate = await db.motorcycle.findUnique({
        where: { plateNumber }
      })

      if (duplicatePlate) {
        return NextResponse.json(
          { error: 'Nomor plat sudah terdaftar' },
          { status: 409 }
        )
      }
    }

    const motorcycle = await db.motorcycle.update({
      where: { id: params.id },
      data: {
        brand,
        model,
        variant: variant || null,
        plateNumber,
        year,
        stnkExpiry: new Date(stnkExpiry),
        usageType,
        initialKm,
        currentKm: currentKm || initialKm
      }
    })

    return NextResponse.json({
      message: 'Data motor berhasil diperbarui',
      motorcycle
    })

  } catch (error) {
    console.error('Update motorcycle error:', error)
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
    // Cek apakah motor ada
    const existingMotorcycle = await db.motorcycle.findUnique({
      where: { id: params.id }
    })

    if (!existingMotorcycle) {
      return NextResponse.json(
        { error: 'Motor tidak ditemukan' },
        { status: 404 }
      )
    }

    await db.motorcycle.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Motor berhasil dihapus'
    })

  } catch (error) {
    console.error('Delete motorcycle error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}