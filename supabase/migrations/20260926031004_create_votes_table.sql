/*
# Create votes table for cultural campaign

1. New Tables
- `votes`
  - `id` (uuid, primary key)
  - `artist_name` (text, not null) — name of the voted artist
  - `song_name` (text, not null) — name of the song
  - `decade` (text, not null) — decade label e.g. "Anos 80"
  - `image_url` (text) — thumbnail/cover URL for the artist
  - `voter_name` (text, not null) — name of the person voting
  - `city` (text, not null) — city in Bahia
  - `instagram` (text) — instagram handle (optional)
  - `is_custom` (boolean, default false) — true if user typed a new entry not in the curated list
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `votes`.
- Public read/write (anon + authenticated) — this is a public campaign where anyone can vote and see results.
*/

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name text NOT NULL,
  song_name text NOT NULL,
  decade text NOT NULL,
  image_url text,
  voter_name text NOT NULL,
  city text NOT NULL,
  instagram text,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_votes" ON votes;
CREATE POLICY "public_select_votes" ON votes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_votes" ON votes;
CREATE POLICY "public_insert_votes" ON votes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_votes" ON votes;
CREATE POLICY "public_update_votes" ON votes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_votes" ON votes;
CREATE POLICY "public_delete_votes" ON votes FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_artist_name ON votes (artist_name);
