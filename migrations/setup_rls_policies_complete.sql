-- Complete RLS Setup Migration for ENB Bounty Schema
-- This migration sets up all RLS policies and creates the Ban table
-- Usage: Run this on any new schema to replicate the complete security setup

-- =============================================================================
-- STEP 1: Create Ban table (if it doesn't exist)
-- =============================================================================

-- Create the sequence for the Ban table id column
CREATE SEQUENCE IF NOT EXISTS "Ban_id_seq" 
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Create Ban table with same structure as public
CREATE TABLE IF NOT EXISTS "Ban" (
    id integer NOT NULL DEFAULT nextval('"Ban_id_seq"'::regclass),
    chain_id integer NOT NULL,
    bounty_id integer,
    banned_by text NOT NULL,
    banned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    claim_id integer
);

-- Set the sequence ownership
ALTER SEQUENCE "Ban_id_seq" OWNED BY "Ban".id;

-- Create primary key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Ban_pkey') THEN
        ALTER TABLE "Ban" ADD CONSTRAINT "Ban_pkey" PRIMARY KEY (id);
    END IF;
END $$;

-- Create foreign key constraints if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Ban_bounty_fkey') THEN
        ALTER TABLE "Ban" 
        ADD CONSTRAINT "Ban_bounty_fkey" 
        FOREIGN KEY (bounty_id, chain_id) 
        REFERENCES "Bounties"(id, chain_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Ban_claim_fkey') THEN
        ALTER TABLE "Ban" 
        ADD CONSTRAINT "Ban_claim_fkey" 
        FOREIGN KEY (claim_id, chain_id) 
        REFERENCES "Claims"(id, chain_id);
    END IF;
END $$;

-- =============================================================================
-- STEP 2: Enable RLS on all main tables
-- =============================================================================

ALTER TABLE "Bounties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Claims" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Leaderboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ParticipationsBounties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BountyWinners" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Votes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportedTokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ban" ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STEP 3: Drop existing policies (to avoid conflicts on re-run)
-- =============================================================================

-- Drop policies for Bounties
DROP POLICY IF EXISTS "Enable read access for all users" ON "Bounties";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Bounties";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "Bounties";

-- Drop policies for Claims
DROP POLICY IF EXISTS "Enable read access for all users" ON "Claims";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Claims";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "Claims";

-- Drop policies for Users
DROP POLICY IF EXISTS "Enable read access for all users" ON "Users";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Users";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "Users";

-- Drop policies for Leaderboard
DROP POLICY IF EXISTS "Enable read access for all users" ON "Leaderboard";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Leaderboard";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "Leaderboard";

-- Drop policies for ParticipationsBounties
DROP POLICY IF EXISTS "Enable read access for all users" ON "ParticipationsBounties";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "ParticipationsBounties";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "ParticipationsBounties";
DROP POLICY IF EXISTS "Enable delete for authenticated users and service role" ON "ParticipationsBounties";

-- Drop policies for Transactions
DROP POLICY IF EXISTS "Enable read access for all users" ON "Transactions";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Transactions";

-- Drop policies for BountyWinners
DROP POLICY IF EXISTS "Enable read access for all users" ON "BountyWinners";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "BountyWinners";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "BountyWinners";

-- Drop policies for Votes
DROP POLICY IF EXISTS "Enable read access for all users" ON "Votes";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Votes";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "Votes";

-- Drop policies for SupportedTokens
DROP POLICY IF EXISTS "Enable read access for all users" ON "SupportedTokens";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "SupportedTokens";
DROP POLICY IF EXISTS "Enable update for authenticated users and service role" ON "SupportedTokens";

-- Drop policies for Ban
DROP POLICY IF EXISTS "Enable read access for all users" ON "Ban";
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON "Ban";

-- =============================================================================
-- STEP 4: Create RLS policies for all tables
-- =============================================================================

-- ===== BOUNTIES TABLE =====
CREATE POLICY "Enable read access for all users" ON "Bounties"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Bounties"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "Bounties"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== CLAIMS TABLE =====
CREATE POLICY "Enable read access for all users" ON "Claims"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Claims"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "Claims"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== USERS TABLE =====
CREATE POLICY "Enable read access for all users" ON "Users"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Users"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "Users"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== LEADERBOARD TABLE =====
CREATE POLICY "Enable read access for all users" ON "Leaderboard"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Leaderboard"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "Leaderboard"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== PARTICIPATIONSBOUNTIES TABLE =====
CREATE POLICY "Enable read access for all users" ON "ParticipationsBounties"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "ParticipationsBounties"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "ParticipationsBounties"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

CREATE POLICY "Enable delete for authenticated users and service role" ON "ParticipationsBounties"
    AS PERMISSIVE FOR DELETE
    TO public
    USING (true);

-- ===== TRANSACTIONS TABLE =====
CREATE POLICY "Enable read access for all users" ON "Transactions"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Transactions"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

-- ===== BOUNTYWINNERS TABLE =====
CREATE POLICY "Enable read access for all users" ON "BountyWinners"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "BountyWinners"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "BountyWinners"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== VOTES TABLE =====
CREATE POLICY "Enable read access for all users" ON "Votes"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Votes"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "Votes"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== SUPPORTEDTOKENS TABLE =====
CREATE POLICY "Enable read access for all users" ON "SupportedTokens"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "SupportedTokens"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users and service role" ON "SupportedTokens"
    AS PERMISSIVE FOR UPDATE
    TO public
    USING (true);

-- ===== BAN TABLE =====
CREATE POLICY "Enable read access for all users" ON "Ban"
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users and service role" ON "Ban"
    AS PERMISSIVE FOR INSERT
    TO public
    WITH CHECK (true);

-- =============================================================================
-- STEP 5: Verification - Display summary
-- =============================================================================

DO $$ 
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Count tables with RLS enabled
    SELECT COUNT(*) INTO table_count
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = current_schema()
    AND t.tablename IN ('Bounties', 'Claims', 'Users', 'Leaderboard', 'ParticipationsBounties', 
                       'Transactions', 'BountyWinners', 'Votes', 'SupportedTokens', 'Ban')
    AND c.relrowsecurity = true;
    
    -- Count policies created
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = current_schema()
    AND tablename IN ('Bounties', 'Claims', 'Users', 'Leaderboard', 'ParticipationsBounties', 
                     'Transactions', 'BountyWinners', 'Votes', 'SupportedTokens', 'Ban');
    
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'ENB BOUNTY RLS SETUP COMPLETE';
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'Schema: %', current_schema();
    RAISE NOTICE 'Tables with RLS enabled: %', table_count;
    RAISE NOTICE 'Total RLS policies created: %', policy_count;
    RAISE NOTICE '=============================================================================';
    
    IF table_count = 10 AND policy_count >= 27 THEN
        RAISE NOTICE 'SUCCESS: All tables and policies configured correctly!';
    ELSE
        RAISE NOTICE 'WARNING: Expected 10 tables and ~29 policies. Please check configuration.';
    END IF;
    
    RAISE NOTICE '=============================================================================';
END $$;
