/*
  # Update RLS Policies for Public Access

  ## Changes
  - Drop existing restrictive RLS policies that require authentication
  - Create new policies that allow public access for all operations
  - This enables the patient management system to work without authentication

  ## Security Note
  In a production environment, you would want to implement proper authentication
  and restrict access accordingly. This configuration is for a simpler use case
  where the application needs to be accessible without user login.
*/

-- Drop existing policies for patients table
DROP POLICY IF EXISTS "Allow authenticated users to view all patients" ON patients;
DROP POLICY IF EXISTS "Allow authenticated users to insert patients" ON patients;
DROP POLICY IF EXISTS "Allow authenticated users to update patients" ON patients;
DROP POLICY IF EXISTS "Allow authenticated users to delete patients" ON patients;

-- Drop existing policies for patient_history table
DROP POLICY IF EXISTS "Allow authenticated users to view patient history" ON patient_history;
DROP POLICY IF EXISTS "Allow authenticated users to insert patient history" ON patient_history;
DROP POLICY IF EXISTS "Allow authenticated users to update patient history" ON patient_history;
DROP POLICY IF EXISTS "Allow authenticated users to delete patient history" ON patient_history;

-- Create new policies for patients table with public access
CREATE POLICY "Allow public to view all patients"
  ON patients FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert patients"
  ON patients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update patients"
  ON patients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete patients"
  ON patients FOR DELETE
  USING (true);

-- Create new policies for patient_history table with public access
CREATE POLICY "Allow public to view patient history"
  ON patient_history FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert patient history"
  ON patient_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update patient history"
  ON patient_history FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete patient history"
  ON patient_history FOR DELETE
  USING (true);