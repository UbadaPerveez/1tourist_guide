/*
# Create destinations table for Tourist Guide app

1. New Tables
- `destinations` — stores Karnataka tourism destinations with scoring data
  - id (uuid, primary key)
  - name (text) — destination name
  - district (text) — district/region within Karnataka
  - region (text) — broader region grouping (Coastal, Northern, Southern, Malnad, etc.)
  - description (text) — full description of the destination
  - image_url (text) — photo URL
  - experience_tags (text[]) — adventure, scenic, beach, heritage, resort, wildlife, spiritual
  - cost_tier (text) — budget, mid, luxury
  - popularity_score (numeric, 1-10) — how well-known/visited
  - quality_score (numeric, 1-10) — intrinsic quality/experience rating
  - sustainability_score (numeric, 1-10) — eco-infrastructure, community involvement, carrying capacity
  - monthly_crowd_pressure (jsonb) — { "1": 7, "2": 5, ... } for each month 1-12, scale 1-10
  - best_months (text[]) — months (as numbers 1-12) that are best to visit
  - latitude (numeric) — approximate latitude
  - longitude (numeric) — approximate longitude
  - estimated_daily_cost (numeric) — estimated cost per person per day in INR
  - nearby_alternatives (jsonb) — array of { name, reason } for lower-crowd alternatives
  - created_at (timestamptz)

2. Security
- Enable RLS on destinations.
- Allow anon + authenticated SELECT (public read, no writes from frontend — data is seeded server-side).
- This is a single-tenant app with no auth; data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL,
  region text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  experience_tags text[] NOT NULL DEFAULT '{}',
  cost_tier text NOT NULL CHECK (cost_tier IN ('budget', 'mid', 'luxury')),
  popularity_score numeric NOT NULL CHECK (popularity_score >= 1 AND popularity_score <= 10),
  quality_score numeric NOT NULL CHECK (quality_score >= 1 AND quality_score <= 10),
  sustainability_score numeric NOT NULL CHECK (sustainability_score >= 1 AND sustainability_score <= 10),
  monthly_crowd_pressure jsonb NOT NULL DEFAULT '{}',
  best_months text[] NOT NULL DEFAULT '{}',
  latitude numeric,
  longitude numeric,
  estimated_daily_cost numeric NOT NULL DEFAULT 0,
  nearby_alternatives jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_destinations" ON destinations;
CREATE POLICY "anon_select_destinations"
ON destinations FOR SELECT
TO anon, authenticated USING (true);
