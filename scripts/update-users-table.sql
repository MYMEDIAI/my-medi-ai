-- Option 1: Make password_hash nullable (if you want to keep the column)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Option 2: Add a default value for password_hash
-- ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT 'SUPABASE_AUTH_MANAGED';

-- Option 3: Remove the column entirely (since we're using Supabase Auth)
-- This is the cleanest solution but requires updating any code that references this column
-- ALTER TABLE users DROP COLUMN password_hash;

-- Add a comment to explain why this column exists but isn't used
COMMENT ON COLUMN users.password_hash IS 'Placeholder for compatibility. Actual authentication is handled by Supabase Auth.';
