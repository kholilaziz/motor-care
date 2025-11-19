import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex')
}

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // 1. Create Test Users
    console.log('👤 Creating test users...')
    
    const testUsers = [
      {
        email: 'admin@motorcare.com',
        password: hashPassword('Admin1234%'),
        name: 'Admin MotorCare'
      },
      {
        email: 'user@test.com',
        password: hashPassword('User1234%'),
        name: 'Test User'
      },
      {
        email: 'john.doe@example.com',
        password: hashPassword('John1234%'),
        name: 'John Doe'
      },
      {
        email: 'jane.smith@example.com',
        password: hashPassword('Jane1234%'),
        name: 'Jane Smith'
      }
    ]

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        await prisma.user.create({
          data: userData
        })
        console.log(`✅ Created user: ${userData.email}`)
      } else {
        console.log(`⚠️ User already exists: ${userData.email}`)
      }
    }

    // 2. Get created users for relationships
    const users = await prisma.user.findMany()
    const adminUser = users.find(u => u.email === 'admin@motorcare.com')
    const testUser = users.find(u => u.email === 'user@test.com')
    const johnUser = users.find(u => u.email === 'john.doe@example.com')
    const janeUser = users.find(u => u.email === 'jane.smith@example.com')

    // 3. Create Test Motorcycles
    console.log('🏍 Creating test motorcycles...')
    
    const testMotorcycles = [
      {
        brand: 'Honda',
        model: 'CBR150R',
        variant: 'Repsol',
        plateNumber: 'B 1234 ABC',
        year: 2022,
        stnkExpiry: new Date('2025-12-31'),
        usageType: 'harian',
        initialKm: 1000,
        currentKm: 15000,
        userId: adminUser!.id
      },
      {
        brand: 'Yamaha',
        model: 'NMAX',
        variant: 'ABS',
        plateNumber: 'B 5678 DEF',
        year: 2023,
        stnkExpiry: new Date('2026-06-30'),
        usageType: 'komuter',
        initialKm: 0,
        currentKm: 8500,
        userId: testUser!.id
      },
      {
        brand: 'Suzuki',
        model: 'GSX-R150',
        variant: null,
        plateNumber: 'B 9012 GHI',
        year: 2021,
        stnkExpiry: new Date('2025-08-15'),
        usageType: 'olahraga',
        initialKm: 500,
        currentKm: 12000,
        userId: johnUser!.id
      },
      {
        brand: 'Kawasaki',
        model: 'Ninja 250',
        variant: 'SE',
        plateNumber: 'B 3456 JKL',
        year: 2023,
        stnkExpiry: new Date('2026-03-20'),
        usageType: 'touring',
        initialKm: 2000,
        currentKm: 7500,
        userId: janeUser!.id
      }
    ]

    for (const motorData of testMotorcycles) {
      const existingMotor = await prisma.motorcycle.findUnique({
        where: { plateNumber: motorData.plateNumber }
      })

      if (!existingMotor) {
        await prisma.motorcycle.create({
          data: motorData
        })
        console.log(`✅ Created motorcycle: ${motorData.brand} ${motorData.model}`)
      } else {
        console.log(`⚠️ Motorcycle already exists: ${motorData.plateNumber}`)
      }
    }

    // 4. Get created motorcycles for service records
    const motorcycles = await prisma.motorcycle.findMany()
    const hondaMotor = motorcycles.find(m => m.plateNumber === 'B 1234 ABC')
    const yamahaMotor = motorcycles.find(m => m.plateNumber === 'B 5678 DEF')
    const suzukiMotor = motorcycles.find(m => m.plateNumber === 'B 9012 GHI')
    const kawasakiMotor = motorcycles.find(m => m.plateNumber === 'B 3456 JKL')

    // 5. Create Service Records
    console.log('🔧 Creating service records...')
    
    const serviceRecords = [
      {
        date: new Date('2024-01-15'),
        km: 1500,
        actions: JSON.stringify(['Ganti oli mesin', 'Ganti filter oli', 'Cek rem']),
        spareparts: JSON.stringify(['Oli Yamalube 10W-40', 'Filter oli Honda']),
        notes: 'Servis rutin pertama setelah beli motor',
        cost: 250000,
        motorcycleId: hondaMotor!.id,
        userId: adminUser!.id
      },
      {
        date: new Date('2024-03-20'),
        km: 3500,
        actions: JSON.stringify(['Ganti oli transmisi', 'Cek rantai', 'Setel kopling']),
        spareparts: JSON.stringify(['Oli transmisi', 'Rantai RK', 'Kampas kopling']),
        notes: 'Servis berkala 3000km',
        cost: 180000,
        motorcycleId: hondaMotor!.id,
        userId: adminUser!.id
      },
      {
        date: new Date('2024-02-10'),
        km: 8000,
        actions: JSON.stringify(['Ganti oli mesin', 'Ceki ban']),
        spareparts: JSON.stringify(['Oli Shell 10W-40']),
        notes: 'Servis rutin bulanan',
        cost: 150000,
        motorcycleId: yamahaMotor!.id,
        userId: testUser!.id
      },
      {
        date: new Date('2024-04-05'),
        km: 11000,
        actions: JSON.stringify(['Ganti kampas ganda', 'Ganti oli gardan', 'Caki sokbreker']),
        spareparts: JSON.stringify(['Kampas ganda Bando', 'Oli gardan']),
        notes: 'Servis besar 10000km',
        cost: 450000,
        motorcycleId: suzukiMotor!.id,
        userId: johnUser!.id
      }
    ]

    for (const serviceData of serviceRecords) {
      await prisma.serviceRecord.create({
        data: serviceData
      })
      console.log(`✅ Created service record: ${serviceData.km}km`)
    }

    // 6. Create Complaints with AI Analysis
    console.log('🔍 Creating complaints...')
    
    const complaints = [
      {
        description: 'Motor sulit distarter saat pagi hari, terdengar suara "klek-kek" dari bagian mesin',
        symptoms: JSON.stringify(['Motor sulit distarter', 'Suara mesin tidak normal', 'Power kurang']),
        diagnosis: 'Kemungkinan besar pada aki sudah lemah atau sistem pengapian yang bermasalah. Perlu pengecekan aki dan busi.',
        recommendations: JSON.stringify([
          { action: 'Cek tegangan aki', priority: 'tinggi', estimated_cost: 'Rp 50.000 - 150.000' },
          { action: 'Bersihkan atau ganti busi', priority: 'tinggi', estimated_cost: 'Rp 20.000 - 50.000' },
          { action: 'Setel karburator/injeksi', priority: 'sedang', estimated_cost: 'Rp 100.000 - 200.000' }
        ]),
        motorcycleId: hondaMotor!.id,
        userId: adminUser!.id
      },
      {
        description: 'Motor getar saat melewati jalan tidak rata, terasa ada getaran di stang',
        symptoms: JSON.stringify(['Getaran di stang', 'Suara gemeretak', 'Stabilitas berkurang']),
        diagnosis: 'Kemungkinan bearing roda depan sudah aus atau veleng bengkok. Perlu pengecekan komponen kemudi.',
        recommendations: JSON.stringify([
          { action: 'Cek bearing roda depan', priority: 'tinggi', estimated_cost: 'Rp 150.000 - 300.000' },
          { action: 'Periksa veleng dan rim', priority: 'sedang', estimated_cost: 'Rp 50.000 - 100.000' },
          { action: 'Balancing roda', priority: 'sedang', estimated_cost: 'Rp 30.000 - 60.000' }
        ]),
        motorcycleId: kawasakiMotor!.id,
        userId: janeUser!.id
      }
    ]

    for (const complaintData of complaints) {
      await prisma.complaint.create({
        data: complaintData
      })
      console.log(`✅ Created complaint: ${complaintData.description.substring(0, 30)}...`)
    }

    // 7. Create Reminders
    console.log('⏰ Creating reminders...')
    
    const reminders = [
      {
        type: 'km_based',
        dueKm: 18000,
        description: 'Servis berkala 18.000 KM',
        motorcycleId: hondaMotor!.id
      },
      {
        type: 'km_based',
        dueKm: 12000,
        description: 'Servis berkala 12.000 KM',
        motorcycleId: yamahaMotor!.id
      },
      {
        type: 'time_based',
        dueDate: new Date('2024-12-31'),
        description: 'Perpanjang STNK',
        motorcycleId: suzukiMotor!.id
      },
      {
        type: 'km_based',
        dueKm: 10000,
        description: 'Servis berkala 10.000 KM',
        motorcycleId: kawasakiMotor!.id
      },
      {
        type: 'condition_based',
        description: 'Cek dan ganti oli rantai',
        motorcycleId: hondaMotor!.id
      }
    ]

    for (const reminderData of reminders) {
      await prisma.reminder.create({
        data: reminderData
      })
      console.log(`✅ Created reminder: ${reminderData.description}`)
    }

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   👤 Users: ${testUsers.length}`)
    console.log(`   🏍 Motorcycles: ${testMotorcycles.length}`)
    console.log(`   🔧 Service Records: ${serviceRecords.length}`)
    console.log(`   🔍 Complaints: ${complaints.length}`)
    console.log(`   ⏰ Reminders: ${reminders.length}`)
    
    console.log('\n🔑 Test Login Credentials:')
    console.log('   Email: admin@motorcare.com | Password: Admin1234%')
    console.log('   Email: user@test.com | Password: User1234%')
    console.log('   Email: john.doe@example.com | Password: John1234%')
    console.log('   Email: jane.smith@example.com | Password: Jane1234%')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })