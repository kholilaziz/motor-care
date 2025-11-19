# 🚨 Supabase Connection Fix

## 🔍 Current Issue

Error: "Tenant or user not found" - Ini menandakan connection string ke Supabase tidak benar.

## ✅ Solution: Use Connection String dari Supabase Dashboard

### Step 1: Dapatkan Connection String yang Benar

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project `apnbmxwbhtdspixnkhan`
3. Go to **Settings** → **Database**
4. Scroll ke **Connection string** section
5. Copy **Connection pooling** connection string
6. Formatnya akan seperti: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Step 2: Update .env File

Ganti file `.env` dengan connection string yang BENAR dari Supabase:

```env
# Ganti dengan connection string dari Supabase Dashboard
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

NEXT_PUBLIC_SUPABASE_URL=https://apnbmxwbhtdspixnkhan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmJteHdiaHRkc3BpeG5raGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mjk4NzQsImV4cCI6MjA3OTEwNTg3NH0.hkCnxQJE-_ZXyC_qMA9A59WxwKW77kLQRm-plL546OE
```

### Step 3: Test Connection

```bash
# Test koneksi database
npx prisma db pull

# Jika berhasil, lanjut ke seeding
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run seeding
npm run db:seed
```

## 🔧 Alternative: Direct Connection

Jika connection pooling gagal, coba direct connection:

```env
# Direct connection (tanpa pooling)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

## 📋 Manual Seeding (Jika Otomatis Gagal)

Jika seeding otomatis gagal, jalankan manual:

1. **DDL untuk Tables**: Copy dari `supabase_schema.sql`
2. **Seeding Data**: Copy dari `SUPABASE_SEEDING_SQL.md`
3. **Jalankan di Supabase SQL Editor**

## 🎯 Expected Result

Setelah connection berhasil:
- ✅ `npx prisma db pull` berhasil tanpa error
- ✅ `npx prisma db push` berhasil membuat tables
- ✅ `npm run db:seed` berhasil membuat data test
- ✅ Login aplikasi berhasil dengan credentials test

## 🚨 Critical Notes

1. **Jangan gunakan password yang di-hardcode** - selalu ambil dari Supabase dashboard
2. **Pastikan format connection string benar** - copy langsung dari dashboard
3. **Test dengan `npx prisma db pull`** sebelum mencoba seeding
4. **Jika masih error** - coba buat project baru di Supabase

## 🔑 Test Credentials Setelah Seeding Berhasil

| Email | Password | Role |
|-------|----------|-------|
| admin@motorcare.com | Admin1234% | Admin |
| user@test.com | User1234% | Test User |
| john.doe@example.com | John1234% | Regular User |
| jane.smith@example.com | Jane1234% | Regular User |

## 📞 Support

Jika masih mengalami masalah:
1. **Restart development server**: `pkill -f "next dev" && npm run dev`
2. **Clear Prisma cache**: `rm -rf .prisma && npx prisma generate`
3. **Check environment**: `echo $DATABASE_URL`
4. **Test dengan tool lain**: pgAdmin, DBeaver, atau psql command line

**🎯 Setelah connection berhasil, aplikasi akan berjalan dengan database Supabase yang powerful!**