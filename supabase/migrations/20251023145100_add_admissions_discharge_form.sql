/*
  # Add Admissions and Discharge Form Table

  ## Overview
  Creates a table to store patient admission and discharge information with bilingual support.

  ## New Table

  ### `admissions_discharge` table
  - `id` (uuid, primary key) - Unique identifier
  - `patient_id` (uuid, foreign key) - References patients table
  
  ## Admission Fields
  - `admission_date` (date) - Date of admission
  - `admission_time` (time) - Time of admission
  - `admission_doctor` (text) - Doctor in charge of admission
  - `provisional_diagnosis` (text) - Initial diagnosis
  - `treatment_plan` (text) - Treatment plan
  - `expected_duration` (text) - Expected duration of stay
  - `doctor_sign_admission` (text) - Doctor signature/stamp for admission
  - `admission_employee_name` (text) - Employee name processing admission
  - `admission_employee_date` (date) - Employee processing date
  - `admission_employee_signature` (text) - Employee signature
  - `admission_employee_stamp` (text) - Employee stamp
  
  ## Discharge Fields
  - `discharge_date` (date) - Date of discharge
  - `discharge_time` (time) - Time of discharge
  - `discharge_doctor` (text) - Doctor in charge of discharge
  - `final_diagnosis` (text) - Final diagnosis
  - `discharge_type` (text) - Type of discharge (normal, escape, death, other)
  - `discharge_authorized_person` (text) - Name of person responsible for discharge
  - `discharge_relative_relation` (text) - Relation of relative
  - `discharge_identity` (text) - Identity number
  - `doctor_sign_discharge` (text) - Doctor signature/stamp for discharge
  - `discharge_employee_name` (text) - Employee name processing discharge
  - `discharge_employee_date` (date) - Employee processing date
  - `discharge_employee_signature` (text) - Employee signature
  - `discharge_employee_stamp` (text) - Employee stamp
  
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS)
  - Add policies for public access

  ## Important Notes
  1. Supports both admission and discharge information in one record
  2. Bilingual field labels (Arabic/English)
  3. Flexible discharge types for different scenarios
*/

-- Create admissions_discharge table
CREATE TABLE IF NOT EXISTS admissions_discharge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Admission fields
  admission_date date,
  admission_time time,
  admission_doctor text DEFAULT '',
  provisional_diagnosis text DEFAULT '',
  treatment_plan text DEFAULT '',
  expected_duration text DEFAULT '',
  doctor_sign_admission text DEFAULT '',
  admission_employee_name text DEFAULT '',
  admission_employee_date date,
  admission_employee_signature text DEFAULT '',
  admission_employee_stamp text DEFAULT '',
  
  -- Discharge fields
  discharge_date date,
  discharge_time time,
  discharge_doctor text DEFAULT '',
  final_diagnosis text DEFAULT '',
  discharge_type text DEFAULT '',
  discharge_authorized_person text DEFAULT '',
  discharge_relative_relation text DEFAULT '',
  discharge_identity text DEFAULT '',
  doctor_sign_discharge text DEFAULT '',
  discharge_employee_name text DEFAULT '',
  discharge_employee_date date,
  discharge_employee_signature text DEFAULT '',
  discharge_employee_stamp text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admissions_discharge_patient_id ON admissions_discharge(patient_id);

-- Enable Row Level Security
ALTER TABLE admissions_discharge ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
CREATE POLICY "Allow public to view admissions discharge"
  ON admissions_discharge FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert admissions discharge"
  ON admissions_discharge FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update admissions discharge"
  ON admissions_discharge FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete admissions discharge"
  ON admissions_discharge FOR DELETE
  USING (true);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_admissions_discharge_updated_at
  BEFORE UPDATE ON admissions_discharge
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();