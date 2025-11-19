# MotorCare - Supabase Migration Guide

## 🔄 Database Migration: SQLite to Supabase

### 📋 Prerequisites

You need your Supabase database password. You can find it in:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`apnbmxwbhtdspixnkhan`)
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Copy the **password** from the connection string

### 🔧 Setup Instructions

#### 1. Update Environment Variables

Edit your `.env` file and replace `YOUR_SUPABASE_PASSWORD` with your actual password:

```env
# Before
DATABASE_URL="postgresql://postgres:YOUR_SUPABASE_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# After (example)
DATABASE_URL="postgresql://postgres:your_actual_password_here@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

#### 2. Push Database Schema

```bash
npx prisma db push
```

#### 3. Generate Prisma Client

```bash
npx prisma generate
```

#### 4. Restart Development Server

```bash
# Kill existing server
pkill -f "next dev"

# Start new server
npm run dev
```

### 🏗️ Database Architecture

The application uses a hybrid approach:

1. **Prisma ORM** - For structured data operations
   - Users, Motorcycles, ServiceRecords, Complaints, Reminders
   - Type-safe database operations
   - Migrations and schema management

2. **Supabase Auth** - For authentication (optional)
   - JWT-based authentication
   - Social login support
   - Session management

### 📊 Database Schema

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Motorcycles
CREATE TABLE motorcycles (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  plate_number TEXT UNIQUE NOT NULL,
  year INTEGER NOT NULL,
  stnk_expiry TIMESTAMP NOT NULL,
  usage_type TEXT NOT NULL,
  initial_km INTEGER NOT NULL,
  current_km INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service Records
CREATE TABLE service_records (
  id TEXT PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  km INTEGER NOT NULL,
  actions TEXT NOT NULL, -- JSON array
  spareparts TEXT, -- JSON array
  notes TEXT,
  cost INTEGER,
  motorcycle_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Complaints
CREATE TABLE complaints (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  symptoms TEXT, -- JSON array
  diagnosis TEXT, -- AI diagnosis
  recommendations TEXT, -- JSON array
  motorcycle_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders
CREATE TABLE reminders (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- km_based, time_based, condition_based
  due_km INTEGER,
  due_date TIMESTAMP,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  motorcycle_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id) ON DELETE CASCADE
);
```

### 🚀 Benefits of Supabase

1. **Real-time Capabilities**: Built-in real-time subscriptions
2. **Authentication**: Complete auth solution with social providers
3. **File Storage**: Built-in file storage for images/documents
4. **Edge Functions**: Serverless functions for complex operations
5. **Security**: Row Level Security (RLS) support
6. **Scalability**: Managed PostgreSQL database

### 🔄 Migration Notes

- **Data Migration**: Existing SQLite data will not be automatically migrated
- **API Compatibility**: All existing API endpoints remain the same
- **Authentication**: Current auth system works, Supabase auth is optional
- **Performance**: Improved performance with PostgreSQL

### 🛠️ Troubleshooting

#### Connection Issues
```bash
# Test database connection
npx prisma db pull
```

#### Schema Issues
```bash
# Reset and push schema
npx prisma db push --force-reset
```

#### Client Generation
```bash
# Regenerate Prisma client
npx prisma generate
```

### 📝 Next Steps

1. **Update Password**: Replace `YOUR_SUPABASE_PASSWORD` in `.env`
2. **Push Schema**: Run `npx prisma db push`
3. **Test APIs**: Verify all endpoints work with new database
4. **Optional**: Implement Supabase Auth for enhanced security

### 🔐 Security Notes

- Database connection uses SSL by default
- Passwords are hashed before storage
- Row Level Security can be implemented in Supabase
- API keys are stored in environment variables