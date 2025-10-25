import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Patient {
  id: string;
  patient_number: string;
  full_name: string;
  age: number;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface PatientHistory {
  id: string;
  patient_id: string;
  section_type: string;
  content: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export const SECTION_TYPES = [
  { value: 'complains', label: 'Complains & Visit Form' },
  { value: 'examination', label: 'Examination' },
  { value: 'investigations', label: 'Investigations & Reports' },
  { value: 'treatment_plan', label: 'Treatment Plan' },
  { value: 'service_request', label: 'Service Request' },
  { value: 'education', label: 'Education' },
  { value: 'medication_request', label: 'Medication Request' },
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'radiology_reports', label: 'Radiology Reports' },
] as const;
