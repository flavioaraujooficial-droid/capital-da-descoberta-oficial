/*
# Add territory column to votes table

1. Modified Tables
- `votes`
  - Added `territory` (text, nullable) — stores the Bahia Territory of Identity selected by the voter at the time of voting (e.g. "Litoral Norte e Agreste Baiano").

2. Security
- No policy changes. The existing public CRUD policies already cover the new column since it's nullable and inserted by the anon client.

3. Notes
- Column is nullable so existing seed rows remain valid.
- No data loss: this is an additive ALTER only.
*/

ALTER TABLE votes ADD COLUMN IF NOT EXISTS territory text;

-- Backfill existing rows with the default territory
UPDATE votes SET territory = 'Litoral Norte e Agreste Baiano' WHERE territory IS NULL;
