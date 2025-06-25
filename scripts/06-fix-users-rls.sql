-- ------------------------------------------------------------------
-- 06-fix-users-rls.sql
--
-- Completely replace RLS policies on the "users" table to eliminate
-- the “infinite recursion” error and keep the intended permissions.
-- ------------------------------------------------------------------

-- 1.  Disable RLS temporarily so dropping works even for self-locked DBs
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2.  Drop **all** existing policies on the table
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename  = 'users'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON users;', p.policyname);
  END LOOP;
END $$;

-- 3.  (Re)-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4.  Re-create the minimal, recursion-free set of policies
-------------------------------------------------------------------
-- 4.1 Patients: can read their own record
CREATE POLICY patient_select_self
  ON users
  FOR SELECT
  USING ( auth.uid() = id );

-- 4.2 Patients: can update their own record
CREATE POLICY patient_update_self
  ON users
  FOR UPDATE
  USING ( auth.uid() = id );

-------------------------------------------------------------------
-- 4.3 Admins: have full access
--      NOTE: we do **not** select from "users" here – we rely purely
--            on the custom 'role' claim we already embed in the JWT.
CREATE POLICY admin_all
  ON users
  FOR ALL
  USING  ( auth.jwt() ->> 'role' = 'admin' )
  WITH CHECK ( auth.jwt() ->> 'role' = 'admin' );

-------------------------------------------------------------------
-- 4.4 Doctors: may view (SELECT) patient profiles they’re connected to.
--      This references only "family_connections" – no self-query.
CREATE POLICY doctor_view_connected_patients
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM family_connections fc
      WHERE fc.connected_user_id = auth.uid()
        AND fc.user_id            = users.id
        AND fc.connection_status  = 'accepted'
    )
  );

-- 5.  Optional: allow **anonymous INSERT** for signup (already present
--     in earlier migrations – keep it here to ensure it still exists)
CREATE POLICY allow_public_signup
  ON users
  FOR INSERT
  WITH CHECK ( true );

-- ------------------------------------------------------------------
-- Done – the "users" RLS now contains *zero* sub-queries that read
-- from "users", so the infinite-recursion error is impossible.
-- ------------------------------------------------------------------
