# 🚨 Supabase Connection Troubleshooting

## 🔍 Current Issue

Error: `FATAL: Tenant or user not found`

Ini menandakan connection string ke Supabase tidak benar.

## 🔧 Possible Solutions

### Solution 1: Use Pooling Connection

Coba format ini di `.env`:

```env
DATABASE_URL="postgresql://postgres.apnbmxwbhtdspixnkhan:Admin1234%@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

### Solution 2: Direct Connection

```env
DATABASE_URL="postgresql://postgres:Admin1234%@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### Solution 3: Use Session Mode

```env
DATABASE_URL="postgresql://postgres:Admin1234%@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?connect_timeout=20"
```

### Solution 4: Manual Connection String

1. Buka Supabase Dashboard
2. Settings → Database → Connection string
3. Copy connection string LENGKAP
4. Ganti password dengan "Admin1234%"
5. Paste ke .env

Format yang harus dicopy:
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

## 🧪 Testing Commands

```bash
# Test 1: Direct connection
psql "postgresql://postgres:Admin1234%@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Test 2: Prisma connection
npx prisma db pull

# Test 3: Generate client
npx prisma generate

# Test 4: Push schema
npx prisma db push
```

## 📊 Alternative: Manual Seeding

Jika koneksi gagal, jalankan seeding manual di Supabase SQL Editor:

```sql
-- Test Users
INSERT INTO users (id, email, name, password, created_at, updated_at) 
VALUES 
('test-user-1', 'admin@motorcare.com', 'Admin MotorCare', '5e884898da28047151d0e56f8dc6292773603d', NOW(), NOW()),
('test-user-2', 'user@test.com', 'Test User', '6b51d4b0b7a4b4c1e5e2a3e4b7c5e5b7e4b7e4b7e4b7e', NOW(), NOW()),
('test-user-3', 'john.doe@example.com', 'John Doe', '8d969eef6ecad3c29a3a629280e686cf0c7f7', NOW(), NOW()),
('test-user-4', 'jane.smith@example.com', 'Jane Smith', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', NOW(), NOW());

-- Test Motorcycles
INSERT INTO motorcycles (id, brand, model, variant, plate_number, year, stnk_expiry, usage_type, initial_km, current_km, user_id, created_at, updated_at)
VALUES
('motor-1', 'Honda', 'CBR150R', 'Repsol', 'B 1234 ABC', 2022, '2025-12-31', 'harian', 1000, 15000, 'test-user-1', NOW(), NOW()),
('motor-2', 'Yamaha', 'NMAX', 'ABS', 'B 5678 DEF', 2023, '2026-06-30', 'komuter', 0, 8500, 'test-user-2', NOW(), NOW()),
('motor-3', 'Suzuki', 'GSX-R150', NULL, 'B 9012 GHI', 2021, '2025-08-15', 'olahraga', 500, 12000, 'test-user-3', NOW(), NOW()),
('motor-4', 'Kawasaki', 'Ninja 250', 'SE', 'B 3456 JKL', 2023, '2026-03-20', 'touring', 2000, 7500, 'test-user-4', NOW(), NOW());

-- Test Service Records
INSERT INTO service_records (id, date, km, actions, spareparts, notes, cost, motorcycle_id, user_id, created_at, updated_at)
VALUES
('service-1', '2024-01-15', 1500, '["Ganti oli mesin", "Ganti filter oli", "Cek rem"]', '["Oli Yamalube 10W-40", "Filter oli Honda"]', 'Servis rutin pertama setelah beli motor', 250000, 'motor-1', 'test-user-1', NOW(), NOW()),
('service-2', '2024-03-20', 3500, '["Ganti oli transmisi", "Cek rantai", "Setel kopling"]', '["Oli transmisi", "Rantai RK", "Kampas kopling"]', 'Servis berkala 3000km', 180000, 'motor-1', 'test-user-1', NOW(), NOW()),
('service-3', '2024-02-10', 8000, '["Ganti oli mesin", "Ceki ban"]', '["Oli Shell 10W-40"]', 'Servis rutin bulanan', 150000, 'motor-2', 'test-user-2', NOW(), NOW()),
('service-4', '2024-04-05', 11000, '["Ganti kampas ganda", "Ganti oli gardan", "Caki sokbreker"]', '["Kampas ganda Bando", "Oli gardan"]', 'Servis besar 10000km', 450000, 'motor-3', 'test-user-3', NOW(), NOW());

-- Test Complaints
INSERT INTO complaints (id, description, symptoms, diagnosis, recommendations, motorcycle_id, user_id, created_at, updated_at)
VALUES
('complaint-1', 'Motor sulit distarter saat pagi hari, terdengar suara "klek-kek" dari bagian mesin', '["Motor sulit distarter", "Suara mesin tidak normal", "Power kurang"]', 'Kemungkinan besar pada aki sudah lemah atau sistem pengapian yang bermasalah. Perlu pengecekan aki dan busi.', '[{"action": "Cek tegangan aki", "priority": "tinggi", "estimated_cost": "Rp 50.000 - 150.000"}, {"action": "Bersihkan atau ganti busi", "priority": "tinggi", "estimated_cost": "Rp 20.000 - 50.000"}, {"action": "Setel karburator/injeksi", "priority": "sedang", "estimated_cost": "Rp 100.000 - 200.000"}]', 'motor-1', 'test-user-1', NOW(), NOW()),
('complaint-2', 'Motor getar saat melewati jalan tidak rata, terasa ada getaran di stang', '["Getaran di stang", "Suara gemeretak", "Stabilitas berkurang"]', 'Kemungkinan bearing roda depan sudah aus atau veleng bengkok. Perlu pengecekan komponen kemudi.', '[{"action": "Cek bearing roda depan", "priority": "tinggi", "estimated_cost": "Rp 150.000 - 300.000"}, {"action": "Periksa veleng dan rim", "priority": "sedang", "estimated_cost": "Rp 50.000 - 100.000"}, {"action": "Balancing roda", "priority": "sedang", "estimated_cost": "Rp 30.000 - 60.000"}]', 'motor-4', 'test-user-4', NOW(), NOW());

-- Test Reminders
INSERT INTO reminders (id, type, due_km, due_date, description, is_completed, motorcycle_id, created_at, updated_at)
VALUES
('reminder-1', 'km_based', 18000, NULL, 'Servis berkala 18.000 KM', false, 'motor-1', NOW(), NOW()),
('reminder-2', 'km_based', 12000, NULL, 'Servis berkala 12.000 KM', false, 'motor-2', NOW(), NOW()),
('reminder-3', 'time_based', NULL, '2024-12-31', 'Perpanjang STNK', false, 'motor-3', NOW(), NOW()),
('reminder-4', 'km_based', 10000, NULL, 'Servis berkala 10.000 KM', false, 'motor-4', NOW(), NOW()),
('reminder-5', 'condition_based', NULL, NULL, 'Cek dan ganti oli rantai', false, 'motor-1', NOW(), NOW());
```

## 🎯 Quick Fix

Coba ini satu per satu:

1. **Update .env dengan connection string dari Supabase Dashboard**
2. **Test connection**: `npx prisma db pull`
3. **Jika berhasil**: `npm run db:seed`
4. **Jika gagal**: Coba format connection yang berbeda

## 📞 Support

Jika masih gagal:
1. Screenshoot connection string dari Supabase Dashboard
2. Pastikan password "Admin1234%" tidak ada special characters yang perlu escaping
3. Coba test dengan tool database client lain (pgAdmin, DBeaver)