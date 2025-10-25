import React, { useState, useEffect, useMemo } from 'react';
import { supabase, Patient } from '../lib/supabase';
import { ClipboardList, Loader2, Save } from 'lucide-react';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

interface AdmissionsDischargeFormProps {
  patient: Patient;
}

interface FormData {
  id?: string;
  admission_date: string;
  admission_time: string;
  admission_doctor: string;
  provisional_diagnosis: string;
  treatment_plan: string;
  expected_duration: string;
  doctor_sign_admission: string;
  admission_employee_name: string;
  admission_employee_date: string;
  admission_employee_signature: string;
  admission_employee_stamp: string;
  discharge_date: string;
  discharge_time: string;
  discharge_doctor: string;
  final_diagnosis: string;
  discharge_type: string;
  discharge_authorized_person: string;
  discharge_relative_relation: string;
  discharge_identity: string;
  doctor_sign_discharge: string;
  discharge_employee_name: string;
  discharge_employee_date: string;
  discharge_employee_signature: string;
  discharge_employee_stamp: string;
}

export const AdmissionsDischargeForm: React.FC<AdmissionsDischargeFormProps> = ({ patient }) => {
  const [formData, setFormData] = useState<FormData>({
    admission_date: '',
    admission_time: '',
    admission_doctor: '',
    provisional_diagnosis: '',
    treatment_plan: '',
    expected_duration: '',
    doctor_sign_admission: '',
    admission_employee_name: '',
    admission_employee_date: '',
    admission_employee_signature: '',
    admission_employee_stamp: '',
    discharge_date: '',
    discharge_time: '',
    discharge_doctor: '',
    final_diagnosis: '',
    discharge_type: '',
    discharge_authorized_person: '',
    discharge_relative_relation: '',
    discharge_identity: '',
    doctor_sign_discharge: '',
    discharge_employee_name: '',
    discharge_employee_date: '',
    discharge_employee_signature: '',
    discharge_employee_stamp: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  useUnsavedChanges(hasUnsavedChanges);

  useEffect(() => {
    loadFormData();
  }, [patient.id]);

  const loadFormData = async () => {
    setInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('admissions_discharge')
        .select('*')
        .eq('patient_id', patient.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const loadedData = {
          id: data.id,
          admission_date: data.admission_date || '',
          admission_time: data.admission_time || '',
          admission_doctor: data.admission_doctor || '',
          provisional_diagnosis: data.provisional_diagnosis || '',
          treatment_plan: data.treatment_plan || '',
          expected_duration: data.expected_duration || '',
          doctor_sign_admission: data.doctor_sign_admission || '',
          admission_employee_name: data.admission_employee_name || '',
          admission_employee_date: data.admission_employee_date || '',
          admission_employee_signature: data.admission_employee_signature || '',
          admission_employee_stamp: data.admission_employee_stamp || '',
          discharge_date: data.discharge_date || '',
          discharge_time: data.discharge_time || '',
          discharge_doctor: data.discharge_doctor || '',
          final_diagnosis: data.final_diagnosis || '',
          discharge_type: data.discharge_type || '',
          discharge_authorized_person: data.discharge_authorized_person || '',
          discharge_relative_relation: data.discharge_relative_relation || '',
          discharge_identity: data.discharge_identity || '',
          doctor_sign_discharge: data.doctor_sign_discharge || '',
          discharge_employee_name: data.discharge_employee_name || '',
          discharge_employee_date: data.discharge_employee_date || '',
          discharge_employee_signature: data.discharge_employee_signature || '',
          discharge_employee_stamp: data.discharge_employee_stamp || '',
        };
        setFormData(loadedData);
        setInitialData(loadedData);
      } else {
        setInitialData(formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { id, ...formDataWithoutId } = formData;
      const dataToSave = {
        patient_id: patient.id,
        admission_date: formDataWithoutId.admission_date || null,
        admission_time: formDataWithoutId.admission_time || null,
        admission_doctor: formDataWithoutId.admission_doctor,
        provisional_diagnosis: formDataWithoutId.provisional_diagnosis,
        treatment_plan: formDataWithoutId.treatment_plan,
        expected_duration: formDataWithoutId.expected_duration,
        doctor_sign_admission: formDataWithoutId.doctor_sign_admission,
        admission_employee_name: formDataWithoutId.admission_employee_name,
        admission_employee_date: formDataWithoutId.admission_employee_date || null,
        admission_employee_signature: formDataWithoutId.admission_employee_signature,
        admission_employee_stamp: formDataWithoutId.admission_employee_stamp,
        discharge_date: formDataWithoutId.discharge_date || null,
        discharge_time: formDataWithoutId.discharge_time || null,
        discharge_doctor: formDataWithoutId.discharge_doctor,
        final_diagnosis: formDataWithoutId.final_diagnosis,
        discharge_type: formDataWithoutId.discharge_type,
        discharge_authorized_person: formDataWithoutId.discharge_authorized_person,
        discharge_relative_relation: formDataWithoutId.discharge_relative_relation,
        discharge_identity: formDataWithoutId.discharge_identity,
        doctor_sign_discharge: formDataWithoutId.doctor_sign_discharge,
        discharge_employee_name: formDataWithoutId.discharge_employee_name,
        discharge_employee_date: formDataWithoutId.discharge_employee_date || null,
        discharge_employee_signature: formDataWithoutId.discharge_employee_signature,
        discharge_employee_stamp: formDataWithoutId.discharge_employee_stamp,
      };

      if (formData.id) {
        const { error: updateError } = await supabase
          .from('admissions_discharge')
          .update(dataToSave)
          .eq('id', formData.id);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('admissions_discharge')
          .insert(dataToSave)
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) {
          setFormData(prev => ({ ...prev, id: data.id }));
        }
      }

      setSuccess('Form saved successfully!');
      setInitialData(formData);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to save form: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admissions and Discharge Form</h2>
          <p className="text-sm text-gray-600 mt-1">
            Patient: {patient.full_name} | Number: {patient.patient_number}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span>الدخول Admission</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التاريخ Date
                </label>
                <input
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => handleChange('admission_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الساعة Time
                </label>
                <input
                  type="time"
                  value={formData.admission_time}
                  onChange={(e) => handleChange('admission_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الطبيب المسئول عن الدخول Doctor in charge of admission
              </label>
              <input
                type="text"
                value={formData.admission_doctor}
                onChange={(e) => handleChange('admission_doctor', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provisional Diagnosis
              </label>
              <textarea
                value={formData.provisional_diagnosis}
                onChange={(e) => handleChange('provisional_diagnosis', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treatment Plan
              </label>
              <textarea
                value={formData.treatment_plan}
                onChange={(e) => handleChange('treatment_plan', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                يتوقع مدة البقاء في المستشفى Expected duration of stay in hospital
              </label>
              <input
                type="text"
                value={formData.expected_duration}
                onChange={(e) => handleChange('expected_duration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g., 3 days, 1 week"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ختم وتوقيع الطبيب Dr. Sign.
              </label>
              <input
                type="text"
                value={formData.doctor_sign_admission}
                onChange={(e) => handleChange('doctor_sign_admission', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">مكتب التنويم Admission Office</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الموظف Employee Name
                  </label>
                  <input
                    type="text"
                    value={formData.admission_employee_name}
                    onChange={(e) => handleChange('admission_employee_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التاريخ Date
                  </label>
                  <input
                    type="date"
                    value={formData.admission_employee_date}
                    onChange={(e) => handleChange('admission_employee_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التوقيع Signature
                  </label>
                  <input
                    type="text"
                    value={formData.admission_employee_signature}
                    onChange={(e) => handleChange('admission_employee_signature', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الختم Stamp
                  </label>
                  <input
                    type="text"
                    value={formData.admission_employee_stamp}
                    onChange={(e) => handleChange('admission_employee_stamp', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <span>الخروج Discharge</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الخروج Date of discharge
                </label>
                <input
                  type="date"
                  value={formData.discharge_date}
                  onChange={(e) => handleChange('discharge_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ساعة الخروج Time of discharge
                </label>
                <input
                  type="time"
                  value={formData.discharge_time}
                  onChange={(e) => handleChange('discharge_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الطبيب المسئول عن الخروج Doctor in charge of discharge
              </label>
              <input
                type="text"
                value={formData.discharge_doctor}
                onChange={(e) => handleChange('discharge_doctor', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التشخيص النهائي Final Diagnosis
              </label>
              <textarea
                value={formData.final_diagnosis}
                onChange={(e) => handleChange('final_diagnosis', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع الخروج Type of discharge
              </label>
              <select
                value={formData.discharge_type}
                onChange={(e) => handleChange('discharge_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              >
                <option value="">Select type</option>
                <option value="normal">عادي Normal</option>
                <option value="escape">هروب Escape</option>
                <option value="death">وفاة Death</option>
                <option value="other">أخرى Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المسئول عن خروج المريض Name of person responsible for discharge
                </label>
                <input
                  type="text"
                  value={formData.discharge_authorized_person}
                  onChange={(e) => handleChange('discharge_authorized_person', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صلة القرابة Relative Relation
                </label>
                <input
                  type="text"
                  value={formData.discharge_relative_relation}
                  onChange={(e) => handleChange('discharge_relative_relation', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الهوية Identity
              </label>
              <input
                type="text"
                value={formData.discharge_identity}
                onChange={(e) => handleChange('discharge_identity', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ختم وتوقيع الطبيب Dr. Sign.
              </label>
              <input
                type="text"
                value={formData.doctor_sign_discharge}
                onChange={(e) => handleChange('doctor_sign_discharge', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">مكتب الخروج Discharge Office</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الموظف Employee Name
                  </label>
                  <input
                    type="text"
                    value={formData.discharge_employee_name}
                    onChange={(e) => handleChange('discharge_employee_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التاريخ Date
                  </label>
                  <input
                    type="date"
                    value={formData.discharge_employee_date}
                    onChange={(e) => handleChange('discharge_employee_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التوقيع Signature
                  </label>
                  <input
                    type="text"
                    value={formData.discharge_employee_signature}
                    onChange={(e) => handleChange('discharge_employee_signature', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الختم Stamp
                  </label>
                  <input
                    type="text"
                    value={formData.discharge_employee_stamp}
                    onChange={(e) => handleChange('discharge_employee_stamp', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Form
          </>
        )}
      </button>
    </div>
  );
};
