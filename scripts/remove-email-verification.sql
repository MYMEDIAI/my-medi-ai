-- Remove email verification requirement
-- Update existing users to be verified and active
UPDATE users 
SET 
    email_verified = true,
    status = 'active',
    updated_at = NOW()
WHERE status = 'pending_verification' OR email_verified = false;

-- Update the default values for new users
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT true;
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'active';
