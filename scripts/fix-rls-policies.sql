-- First, disable the problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Doctors can view patient profiles they have access to" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create new policies that avoid circular references
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow doctors to view patient profiles they have access to
-- This policy now avoids the circular reference by not querying the users table again
CREATE POLICY "Doctors can view patient profiles" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.connected_user_id = auth.uid() 
            AND fc.user_id = users.id 
            AND fc.connection_status = 'accepted'
        )
    );

-- Allow admins to view all users
-- This policy now uses a direct role check instead of querying the users table again
CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Add a policy to allow new user registration
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);
