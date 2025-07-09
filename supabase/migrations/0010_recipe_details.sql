-- Migration: Drop old ingredients field from recipes table
ALTER TABLE recipes DROP COLUMN IF EXISTS ingredients;

-- Migration: Add detailed fields to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS ingredients jsonb;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS instructions jsonb;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS details jsonb; 