import React, { useState } from 'react';
import { supabase, Patient } from '../lib/supabase';
import { UserPlus, Loader2 } from 'lucide-react';

interface PatientRegistrationFormProps {
  onPatientRegistered: (patient: Patient) => void;
}

export const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  onPatientRegistered,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: patientNumberData, error: functionError } = await supabase
        .rpc('generate_patient_number');

      if (functionError) throw functionError;

      const { data, error: insertError } = await supabase
        .from('patients')
        .insert({
          patient_number: patientNumberData,
          full_name: formData.full_name,
          age: parseInt(formData.age),
          gender: formData.gender,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setFormData({ full_name: '', age: '', gender: '' });
      onPatientRegistered(data as Patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Patient Registration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name *
          </label>
          <input
            type="text"
            id="full_name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter patient full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              id="age"
              required
              min="0"
              max="150"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Register Patient
            </>
          )}
        </button>
      </form>
    </div>
  );
};
