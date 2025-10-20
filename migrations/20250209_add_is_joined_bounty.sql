-- Migration: Ensure "Bounties" table has the is_joined_bounty column used by the indexer
-- Safe to rerun; only modifies schema if the column is missing.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'Bounties'
      AND column_name = 'is_joined_bounty'
  ) THEN
    ALTER TABLE "Bounties"
      ADD COLUMN "is_joined_bounty" boolean DEFAULT false;
  END IF;
END $$;

-- Backfill any existing rows that might have NULL values.
UPDATE "Bounties"
SET "is_joined_bounty" = false
WHERE "is_joined_bounty" IS NULL;
