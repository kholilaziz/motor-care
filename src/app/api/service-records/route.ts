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

    const serviceRecords = await db.serviceRecord.findMany({
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
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(serviceRecords)

  } catch (error) {
    console.error('Get service records error:', error)
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
      date,
      km,
      actions,
      spareparts,
      notes,
      cost,
      motorcycleId,
      userId
    } = data

    // Validasi required fields
    if (!date || !km || !actions || !motorcycleId || !userId) {
      return NextResponse.json(
        { error: 'Field tanggal, KM, tindakan, motor ID, dan user ID wajib diisi' },
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

    const serviceRecord = await db.serviceRecord.create({
      data: {
        date: new Date(date),
        km: parseInt(km),
        actions: JSON.stringify(actions),
        spareparts: spareparts ? JSON.stringify(spareparts) : null,
        notes: notes || null,
        cost: cost ? parseInt(cost) : null,
        motorcycleId,
        userId
      },
      include: {
        motorcycle: {
          select: {
            brand: true,
            model: true,
            plateNumber: true
          }
        }
      }
    })

    // Update current KM motorcycle jika KM servis lebih besar
    if (km > motorcycle.currentKm) {
      await db.motorcycle.update({
        where: { id: motorcycleId },
        data: { currentKm: parseInt(km) }
      })
    }

    // Generate reminder berikutnya (logika sederhana)
    await generateNextServiceReminder(motorcycleId, parseInt(km), motorcycle.usageType)

    return NextResponse.json({
      message: 'Riwayat servis berhasil ditambahkan',
      serviceRecord
    })

  } catch (error) {
    console.error('Create service record error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

async function generateNextServiceReminder(motorcycleId: string, currentKm: number, usageType: string) {
  try {
    // Hapus reminder lama yang belum selesai
    await db.reminder.deleteMany({
      where: {
        motorcycleId,
        type: 'km_based',
        isCompleted: false
      }
    })

    // Tentukan interval servis berdasarkan tipe penggunaan
    let intervalKm = 5000 // default
    
    switch (usageType) {
      case 'harian':
        intervalKm = 3000
        break
      case 'komuter':
        intervalKm = 4000
        break
      case 'touring':
        intervalKm = 6000
        break
      case 'olahraga':
        intervalKm = 2000
        break
      case 'jarang':
        intervalKm = 8000
        break
    }

    const nextServiceKm = currentKm + intervalKm

    // Buat reminder baru
    await db.reminder.create({
      data: {
        type: 'km_based',
        dueKm: nextServiceKm,
        description: `Servis berkala ${nextServiceKm.toLocaleString()} KM`,
        motorcycleId
      }
    })

  } catch (error) {
    console.error('Generate reminder error:', error)
  }
}