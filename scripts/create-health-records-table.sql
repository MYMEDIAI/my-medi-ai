-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'prescription', 'lab_report', 'xray', 'mri', 'ct_scan', 
        'ultrasound', 'vaccination', 'consultation', 'surgery', 
        'insurance', 'other'
    )),
    date DATE NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size INTEGER,
    ocr_text TEXT,
    privacy_level VARCHAR(20) DEFAULT 'private' CHECK (privacy_level IN ('private', 'family', 'shared')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_category ON health_records(category);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_health_records_tags ON health_records USING GIN(tags);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health records" ON health_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health records" ON health_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health records" ON health_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health records" ON health_records
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_health_records_updated_at
    BEFORE UPDATE ON health_records
    FOR EACH ROW
    EXECUTE FUNCTION update_health_records_updated_at();
