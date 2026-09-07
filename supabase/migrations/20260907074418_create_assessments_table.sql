/*
# Create assessments table for Q-Dx health risk assessments

1. New Tables
- `assessments`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users, defaults to authenticated user)
  - `age` (integer)
  - `gender` (text)
  - `bmi` (numeric)
  - `blood_pressure_systolic` (integer)
  - `blood_pressure_diastolic` (integer)
  - `heart_rate` (integer)
  - `glucose` (integer, mg/dL)
  - `cholesterol` (integer, mg/dL)
  - `smoking` (boolean)
  - `physical_activity` (text — low/moderate/high)
  - `sleep_hours` (numeric)
  - `alcohol` (text — none/occasional/moderate/heavy)
  - `family_history` (boolean)
  - `risk_score` (integer, 0-100)
  - `risk_level` (text — low/moderate/high)
  - `classical_score` (numeric)
  - `quantum_score` (numeric)
  - `risk_factors` (jsonb — key contributing factors)
  - `model_metrics` (jsonb — classical vs quantum comparison metrics)
  - `created_at` (timestamp)

2. Security
- Enable RLS on `assessments`.
- Owner-scoped CRUD: each authenticated user can only access their own assessment rows.
- 4 separate policies (select/insert/update/delete) scoped to authenticated users.
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  age integer,
  gender text,
  bmi numeric,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  heart_rate integer,
  glucose integer,
  cholesterol integer,
  smoking boolean DEFAULT false,
  physical_activity text DEFAULT 'moderate',
  sleep_hours numeric,
  alcohol text DEFAULT 'none',
  family_history boolean DEFAULT false,
  risk_score integer DEFAULT 0,
  risk_level text DEFAULT 'low',
  classical_score numeric DEFAULT 0,
  quantum_score numeric DEFAULT 0,
  risk_factors jsonb DEFAULT '[]'::jsonb,
  model_metrics jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_assessments" ON assessments;
CREATE POLICY "select_own_assessments" ON assessments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_assessments" ON assessments;
CREATE POLICY "insert_own_assessments" ON assessments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_assessments" ON assessments;
CREATE POLICY "update_own_assessments" ON assessments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_assessments" ON assessments;
CREATE POLICY "delete_own_assessments" ON assessments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
