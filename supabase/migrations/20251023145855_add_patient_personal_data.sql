/*
  # Add Patient Personal Data Table

  ## Overview
  Creates a table to store comprehensive patient personal information with bilingual support.

  ## New Table

  ### `patient_personal_data` table
  - `id` (uuid, primary key) - Unique identifier
  - `patient_id` (uuid, foreign key) - References patients table
  
  ## Patient Personal Information
  - `first_name` (text) - First name
  - `middle_name` (text) - Middle name
  - `last_name` (text) - Last name
  - `file_number` (text) - File number
  - `id_number` (text) - National ID number
  - `sex` (text) - Gender (Male/Female)
  - `birth_date` (date) - Date of birth
  - `nationality` (text) - Nationality
  - `marital_status` (text) - Marital status (Single/Married)
  
  ## Address Information
  - `city` (text) - City/Address
  - `area` (text) - Area/District
  - `street` (text) - Street
  - `home_number` (text) - Home number
  - `mobile` (text) - Mobile number
  - `telephone` (text) - Telephone number
  
  ## Data Registration
  - `registration_date` (date) - Registration date
  - `data_register_name` (text) - Name of person who registered the data
  
  ## Relative Information
  - `relative_name` (text) - Relative's full name
  - `relative_relation` (text) - Relation to patient
  - `relative_phone` (text) - Relative's phone number
  - `relative_city` (text) - Relative's city
  - `relative_area` (text) - Relative's area
  - `relative_street` (text) - Relative's street
  - `relative_home_number` (text) - Relative's home number
  - `relative_mobile` (text) - Relative's mobile number
  
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS)
  - Add policies for public access

  ## Important Notes
  1. Comprehensive personal data management
  2. Bilingual field labels (Arabic/English)
  3. Includes both patient and relative information
*/

-- Create patient_personal_data table
CREATE TABLE IF NOT EXISTS patient_personal_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Patient personal information
  first_name text DEFAULT '',
  middle_name text DEFAULT '',
  last_name text DEFAULT '',
  file_number text DEFAULT '',
  id_number text DEFAULT '',
  sex text DEFAULT '',
  birth_date date,
  nationality text DEFAULT '',
  marital_status text DEFAULT '',
  
  -- Address information
  city text DEFAULT '',
  area text DEFAULT '',
  street text DEFAULT '',
  home_number text DEFAULT '',
  mobile text DEFAULT '',
  telephone text DEFAULT '',
  
  -- Data registration
  registration_date date,
  data_register_name text DEFAULT '',
  
  -- Relative information
  relative_name text DEFAULT '',
  relative_relation text DEFAULT '',
  relative_phone text DEFAULT '',
  relative_city text DEFAULT '',
  relative_area text DEFAULT '',
  relative_street text DEFAULT '',
  relative_home_number text DEFAULT '',
  relative_mobile text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_patient_personal_data_patient_id ON patient_personal_data(patient_id);

-- Enable Row Level Security
ALTER TABLE patient_personal_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
CREATE POLICY "Allow public to view patient personal data"
  ON patient_personal_data FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert patient personal data"
  ON patient_personal_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update patient personal data"
  ON patient_personal_data FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete patient personal data"
  ON patient_personal_data FOR DELETE
  USING (true);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_patient_personal_data_updated_at
  BEFORE UPDATE ON patient_personal_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();