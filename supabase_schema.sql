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

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_motorcycles_updated_at BEFORE UPDATE ON motorcycles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_records_updated_at BEFORE UPDATE ON service_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic example - customize as needed)
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Similar policies for other tables...
CREATE POLICY "Users can view own motorcycles" ON motorcycles
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own service records" ON service_records
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own complaints" ON complaints
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own reminders" ON reminders
    FOR ALL USING (auth.uid()::text = user_id);