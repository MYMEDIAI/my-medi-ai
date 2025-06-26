-- Create ENUM types only if they don't exist
DO $$ BEGIN
    CREATE TYPE vital_type AS ENUM ('blood_pressure', 'blood_glucose', 'weight', 'heart_rate', 'temperature', 'oxygen_saturation', 'bmi');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE glucose_context AS ENUM ('fasting', 'before_meal', 'after_meal', 'bedtime', 'random');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_status AS ENUM ('connected', 'disconnected', 'syncing', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create vitals_data table (enhanced version of existing one)
CREATE TABLE IF NOT EXISTS vitals_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vital_type vital_type NOT NULL,
    
    -- Blood Pressure
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    
    -- Blood Glucose
    blood_glucose DECIMAL(5,2),
    glucose_context glucose_context,
    
    -- Weight and BMI
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    bmi DECIMAL(4,2),
    
    -- Heart Rate
    heart_rate INTEGER,
    
    -- Temperature
    temperature DECIMAL(4,2),
    
    -- Oxygen Saturation
    oxygen_saturation INTEGER,
    
    -- General fields
    unit_system VARCHAR(10) DEFAULT 'metric' CHECK (unit_system IN ('metric', 'imperial')),
    notes TEXT,
    medication_taken BOOLEAN DEFAULT FALSE,
    medication_name VARCHAR(255),
    
    -- Device information
    device_name VARCHAR(100),
    device_model VARCHAR(100),
    device_id VARCHAR(100),
    sync_status device_status DEFAULT 'disconnected',
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    
    -- Context
    measurement_context VARCHAR(50), -- 'morning', 'evening', 'after_exercise', etc.
    location VARCHAR(100),
    
    -- Timestamps
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connected devices table
CREATE TABLE IF NOT EXISTS connected_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_name VARCHAR(255) NOT NULL,
    device_type VARCHAR(50) NOT NULL CHECK (device_type IN ('blood_pressure_monitor', 'glucometer', 'scale', 'heart_rate_monitor', 'thermometer', 'pulse_oximeter')),
    device_model VARCHAR(255),
    device_id VARCHAR(255) UNIQUE,
    bluetooth_address VARCHAR(17), -- MAC address format
    status device_status DEFAULT 'disconnected',
    last_sync TIMESTAMP WITH TIME ZONE,
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    firmware_version VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vital ranges table for personalized normal ranges
CREATE TABLE IF NOT EXISTS vital_ranges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vital_type vital_type NOT NULL,
    min_normal DECIMAL(10,2),
    max_normal DECIMAL(10,2),
    min_warning DECIMAL(10,2),
    max_warning DECIMAL(10,2),
    min_critical DECIMAL(10,2),
    max_critical DECIMAL(10,2),
    unit VARCHAR(20),
    set_by_doctor BOOLEAN DEFAULT FALSE,
    doctor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vital_type)
);

-- Create vitals goals table
CREATE TABLE IF NOT EXISTS vitals_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vital_type vital_type NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    target_range_min DECIMAL(10,2),
    target_range_max DECIMAL(10,2),
    unit VARCHAR(20),
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vitals_data_user_id ON vitals_data(user_id);
CREATE INDEX IF NOT EXISTS idx_vitals_data_vital_type ON vitals_data(vital_type);
CREATE INDEX IF NOT EXISTS idx_vitals_data_measured_at ON vitals_data(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_data_user_type_date ON vitals_data(user_id, vital_type, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_connected_devices_user_id ON connected_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_devices_status ON connected_devices(status);
CREATE INDEX IF NOT EXISTS idx_vital_ranges_user_id ON vital_ranges(user_id);
CREATE INDEX IF NOT EXISTS idx_vitals_goals_user_id ON vitals_goals(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE vitals_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vitals_data
DROP POLICY IF EXISTS "Users can view their own vitals data" ON vitals_data;
CREATE POLICY "Users can view their own vitals data" ON vitals_data
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own vitals data" ON vitals_data;
CREATE POLICY "Users can insert their own vitals data" ON vitals_data
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own vitals data" ON vitals_data;
CREATE POLICY "Users can update their own vitals data" ON vitals_data
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own vitals data" ON vitals_data;
CREATE POLICY "Users can delete their own vitals data" ON vitals_data
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for connected_devices
DROP POLICY IF EXISTS "Users can view their own devices" ON connected_devices;
CREATE POLICY "Users can view their own devices" ON connected_devices
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own devices" ON connected_devices;
CREATE POLICY "Users can manage their own devices" ON connected_devices
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for vital_ranges
DROP POLICY IF EXISTS "Users can view their own vital ranges" ON vital_ranges;
CREATE POLICY "Users can view their own vital ranges" ON vital_ranges
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own vital ranges" ON vital_ranges;
CREATE POLICY "Users can manage their own vital ranges" ON vital_ranges
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for vitals_goals
DROP POLICY IF EXISTS "Users can view their own vitals goals" ON vitals_goals;
CREATE POLICY "Users can view their own vitals goals" ON vitals_goals
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own vitals goals" ON vitals_goals;
CREATE POLICY "Users can manage their own vitals goals" ON vitals_goals
    FOR ALL USING (user_id = auth.uid());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_vitals_data_updated_at ON vitals_data;
CREATE TRIGGER update_vitals_data_updated_at
    BEFORE UPDATE ON vitals_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connected_devices_updated_at ON connected_devices;
CREATE TRIGGER update_connected_devices_updated_at
    BEFORE UPDATE ON connected_devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vital_ranges_updated_at ON vital_ranges;
CREATE TRIGGER update_vital_ranges_updated_at
    BEFORE UPDATE ON vital_ranges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vitals_goals_updated_at ON vitals_goals;
CREATE TRIGGER update_vitals_goals_updated_at
    BEFORE UPDATE ON vitals_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default vital ranges (standard medical ranges)
INSERT INTO vital_ranges (user_id, vital_type, min_normal, max_normal, min_warning, max_warning, min_critical, max_critical, unit)
SELECT 
    auth.uid(),
    'blood_pressure'::vital_type,
    90, 120, -- systolic normal range
    140, 180, -- systolic warning range  
    60, 80, -- diastolic normal range (stored in min_critical, max_critical for now)
    'mmHg'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, vital_type) DO NOTHING;

-- Add sample data for testing (optional - remove in production)
-- This will only work if there's an authenticated user
/*
INSERT INTO vitals_data (user_id, vital_type, systolic_bp, diastolic_bp, measured_at)
SELECT auth.uid(), 'blood_pressure'::vital_type, 120, 80, NOW() - INTERVAL '1 day'
WHERE auth.uid() IS NOT NULL;

INSERT INTO vitals_data (user_id, vital_type, blood_glucose, glucose_context, measured_at)
SELECT auth.uid(), 'blood_glucose'::vital_type, 95.5, 'fasting'::glucose_context, NOW() - INTERVAL '2 hours'
WHERE auth.uid() IS NOT NULL;
*/
