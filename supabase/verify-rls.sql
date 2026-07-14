-- ============================================
-- PitchFlow RLS Verification Script
-- Run this in Supabase SQL Editor to verify RLS policies
-- ============================================

-- 1. Check if RLS is enabled on all tables
SELECT
  'Table' AS object_type,
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments')
ORDER BY tablename;

-- 2. List all RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd AS operation,
  roles::text AS applicable_roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments')
ORDER BY tablename, policyname;

-- 3. Count policies per table
SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments')
GROUP BY tablename
ORDER BY tablename;

-- 4. Verify indexes exist
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments')
ORDER BY tablename, indexname;

-- 5. Check if any table has missing indexes on foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  tc.constraint_name,
  tc.constraint_type
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments')
ORDER BY tc.table_name;

-- 6. Verify no public access to tables (RLS should block direct access)
-- This should return 0 rows if RLS is properly configured
-- SELECT * FROM users LIMIT 1; -- Unauthenticated - should return error or empty

-- 7. List all functions
SELECT
  routine_name,
  data_type AS return_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND specific_name LIKE '%auth%'
ORDER BY routine_name;

-- ============================================
-- Expected Results Summary:
-- ============================================
--
-- Tables with RLS enabled: 6/6
-- - users
-- - briefs
-- - proposals
-- - clients
-- - events
-- - sales_comments
--
-- Expected Policy Count:
-- - users: 2 policies (SELECT, UPDATE)
-- - briefs: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - proposals: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - clients: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - events: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - sales_comments: 4 policies (SELECT, INSERT, UPDATE, DELETE)
--
-- Total: 22 policies
--
-- Expected Indexes:
-- - idx_users_email ON users(email)
-- - idx_briefs_created_by ON briefs(created_by)
-- - idx_briefs_status ON briefs(status)
-- - idx_proposals_created_by ON proposals(created_by)
-- - idx_proposals_status ON proposals(status)
-- - idx_clients_created_by ON clients(created_by)
-- - idx_events_created_by ON events(created_by)
-- - idx_events_date ON events(event_date)
-- - idx_sales_comments_proposal ON sales_comments(proposal_id)
-- - idx_sales_comments_user ON sales_comments(user_id)
--
-- ============================================
-- If results don't match expectations,
-- run supabase/schema-complete.sql to apply the correct schema
-- ============================================
