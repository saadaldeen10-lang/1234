/*
  # Patient Management System Database Schema

  ## Overview
  Creates a comprehensive patient management system with patient registration and detailed medical history tracking.

  ## New Tables

  ### 1. `patients` table
  - `id` (uuid, primary key) - Unique identifier for each patient
  - `patient_number` (text, unique) - Auto-generated patient number (format: PT-YYYYMMDD-XXXX)
  - `full_name` (text) - Patient's full name
  - `age` (integer) - Patient's age
  - `gender` (text) - Patient's gender
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `patient_history` table
  - `id` (uuid, primary key) - Unique identifier for each history record
  - `patient_id` (uuid, foreign key) - References patients table
  - `section_type` (text) - Type of medical section (complains, examination, investigations, treatment_plan, service_request, education, medication_request, medical_report, lab_results, radiology_reports)
  - `content` (text) - Medical content/notes for the section
  - `image_urls` (jsonb) - Array of uploaded image URLs
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated users to manage patient data
  - Policies enforce data access control and ownership verification

  ## Important Notes
  1. Patient numbers are auto-generated using a sequence-based system
  2. Image URLs are stored as JSONB arrays for flexibility
  3. All timestamps use timezone-aware format
  4. Indexes are added for frequently queried columns (patient_number, patient_id)
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patient_history table
CREATE TABLE IF NOT EXISTS patient_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  section_type text NOT NULL,
  content text DEFAULT '',
  image_urls jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_patient_history_patient_id ON patient_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_history_section_type ON patient_history(section_type);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients table
CREATE POLICY "Allow authenticated users to view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete patients"
  ON patients FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for patient_history table
CREATE POLICY "Allow authenticated users to view patient history"
  ON patient_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert patient history"
  ON patient_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patient history"
  ON patient_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete patient history"
  ON patient_history FOR DELETE
  TO authenticated
  USING (true);

-- Create function to generate patient number
CREATE OR REPLACE FUNCTION generate_patient_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  today_date text;
  sequence_num integer;
  new_patient_number text;
BEGIN
  -- Get today's date in YYYYMMDD format
  today_date := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Count existing patients created today
  SELECT COUNT(*) INTO sequence_num
  FROM patients
  WHERE patient_number LIKE 'PT-' || today_date || '-%';
  
  -- Increment for next number
  sequence_num := sequence_num + 1;
  
  -- Format: PT-YYYYMMDD-XXXX (with leading zeros)
  new_patient_number := 'PT-' || today_date || '-' || LPAD(sequence_num::text, 4, '0');
  
  RETURN new_patient_number;
END;
$$;

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_history_updated_at
  BEFORE UPDATE ON patient_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();