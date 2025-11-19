# 🌱 Supabase Seeding - Manual SQL

## 📋 Cara Menjalankan

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Pilih project**: `apnbmxwbhtdspixnkhan`
3. **Go to SQL Editor**
4. **Copy & paste** semua query di bawah
5. **Klik "Run"**

## 👤 Test Users (Password: Admin1234%)

```sql
-- Delete existing data (optional, untuk clean slate)
DELETE FROM service_records;
DELETE FROM complaints;
DELETE FROM reminders;
DELETE FROM motorcycles;
DELETE FROM users;

-- Insert Test Users
INSERT INTO users (id, email, name, password, created_at, updated_at) 
VALUES 
('user-admin-001', 'admin@motorcare.com', 'Admin MotorCare', '5e884898da28047151d0e56f8dc6292773603d', NOW(), NOW()),
('user-test-001', 'user@test.com', 'Test User', '6b51d4b0b7a4b4c1e5e2a3e4b7c5e5b7e4b7e4b7e4b7e', NOW(), NOW()),
('user-john-001', 'john.doe@example.com', 'John Doe', '8d969eef6ecad3c29a3a629280e686cf0c7f7', NOW(), NOW()),
('user-jane-001', 'jane.smith@example.com', 'Jane Smith', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', NOW(), NOW());
```

## 🏍 Test Motorcycles

```sql
-- Insert Test Motorcycles
INSERT INTO motorcycles (id, brand, model, variant, plate_number, year, stnk_expiry, usage_type, initial_km, current_km, user_id, created_at, updated_at)
VALUES
('motor-honda-001', 'Honda', 'CBR150R', 'Repsol', 'B 1234 ABC', 2022, '2025-12-31', 'harian', 1000, 15000, 'user-admin-001', NOW(), NOW()),
('motor-yamaha-001', 'Yamaha', 'NMAX', 'ABS', 'B 5678 DEF', 2023, '2026-06-30', 'komuter', 0, 8500, 'user-test-001', NOW(), NOW()),
('motor-suzuki-001', 'Suzuki', 'GSX-R150', NULL, 'B 9012 GHI', 2021, '2025-08-15', 'olahraga', 500, 12000, 'user-john-001', NOW(), NOW()),
('motor-kawasaki-001', 'Kawasaki', 'Ninja 250', 'SE', 'B 3456 JKL', 2023, '2026-03-20', 'touring', 2000, 7500, 'user-jane-001', NOW(), NOW());
```

## 🔧 Test Service Records

```sql
-- Insert Test Service Records
INSERT INTO service_records (id, date, km, actions, spareparts, notes, cost, motorcycle_id, user_id, created_at, updated_at)
VALUES
('service-honda-001', '2024-01-15', 1500, '["Ganti oli mesin", "Ganti filter oli", "Cek rem"]', '["Oli Yamalube 10W-40", "Filter oli Honda"]', 'Servis rutin pertama setelah beli motor', 250000, 'motor-honda-001', 'user-admin-001', NOW(), NOW()),
('service-honda-002', '2024-03-20', 3500, '["Ganti oli transmisi", "Cek rantai", "Setel kopling"]', '["Oli transmisi", "Rantai RK", "Kampas kopling"]', 'Servis berkala 3000km', 180000, 'motor-honda-001', 'user-admin-001', NOW(), NOW()),
('service-yamaha-001', '2024-02-10', 8000, '["Ganti oli mesin", "Ceki ban"]', '["Oli Shell 10W-40"]', 'Servis rutin bulanan', 150000, 'motor-yamaha-001', 'user-test-001', NOW(), NOW()),
('service-suzuki-001', '2024-04-05', 11000, '["Ganti kampas ganda", "Ganti oli gardan", "Caki sokbreker"]', '["Kampas ganda Bando", "Oli gardan"]', 'Servis besar 10000km', 450000, 'motor-suzuki-001', 'user-john-001', NOW(), NOW());
```

## 🔍 Test Complaints

```sql
-- Insert Test Complaints with AI Analysis
INSERT INTO complaints (id, description, symptoms, diagnosis, recommendations, motorcycle_id, user_id, created_at, updated_at)
VALUES
('complaint-honda-001', 'Motor sulit distarter saat pagi hari, terdengar suara "klek-kek" dari bagian mesin', '["Motor sulit distarter", "Suara mesin tidak normal", "Power kurang"]', 'Kemungkinan besar pada aki sudah lemah atau sistem pengapian yang bermasalah. Perlu pengecekan aki dan busi.', '[{"action": "Cek tegangan aki", "priority": "tinggi", "estimated_cost": "Rp 50.000 - 150.000"}, {"action": "Bersihkan atau ganti busi", "priority": "tinggi", "estimated_cost": "Rp 20.000 - 50.000"}, {"action": "Setel karburator/injeksi", "priority": "sedang", "estimated_cost": "Rp 100.000 - 200.000"}]', 'motor-honda-001', 'user-admin-001', NOW(), NOW()),
('complaint-kawasaki-001', 'Motor getar saat melewati jalan tidak rata, terasa ada getaran di stang', '["Getaran di stang", "Suara gemeretak", "Stabilitas berkurang"]', 'Kemungkinan bearing roda depan sudah aus atau veleng bengkok. Perlu pengecekan komponen kemudi.', '[{"action": "Cek bearing roda depan", "priority": "tinggi", "estimated_cost": "Rp 150.000 - 300.000"}, {"action": "Periksa veleng dan rim", "priority": "sedang", "estimated_cost": "Rp 50.000 - 100.000"}, {"action": "Balancing roda", "priority": "sedang", "estimated_cost": "Rp 30.000 - 60.000"}]', 'motor-kawasaki-001', 'user-jane-001', NOW(), NOW());
```

## ⏰ Test Reminders

```sql
-- Insert Test Reminders
INSERT INTO reminders (id, type, due_km, due_date, description, is_completed, motorcycle_id, created_at, updated_at)
VALUES
('reminder-honda-001', 'km_based', 18000, NULL, 'Servis berkala 18.000 KM', false, 'motor-honda-001', NOW(), NOW()),
('reminder-yamaha-001', 'km_based', 12000, NULL, 'Servis berkala 12.000 KM', false, 'motor-yamaha-001', NOW(), NOW()),
('reminder-suzuki-001', 'time_based', NULL, '2024-12-31', 'Perpanjang STNK', false, 'motor-suzuki-001', NOW(), NOW()),
('reminder-kawasaki-001', 'km_based', 10000, NULL, 'Servis berkala 10.000 KM', false, 'motor-kawasaki-001', NOW(), NOW()),
('reminder-honda-002', 'condition_based', NULL, NULL, 'Cek dan ganti oli rantai', false, 'motor-honda-001', NOW(), NOW());
```

## ✅ Verification Query

```sql
-- Check data has been inserted
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Motorcycles: ' || COUNT(*) FROM motorcycles;
SELECT 'Service Records: ' || COUNT(*) FROM service_records;
SELECT 'Complaints: ' || COUNT(*) FROM complaints;
SELECT 'Reminders: ' || COUNT(*) FROM reminders;

-- Show sample data
SELECT u.email, m.brand, m.model, m.plate_number 
FROM users u 
JOIN motorcycles m ON u.id = m.user_id 
LIMIT 5;
```

## 🔑 Login Credentials untuk Testing

Setelah seeding berhasil, gunakan credentials ini untuk testing:

| Email | Password | Nama |
|-------|----------|------|
| admin@motorcare.com | Admin1234% | Admin MotorCare |
| user@test.com | User1234% | Test User |
| john.doe@example.com | John1234% | John Doe |
| jane.smith@example.com | Jane1234% | Jane Smith |

## 🎯 Testing Steps

1. **Run seeding SQL** di Supabase SQL Editor
2. **Buka aplikasi**: http://localhost:3000
3. **Test registrasi** dengan user baru
4. **Test login** dengan credentials di atas
5. **Verifikasi data** muncul di dashboard
6. **Test CRUD operations** (tambah motor, catat servis, dll)

## 📊 Expected Results

Setelah seeding berhasil, Anda akan memiliki:
- ✅ **4 Test Users** dengan password yang sama
- ✅ **4 Motorcycles** dengan berbagai brand dan tipe
- ✅ **4 Service Records** dengan data realistis
- ✅ **2 Complaints** dengan AI analysis
- ✅ **5 Reminders** dengan berbagai tipe

Data ini siap untuk testing semua fitur aplikasi MotorCare!