# 🔧 Supabase Setup & Troubleshooting Guide

## 1. 📋 DDL/Query untuk Supabase

### Jalankan query ini di Supabase SQL Editor:

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

## 2. 🔗 Database Connection Config

### Format yang benar untuk `.env`:

```env
# Ganti YOUR_ACTUAL_PASSWORD dengan password database Supabase Anda
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL=https://apnbmxwbhtdspixnkhan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmJteHdiaHRkc3BpeG5raGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mjk4NzQsImV4cCI6MjA3OTEwNTg3NH0.hkCnxQJE-_ZXyC_qMA9A59WxwKW77kLQRm-plL546OE
```

### Cara mendapatkan password:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project `apnbmxwbhtdspixnkhan`
3. Go to **Settings** → **Database**
4. Scroll ke **Connection string**
5. Copy password dari connection string
6. Update file `.env`

## 3. 🚨 Error Registrasi - Diagnosis & Solusi

### Kemungkinan penyebab error:

#### A. Database Connection Error
**Symptom**: "Terjadi kesalahan server" saat registrasi
**Cause**: Koneksi ke Supabase gagal
**Solution**:
```bash
# Test koneksi database
npx prisma db pull

# Jika error, periksa password di .env
# Pastikan format connection string benar
```

#### B. Schema Not Created
**Symptom**: Error "table doesn't exist"
**Cause**: Schema belum di-push ke Supabase
**Solution**:
```bash
# Push schema ke Supabase
npx prisma db push

# Atau jalankan manual DQL di SQL Editor Supabase
```

#### C. Prisma Client Error
**Symptom**: Error "Cannot find module '@prisma/client'"
**Cause**: Prisma client belum di-generate
**Solution**:
```bash
npx prisma generate
```

#### D. Environment Variable Error
**Symptom**: Error "DATABASE_URL not found"
**Cause**: Environment variable tidak ter-load
**Solution**:
```bash
# Restart development server
pkill -f "next dev"
npm run dev

# Pastikan .env file ada dan benar
```

## 4. 🔧 Step-by-Step Fix

### Step 1: Manual Setup (Recommended)

1. **Buka Supabase SQL Editor**
   - Dashboard → SQL Editor
   - Copy & paste DDL di atas
   - Klik "Run"

2. **Update .env file**
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Test Registration**
   ```bash
   npm run dev
   # Buka http://localhost:3000/auth/register
   ```

### Step 2: Automatic Setup (Alternative)

1. **Update password di .env**
2. **Run Prisma push**:
   ```bash
   npx prisma db push
   ```

## 5. 🧪 Testing Commands

```bash
# Test database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Push schema
npx prisma db push

# Reset database (jika perlu)
npx prisma db push --force-reset
```

## 6. 📊 Verification

Setelah setup, test:

1. **Registrasi User Baru**
   - Buka `/auth/register`
   - Input email, password, name
   - Submit

2. **Login User**
   - Buka `/auth/login`
   - Input credentials
   - Verify login berhasil

3. **Tambah Motor**
   - Buka `/motorcycle/add`
   - Input data motor
   - Verify tersimpan

4. **Check Database**
   - Buka Supabase Dashboard
   - Table Editor
   - Verify data muncul

## 7. 🆘 Emergency Fallback

Jika Supabase tidak berhasil, kembali ke SQLite:

```env
# Kembali ke SQLite
DATABASE_URL="file:./dev.db"
```

```bash
# Push ke SQLite
npx prisma db push
```

## 8. 📝 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| "Tenant not found" | Wrong password | Check Supabase dashboard for correct password |
| "Table doesn't exist" | Schema not pushed | Run DDL manually or `npx prisma db push` |
| "Connection refused" | Wrong host/port | Verify connection string format |
| "Auth failed" | Wrong credentials | Check email/password in registration |

## 9. 🎯 Success Indicators

Setup berhasil jika:
- ✅ No error saat `npx prisma db push`
- ✅ Registrasi user berhasil tanpa error
- ✅ User bisa login
- ✅ Data muncul di Supabase Dashboard
- ✅ Semua API endpoints berfungsi

## 10. 📞 Support

Jika masih error:
1. Check dev server logs: `tail -f dev.log`
2. Verify environment variables: `cat .env`
3. Test database connection manual: `npx prisma db pull`
4. Restart everything: `pkill -f next && npm run dev`