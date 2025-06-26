-- Create family groups table
CREATE TABLE IF NOT EXISTS family_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family members table
CREATE TABLE IF NOT EXISTS family_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other')),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    profile_photo TEXT,
    blood_type VARCHAR(5),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    health_summary TEXT,
    chronic_conditions TEXT[],
    medications TEXT[],
    allergies TEXT[],
    added_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family permissions table
CREATE TABLE IF NOT EXISTS family_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    granted_to UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_type VARCHAR(20) NOT NULL CHECK (permission_type IN ('view', 'edit', 'emergency')),
    granted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family health goals table
CREATE TABLE IF NOT EXISTS family_health_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    participants UUID[],
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_added_by ON family_members(added_by);
CREATE INDEX IF NOT EXISTS idx_family_permissions_member_id ON family_permissions(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_permissions_granted_to ON family_permissions(granted_to);
CREATE INDEX IF NOT EXISTS idx_family_health_goals_family_id ON family_health_goals(family_id);

-- Enable RLS (Row Level Security)
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_health_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family_groups
CREATE POLICY "Users can view their own family groups" ON family_groups
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create family groups" ON family_groups
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own family groups" ON family_groups
    FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for family_members
CREATE POLICY "Users can view family members they added or have permission to view" ON family_members
    FOR SELECT USING (
        added_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM family_permissions fp
            WHERE fp.family_member_id = family_members.id
            AND fp.granted_to = auth.uid()
            AND fp.permission_type IN ('view', 'edit', 'emergency')
        )
    );

CREATE POLICY "Users can add family members to their families" ON family_members
    FOR INSERT WITH CHECK (added_by = auth.uid());

CREATE POLICY "Users can update family members they added or have edit permission" ON family_members
    FOR UPDATE USING (
        added_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM family_permissions fp
            WHERE fp.family_member_id = family_members.id
            AND fp.granted_to = auth.uid()
            AND fp.permission_type IN ('edit', 'emergency')
        )
    );

-- RLS Policies for family_permissions
CREATE POLICY "Users can view permissions they granted or received" ON family_permissions
    FOR SELECT USING (granted_by = auth.uid() OR granted_to = auth.uid());

CREATE POLICY "Users can grant permissions for family members they added" ON family_permissions
    FOR INSERT WITH CHECK (
        granted_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.id = family_member_id
            AND fm.added_by = auth.uid()
        )
    );

-- RLS Policies for family_health_goals
CREATE POLICY "Users can view family health goals for their families" ON family_health_goals
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM family_groups fg
            WHERE fg.id = family_id
            AND fg.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can create family health goals for their families" ON family_health_goals
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update family health goals they created" ON family_health_goals
    FOR UPDATE USING (created_by = auth.uid());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_family_groups_updated_at ON family_groups;
CREATE TRIGGER update_family_groups_updated_at
    BEFORE UPDATE ON family_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_family_members_updated_at ON family_members;
CREATE TRIGGER update_family_members_updated_at
    BEFORE UPDATE ON family_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_family_health_goals_updated_at ON family_health_goals;
CREATE TRIGGER update_family_health_goals_updated_at
    BEFORE UPDATE ON family_health_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
