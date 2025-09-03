# ENB Bounty Database Migrations to be used only when using Superbase

This directory contains database migration files for setting up the ENB Bounty schema with proper RLS (Row Level Security) policies.

## Files

### `setup_rls_policies_complete.sql`

A comprehensive migration that sets up:

- ✅ **Ban table creation** (if missing)
- ✅ **RLS enabled** on all main tables
- ✅ **Complete RLS policies** for all tables
- ✅ **Foreign key constraints**
- ✅ **Idempotent** (safe to run multiple times)

## Usage

### Option 1: Via Supabase Dashboard

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `setup_rls_policies_complete.sql`
4. Make sure you're connected to the correct schema
5. Run the migration

### Option 2: Via psql command line

```bash
# Connect to your database and run the migration
psql "postgresql://postgres:password@host:port/database" \
  -v ON_ERROR_STOP=1 \
  -c "SET search_path TO 'your-schema-name';" \
  -f migrations/setup_rls_policies_complete.sql
```

### Option 3: Via Supabase CLI

```bash
# If you have Supabase CLI set up
supabase db reset --schema your-schema-name
# Then run the migration file
```

## What This Migration Does

### 1. Creates Missing Tables

- Creates `Ban` table with proper structure and constraints
- Sets up sequences and foreign keys

### 2. Enables RLS Security

Enables Row Level Security on all main tables:

- `Bounties`
- `Claims`
- `Users`
- `Leaderboard`
- `ParticipationsBounties`
- `Transactions`
- `BountyWinners`
- `Votes`
- `SupportedTokens`
- `Ban`

### 3. Applies Standard RLS Policies

Each table gets these policies:

- **Read access**: Public can SELECT
- **Insert access**: Public can INSERT
- **Update access**: Public can UPDATE (where applicable)
- **Delete access**: Public can DELETE (ParticipationsBounties only)

### 4. Verification

- Displays summary of tables and policies created
- Shows success/warning messages
- Counts RLS-enabled tables and policies

## Schema Compatibility

This migration is designed to work with both:

- `public` (original schema)
- `public` (new schema)
- Any future schema following the same pattern

## Safety Features

- **Idempotent**: Safe to run multiple times
- **IF NOT EXISTS**: Won't fail if tables/constraints already exist
- **DROP POLICY IF EXISTS**: Cleans up before recreating policies
- **Error handling**: Includes validation and reporting

## Expected Results

After running successfully, you should see:

```
=============================================================================
ENB BOUNTY RLS SETUP COMPLETE
=============================================================================
Schema: your-schema-name
Tables with RLS enabled: 10
Total RLS policies created: 29
=============================================================================
SUCCESS: All tables and policies configured correctly!
=============================================================================
```

## Troubleshooting

### Missing Tables Error

If you get foreign key errors, ensure these tables exist first:

- `Bounties`
- `Claims`

These are typically created by your Ponder indexer.

### Permission Errors

Ensure your database user has:

- `CREATE` permissions on the schema
- `ALTER` permissions on existing tables
- `USAGE` permissions on the schema

### Schema Not Found

Make sure you're connected to the correct schema:

```sql
SET search_path TO 'your-schema-name';
```

## Customization

To modify the policies:

1. Edit the `setup_rls_policies_complete.sql` file
2. Modify the policy definitions in STEP 4
3. Update the verification counts in STEP 5 if you change the number of policies

## Next Steps

After running this migration:

1. Verify your indexer can connect and write to the database
2. Test that your application can read from the tables
3. Monitor the logs for any RLS-related access issues
