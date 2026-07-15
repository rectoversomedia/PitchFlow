-- ============================================
-- PitchFlow Complete Seed Data
-- Run this after schema-complete.sql
-- ============================================

-- ============================================
-- DEMO USERS (with hashed passwords)
-- Password for all: pitchflow123
-- ============================================

-- First, generate bcrypt hashes for demo passwords
-- Using bcrypt with 12 rounds

-- Demo users with password hash (pitchflow123)
INSERT INTO users (id, email, name, role, password_hash) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'supervisor@pitchflow.app', 'Demo Supervisor', 'Supervisor', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWPQFQBLBEO'),
  ('a2222222-2222-2222-2222-222222222222', 'sales@pitchflow.app', 'Demo Sales', 'Sales', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWPQFQBLBEO'),
  ('a3333333-3333-3333-3333-333333333333', 'acs@pitchflow.app', 'Demo ACS', 'ACS', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWPQFQBLBEO')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- ============================================
-- SAMPLE BRIEFS
-- ============================================

INSERT INTO briefs (brand_name, pic_sales, program, industry_category, objective, target_audience, budget_range, status, created_by) VALUES
  ('Indomie', 'Budi Santoso', 'Mie Instan Giveaway', 'Food & Beverage', 'Brand awareness untuk kalangan mahasiswa', 'Mahasiswa 18-25 tahun', 'Rp 50-100 juta', 'new', 'a1111111-1111-1111-1111-111111111111'),
  ('Aqua', 'Siti Rahayu', 'Healthy Lifestyle Campaign', 'Beverage', 'Promosi gaya hidup sehat', 'Ibu rumah tangga 25-45 tahun', 'Rp 100-200 juta', 'in_review', 'a1111111-1111-1111-1111-111111111111'),
  ('Samsung Indonesia', 'Ahmad Fauzi', 'Galaxy Unpacked Coverage', 'Electronics', 'Product launch awareness', 'Tech enthusiasts 20-35 tahun', 'Rp 200-500 juta', 'in_progress', 'a2222222-2222-2222-2222-222222222222'),
  ('Wardah Cosmetics', 'Diana Putri', 'Beauty Talk Show', 'Cosmetics', 'Brand positioning di segment Millenials', 'Wanita 20-35 tahun', 'Rp 150-300 juta', 'new', 'a2222222-2222-2222-2222-222222222222'),
  ('Gojek Indonesia', 'Rizky Pratama', 'GoFood Festival', 'Transportation/Tech', 'GoFood promotion and engagement', 'Urban millennials 20-40 tahun', 'Rp 500 juta - 1 miliar', 'completed', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE PROPOSALS
-- ============================================

INSERT INTO proposals (title, brand_name, pic_sales, program, industry, status, result, created_by) VALUES
  ('Indomie Sponsorship Proposal 2026', 'Indomie', 'Budi Santoso', 'Mie Instan Giveaway', 'Food & Beverage', 'new_brief', NULL, 'a1111111-1111-1111-1111-111111111111'),
  ('Samsung Galaxy Launch Coverage', 'Samsung Indonesia', 'Ahmad Fauzi', 'Tech Review Program', 'Electronics', 'drafting', NULL, 'a2222222-2222-2222-2222-222222222222'),
  ('Wardah Beauty Partnership', 'Wardah Cosmetics', 'Diana Putri', 'Beauty Talk Show', 'Cosmetics', 'need_input', NULL, 'a2222222-2222-2222-2222-222222222222'),
  ('GoFood Festival Sponsorship', 'Gojek Indonesia', 'Rizky Pratama', 'Food Festival Coverage', 'Transportation/Tech', 'ready', 'won', 'a3333333-3333-3333-3333-333333333333'),
  ('Aqua Healthy Life Campaign', 'Aqua', 'Siti Rahayu', 'Lifestyle Program', 'Beverage', 'revised', NULL, 'a1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE CLIENTS
-- ============================================

INSERT INTO clients (name, brand_name, email, phone, company, industry, created_by) VALUES
  ('Budi Santoso', 'Indomie', 'budi@indomie.co.id', '+6281234567890', 'PT Indofood CBP', 'Food & Beverage', 'a1111111-1111-1111-1111-111111111111'),
  ('Siti Rahayu', 'Aqua', 'siti@aqua.com', '+6289876543210', 'PT Danone Waters', 'Beverage', 'a1111111-1111-1111-1111-111111111111'),
  ('Ahmad Fauzi', 'Samsung', 'ahmad@samsung.co.id', '+6281122334455', 'PT Samsung Electronics', 'Electronics', 'a2222222-2222-2222-2222-222222222222'),
  ('Diana Putri', 'Wardah', 'diana@wardah.co.id', '+6289988776655', 'PT Paragon Technology', 'Cosmetics', 'a2222222-2222-2222-2222-222222222222'),
  ('Rizky Pratama', 'Gojek', 'rizky@gojek.com', '+6285566778899', 'PT Gojek Indonesia', 'Transportation/Tech', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE EVENTS
-- ============================================

INSERT INTO events (title, description, event_date, event_time, event_type, created_by) VALUES
  ('Pitch Meeting - Indomie', 'Present sponsorship proposal to Indomie team', CURRENT_DATE + INTERVAL '7 days', '10:00', 'presentation', 'a1111111-1111-1111-1111-111111111111'),
  ('Brief Deadline - Samsung', 'Submit final proposal for Samsung coverage', CURRENT_DATE + INTERVAL '3 days', '17:00', 'deadline', 'a2222222-2222-2222-2222-222222222222'),
  ('Client Call - Wardah', 'Follow up discussion with Wardah marketing team', CURRENT_DATE + INTERVAL '2 days', '14:00', 'meeting', 'a2222222-2222-2222-2222-222222222222'),
  ('Gojek Milestone', 'First episode airing - GoFood Festival', CURRENT_DATE + INTERVAL '14 days', '19:00', 'milestone', 'a3333333-3333-3333-3333-333333333333'),
  ('Quarterly Review', 'Review Q2 performance with sales team', CURRENT_DATE + INTERVAL '30 days', '09:00', 'meeting', 'a1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE SALES COMMENTS
-- ============================================

INSERT INTO sales_comments (proposal_id, user_id, content) VALUES
  ((SELECT id FROM proposals WHERE title = 'Indomie Sponsorship Proposal 2026' LIMIT 1), 'a1111111-1111-1111-1111-111111111111', 'Great concept! The integration ideas are very creative.'),
  ((SELECT id FROM proposals WHERE title = 'Samsung Galaxy Launch Coverage' LIMIT 1), 'a2222222-2222-2222-2222-222222222222', 'Please add more detail about the tech specs coverage.'),
  ((SELECT id FROM proposals WHERE title = 'Wardah Beauty Partnership' LIMIT 1), 'a3333333-3333-3333-3333-333333333333', 'Budget needs to be revised based on market rates.')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inserted data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Briefs', COUNT(*) FROM briefs
UNION ALL
SELECT 'Proposals', COUNT(*) FROM proposals
UNION ALL
SELECT 'Clients', COUNT(*) FROM clients
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Comments', COUNT(*) FROM sales_comments;
