-- Run this in Supabase SQL Editor to verify your database setup

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'health_profiles', 'health_records', 'vitals_data', 'ai_interactions', 'family_connections', 'health_insights');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- Test basic user creation (this should work with service role)
-- Don't run this if you're not using service role
-- INSERT INTO users (id, email, first_name, last_name, role, status, password_hash) 
-- VALUES (gen_random_uuid(), 'test@example.com', 'Test', 'User', 'patient', 'pending_verification', 'test_hash');
