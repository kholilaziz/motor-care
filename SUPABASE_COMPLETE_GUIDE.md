# 🎯 Supabase Integration - Complete Guide

## 📋 1. DDL/Query untuk Supabase Database

**Cara 1: Manual di Supabase SQL Editor (Recommended)**

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project `apnbmxwbhtdspixnkhan`
3. Go to **SQL Editor**
4. Copy & paste query berikut:

```sql
-- ==========================================
-- MotorCare - Supabase Database Schema
-- ==========================================

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (generate_random_text(10)),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Motorcycles Table
CREATE TABLE IF NOT EXISTS motorcycles (
    id TEXT PRIMARY KEY DEFAULT (generate_random_text(10)),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT,
    plate_number TEXT UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    stnk_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('harian', 'komuter', 'touring', 'olahraga', 'jarang')),
    initial_km INTEGER NOT NULL,
    current_km INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service Records Table
CREATE TABLE IF NOT EXISTS service_records (
    id TEXT PRIMARY KEY DEFAULT (generate_random_text(10)),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    km INTEGER NOT NULL,
    actions TEXT NOT NULL, -- JSON array of service actions
    spareparts TEXT, -- JSON array of spareparts used
    notes TEXT,
    cost INTEGER,
    motorcycle_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY DEFAULT (generate_random_text(10)),
    description TEXT NOT NULL,
    symptoms TEXT, -- JSON array of symptoms
    diagnosis TEXT, -- AI diagnosis result
    recommendations TEXT, -- JSON array of recommendations
    motorcycle_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY DEFAULT (generate_random_text(10)),
    type TEXT NOT NULL CHECK (type IN ('km_based', 'time_based', 'condition_based')),
    due_km INTEGER,
    due_date TIMESTAMP WITH TIME ZONE,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    motorcycle_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_motorcycles_user_id ON motorcycles(user_id);
CREATE INDEX IF NOT EXISTS idx_motorcycles_plate_number ON motorcycles(plate_number);
CREATE INDEX IF NOT EXISTS idx_service_records_user_id ON service_records(user_id);
CREATE INDEX IF NOT EXISTS idx_service_records_motorcycle_id ON service_records(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_motorcycle_id ON complaints(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_reminders_motorcycle_id ON reminders(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(is_completed);
```

5. Klik **Run** untuk mengeksekusi query

## 🔗 2. Database Connection Config

**Format yang benar untuk file `.env`:**

```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL=https://apnbmxwbhtdspixnkhan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmJteHdiaHRkc3BpeG5raGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mjk4NzQsImV4cCI6MjA3OTEwNTg3NH0.hkCnxQJE-_ZXyC_qMA9A59WxwKW77kLQRm-plL546OE
```

**Cara mendapatkan password:**
1. Dashboard → Settings → Database
2. Scroll ke **Connection string**
3. Copy password dari format: `postgresql://postgres:[PASSWORD]@...`
4. Ganti `PASSWORD_ANDA` di atas

## 🚨 3. Error Registrasi - Diagnosis & Solusi

### Penyebab Error dan Solusi:

#### A. Database Connection Failed
**Error**: "Database connection failed. Please check your Supabase configuration."
**Penyebab**: Connection string salah atau password salah
**Solusi**:
```bash
# Test koneksi
npx prisma db pull

# Jika error, periksa password di .env
# Pastikan format: postgresql://postgres:PASSWORD@host:5432/postgres
```

#### B. Table Doesn't Exist
**Error**: "relation \"users\" does not exist"
**Penyebab**: Schema belum dibuat di Supabase
**Solusi**: Jalankan DQL manual di SQL Editor (lihat bagian 1)

#### C. Prisma Client Error
**Error**: "Cannot find module '@prisma/client'"
**Penyebab**: Prisma client belum di-generate
**Solusi**:
```bash
npx prisma generate
```

#### D. Environment Variable Error
**Error**: "DATABASE_URL not found"
**Penyebab**: Environment variable tidak ter-load
**Solusi**:
```bash
# Restart server
pkill -f "next dev"
npm run dev
```

## 🔧 4. Step-by-Step Complete Setup

### Option A: Manual Setup (Recommended)

1. **Buat Tabel di Supabase**
   - SQL Editor → Paste DDL → Run

2. **Update .env**
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Test Registrasi**
   ```bash
   npm run dev
   # Buka http://localhost:3000/auth/register
   ```

### Option B: Automatic Setup

1. **Update password di .env**
2. **Push schema dengan Prisma**
   ```bash
   npx prisma db push
   ```

## 🧪 5. Testing Commands

```bash
# Test koneksi database
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Push schema ke Supabase
npx prisma db push

# Reset database (emergency)
npx prisma db push --force-reset
```

## 📊 6. Verification Checklist

Setup berhasil jika:

- ✅ **DDL berhasil dijalankan** di Supabase SQL Editor
- ✅ **Tabel muncul** di Supabase Dashboard → Table Editor
- ✅ **Prisma client ter-generate** tanpa error
- ✅ **Registrasi user berhasil** tanpa "Terjadi kesalahan server"
- ✅ **User bisa login** dengan credentials yang benar
- ✅ **Data tersimpan** di Supabase (bisa dicek di Dashboard)
- ✅ **Semua API endpoints** berfungsi normal

## 🆘 7. Emergency Fallback

Jika Supabase tidak berhasil, kembali ke SQLite:

```env
# Kembali ke SQLite
DATABASE_URL="file:./dev.db"
```

```bash
# Reset ke SQLite
npx prisma db push --force-reset
```

## 📞 8. Debugging Tips

### Check Dev Server Logs
```bash
tail -f dev.log
```

### Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test"}'
```

### Check Environment Variables
```bash
cat .env
echo $DATABASE_URL
```

## 🎯 9. Success Indicators

Aplikasi berhasil menggunakan Supabase jika:

1. **No database connection errors**
2. **Registrasi berhasil** dengan response `{"message":"Registrasi berhasil","user":{...}}`
3. **Data muncul di Supabase Dashboard**
4. **Login berhasil** dan user data ter-load
5. **CRUD operations** berfungsi untuk motor, servis, dll

## 📝 10. Common Issues Quick Fix

| Error | Quick Fix |
|--------|------------|
| "Tenant not found" | Check password di .env, dapatkan dari Supabase Dashboard |
| "Table doesn't exist" | Jalankan DDL manual di SQL Editor |
| "Connection refused" | Pastikan format connection string benar |
| "Auth failed" | Periksa email/password saat registrasi/login |
| "Prisma error" | Run `npx prisma generate` |

---

**🎉 Setelah setup berhasil, aplikasi MotorCare akan berjalan dengan database Supabase yang lebih powerful dan scalable!**