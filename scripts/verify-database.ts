/**
 * PitchFlow Database Verification Script
 *
 * This script verifies that all RLS policies are properly configured
 * Run with: npx tsx scripts/verify-database.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfzeixmnudtshvscigwm.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN || ''

interface VerificationResult {
  table: string
  rlsEnabled: boolean
  policiesCount: number
  indexesCount: number
  status: 'pass' | 'fail' | 'warning'
  message: string
}

async function verifyDatabase() {
  console.log('\n🔍 PitchFlow Database Verification\n')
  console.log('='.repeat(50))

  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set in environment')
    console.log('\n💡 To run this script:')
    console.log('   1. Go to Supabase Dashboard > Settings > API')
    console.log('   2. Copy the "service_role" secret key')
    console.log('   3. Set it as SUPABASE_SERVICE_ROLE_KEY in your .env.local')
    console.log('   4. Run this script again\n')
    return
  }

  // Create admin client with service role
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const results: VerificationResult[] = []

  // Tables to verify
  const tables = ['users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments']

  console.log('📋 Checking tables and RLS policies...\n')

  for (const table of tables) {
    console.log(`  Checking ${table}...`)

    try {
      // Check if table exists
      const { data: tableData, error: tableError } = await supabase.rpc('get_table_info', {
        table_name: table,
      }).catch(() => null)

      // Get RLS status
      const { data: rlsData, error: rlsError } = await supabase.rpc('pg_get_table_rls_status', {
        table_name: table,
      }).catch(() => null)

      // Get policies count
      const { data: policiesData, error: policiesError } = await supabase.rpc('count_policies', {
        table_name: table,
      }).catch(() => null)

      // Get indexes count
      const { data: indexesData, error: indexesError } = await supabase.rpc('count_indexes', {
        table_name: table,
      }).catch(() => null)

      const result: VerificationResult = {
        table,
        rlsEnabled: rlsData?.rowsecurity || false,
        policiesCount: policiesData?.count || 0,
        indexesCount: indexesData?.count || 0,
        status: 'warning',
        message: '',
      }

      // Determine status
      if (!rlsData?.rowsecurity) {
        result.status = 'fail'
        result.message = 'RLS not enabled'
      } else if ((policiesData?.count || 0) < 2) {
        result.status = 'fail'
        result.message = 'Missing policies'
      } else if ((indexesData?.count || 0) < 1) {
        result.status = 'warning'
        result.message = 'Missing indexes'
      } else {
        result.status = 'pass'
        result.message = 'OK'
      }

      results.push(result)
    } catch (error: any) {
      results.push({
        table,
        rlsEnabled: false,
        policiesCount: 0,
        indexesCount: 0,
        status: 'fail',
        message: error.message || 'Failed to check',
      })
    }
  }

  // Print results
  console.log('\n📊 Verification Results:\n')

  let passCount = 0
  let failCount = 0
  let warningCount = 0

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
    const status = result.status === 'pass' ? 'PASS' : result.status === 'warning' ? 'WARN' : 'FAIL'

    console.log(`  ${icon} ${result.table}`)
    console.log(`     Status: ${status}`)
    console.log(`     RLS Enabled: ${result.rlsEnabled ? 'Yes' : 'No'}`)
    console.log(`     Policies: ${result.policiesCount}`)
    console.log(`     Indexes: ${result.indexesCount}`)
    if (result.message !== 'OK') {
      console.log(`     Message: ${result.message}`)
    }
    console.log()

    if (result.status === 'pass') passCount++
    else if (result.status === 'warning') warningCount++
    else failCount++
  }

  // Summary
  console.log('='.repeat(50))
  console.log('\n📈 Summary:\n')
  console.log(`  ✅ Pass:    ${passCount}`)
  console.log(`  ⚠️  Warning: ${warningCount}`)
  console.log(`  ❌ Fail:    ${failCount}`)
  console.log()

  if (failCount > 0) {
    console.log('❌ Some checks failed. Please run the following SQL in Supabase:')
    console.log('   1. Open Supabase Dashboard')
    console.log('   2. Go to SQL Editor')
    console.log('   3. Run the contents of supabase/schema-complete.sql')
    console.log()

    // Provide direct link
    console.log(`   Direct link: ${SUPABASE_URL.replace('.supabase.co', '.supabase.com/project/default/sql?new')}`)
  }

  if (warningCount > 0) {
    console.log('⚠️  Some tables have warnings. Consider adding indexes for better performance.')
    console.log()

    // Print SQL to add indexes
    console.log('   To add missing indexes, run this SQL:')
    console.log(`
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
   CREATE INDEX IF NOT EXISTS idx_briefs_created_by ON briefs(created_by);
   CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);
   CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
   CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
   CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
   CREATE INDEX IF NOT EXISTS idx_sales_comments_proposal ON sales_comments(proposal_id);
   CREATE INDEX IF NOT EXISTS idx_sales_comments_user ON sales_comments(user_id);
    `)
  }

  if (failCount === 0 && warningCount === 0) {
    console.log('🎉 All checks passed! Database is properly configured.')
  }

  console.log()
}

// Alternative: Simple SQL-based verification
async function runSimpleVerification() {
  console.log('\n📝 Quick SQL Verification\n')
  console.log('Run these queries in Supabase SQL Editor:\n')

  console.log('-- 1. Check RLS enabled on all tables')
  console.log(`
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments');
`)

  console.log('-- 2. Count policies per table')
  console.log(`
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'briefs', 'proposals', 'clients', 'events', 'sales_comments')
GROUP BY tablename;
`)

  console.log('-- 3. Verify no public access')
  console.log(`
-- This should return error or empty rows if RLS is working
SELECT COUNT(*) FROM users LIMIT 1;
`)
}

// Export for use
export { verifyDatabase, runSimpleVerification }

// Run if called directly
if (require.main === module) {
  verifyDatabase().catch(console.error)
}
