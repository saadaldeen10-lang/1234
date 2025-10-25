import React, { useState, useEffect } from 'react';
import { supabase, Patient } from '../lib/supabase';
import { ClipboardCheck, Loader2, Save } from 'lucide-react';

interface GeneralPatientOrientationProps {
  patient: Patient;
}

interface OrientationQuestions {
  [key: string]: boolean;
}

const ORIENTATION_QUESTIONS = [
  { key: 'oriented_to_person', label: 'Oriented to Person' },
  { key: 'oriented_to_place', label: 'Oriented to Place' },
  { key: 'oriented_to_time', label: 'Oriented to Time' },
  { key: 'oriented_to_situation', label: 'Oriented to Situation' },
  { key: 'responds_to_verbal_commands', label: 'Responds to Verbal Commands' },
  { key: 'follows_simple_instructions', label: 'Follows Simple Instructions' },
  { key: 'recognizes_family_members', label: 'Recognizes Family Members' },
  { key: 'aware_of_medical_condition', label: 'Aware of Medical Condition' },
  { key: 'understands_treatment_plan', label: 'Understands Treatment Plan' },
  { key: 'appropriate_emotional_response', label: 'Appropriate Emotional Response' },
];

export const GeneralPatientOrientation: React.FC<GeneralPatientOrientationProps> = ({ patient }) => {
  const [recordId, setRecordId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<OrientationQuestions>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadOrientation();
  }, [patient.id]);

  const loadOrientation = async () => {
    setInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('general_patient_orientation')
        .select('*')
        .eq('patient_id', patient.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRecordId(data.id);
        setQuestions(data.questions || {});
      } else {
        const initialQuestions: OrientationQuestions = {};
        ORIENTATION_QUESTIONS.forEach(q => {
          initialQuestions[q.key] = false;
        });
        setQuestions(initialQuestions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orientation data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setQuestions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (recordId) {
        const { error: updateError } = await supabase
          .from('general_patient_orientation')
          .update({ questions })
          .eq('id', recordId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('general_patient_orientation')
          .insert({
            patient_id: patient.id,
            questions,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setRecordId(data.id);
      }

      setSuccess('Orientation assessment saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save orientation assessment');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardCheck className="w-6 h-6 text-orange-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">General Patient Orientation</h2>
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

      <div className="space-y-3 mb-6">
        {ORIENTATION_QUESTIONS.map((question) => {
          const isChecked = questions[question.key] || false;
          return (
            <div
              key={question.key}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition cursor-pointer"
              onClick={() => handleToggle(question.key)}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center border-2 rounded transition ${
                  isChecked
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-300 bg-white text-transparent'
                }`}
              >
                {isChecked ? '✓' : ' '}
              </div>
              <label className="flex-1 text-gray-700 font-medium cursor-pointer">
                {question.label}
              </label>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Orientation Assessment
          </>
        )}
      </button>
    </div>
  );
};
