/*
  # Add General Patient Orientation Table

  ## Overview
  Creates a table to store patient orientation assessment with Q&A format.

  ## New Table

  ### `general_patient_orientation` table
  - `id` (uuid, primary key) - Unique identifier
  - `patient_id` (uuid, foreign key) - References patients table
  - `questions` (jsonb) - Stores questions and their true/false answers
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS)
  - Add policies for public access to manage orientation data

  ## Important Notes
  1. Questions stored as JSONB for flexibility
  2. Each question has a key and boolean value (true/false)
  3. Automatic timestamp updates on record changes
*/

-- Create general_patient_orientation table
CREATE TABLE IF NOT EXISTS general_patient_orientation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  questions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orientation_patient_id ON general_patient_orientation(patient_id);

-- Enable Row Level Security
ALTER TABLE general_patient_orientation ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
CREATE POLICY "Allow public to view orientation"
  ON general_patient_orientation FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert orientation"
  ON general_patient_orientation FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update orientation"
  ON general_patient_orientation FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete orientation"
  ON general_patient_orientation FOR DELETE
  USING (true);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_orientation_updated_at
  BEFORE UPDATE ON general_patient_orientation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();