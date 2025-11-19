import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Ambil userId dari query parameter atau dari auth middleware
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    const motorcycles = await db.motorcycle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(motorcycles)

  } catch (error) {
    console.error('Get motorcycles error:', error)
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
      brand,
      model,
      variant,
      plateNumber,
      year,
      stnkExpiry,
      usageType,
      initialKm,
      currentKm,
      userId
    } = data

    // Validasi required fields
    if (!brand || !model || !plateNumber || !year || !stnkExpiry || !usageType || !initialKm || !userId) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi kecuali variant' },
        { status: 400 }
      )
    }

    // Cek apakah plat nomor sudah ada
    const existingMotorcycle = await db.motorcycle.findUnique({
      where: { plateNumber }
    })

    if (existingMotorcycle) {
      return NextResponse.json(
        { error: 'Nomor plat sudah terdaftar' },
        { status: 409 }
      )
    }

    const motorcycle = await db.motorcycle.create({
      data: {
        brand,
        model,
        variant: variant || null,
        plateNumber,
        year,
        stnkExpiry: new Date(stnkExpiry),
        usageType,
        initialKm,
        currentKm: currentKm || initialKm,
        userId
      }
    })

    return NextResponse.json({
      message: 'Motor berhasil ditambahkan',
      motorcycle
    })

  } catch (error) {
    console.error('Create motorcycle error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}