import React, { useState } from 'react';
import { supabase, Patient } from '../lib/supabase';
import { Search, Loader2, User } from 'lucide-react';

interface PatientSearchProps {
  onPatientFound: (patient: Patient) => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({ onPatientFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a patient number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_number', searchTerm.trim())
        .maybeSingle();

      if (searchError) throw searchError;

      if (!data) {
        setError('No patient found with this number');
      } else {
        onPatientFound(data as Patient);
        setSearchTerm('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Search Patient</h2>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Number
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
            placeholder="Enter patient number (e.g., PT-20251022-0001)"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Search Patient
            </>
          )}
        </button>
      </form>
    </div>
  );
};
