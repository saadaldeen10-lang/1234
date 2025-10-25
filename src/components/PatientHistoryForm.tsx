import React, { useState, useEffect } from 'react';
import { supabase, Patient, PatientHistory, SECTION_TYPES } from '../lib/supabase';
import { FileText, Loader2, Upload, X, Save } from 'lucide-react';

interface PatientHistoryFormProps {
  patient: Patient;
}

interface SectionData {
  id?: string;
  content: string;
  image_urls: string[];
}

export const PatientHistoryForm: React.FC<PatientHistoryFormProps> = ({ patient }) => {
  const [sections, setSections] = useState<Record<string, SectionData>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPatientHistory();
  }, [patient.id]);

  const loadPatientHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_history')
        .select('*')
        .eq('patient_id', patient.id);

      if (error) throw error;

      const sectionsData: Record<string, SectionData> = {};
      SECTION_TYPES.forEach(type => {
        const existingRecord = data?.find((record: PatientHistory) => record.section_type === type.value);
        sectionsData[type.value] = {
          id: existingRecord?.id,
          content: existingRecord?.content || '',
          image_urls: existingRecord?.image_urls || [],
        };
      });

      setSections(sectionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient history');
    }
  };

  const handleContentChange = (sectionType: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        content,
      },
    }));
  };

  const handleImageUpload = async (sectionType: string, file: File) => {
    setUploading(sectionType);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSections(prev => ({
          ...prev,
          [sectionType]: {
            ...prev[sectionType],
            image_urls: [...(prev[sectionType]?.image_urls || []), base64String],
          },
        }));
        setUploading(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setUploading(null);
    }
  };

  const handleImageDelete = (sectionType: string, imageIndex: number) => {
    setSections(prev => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        image_urls: prev[sectionType].image_urls.filter((_, index) => index !== imageIndex),
      },
    }));
  };

  const handleSaveSection = async (sectionType: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sectionData = sections[sectionType];

      if (sectionData.id) {
        const { error: updateError } = await supabase
          .from('patient_history')
          .update({
            content: sectionData.content,
            image_urls: sectionData.image_urls,
          })
          .eq('id', sectionData.id);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('patient_history')
          .insert({
            patient_id: patient.id,
            section_type: sectionType,
            content: sectionData.content,
            image_urls: sectionData.image_urls,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setSections(prev => ({
          ...prev,
          [sectionType]: {
            ...prev[sectionType],
            id: data.id,
          },
        }));
      }

      setSuccess('Section saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Medical History</h2>
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

      <div className="space-y-6">
        {SECTION_TYPES.map((section) => {
          const sectionData = sections[section.value] || { content: '', image_urls: [] };
          return (
            <div key={section.value} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{section.label}</h3>

              <textarea
                value={sectionData.content}
                onChange={(e) => handleContentChange(section.value, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition min-h-[100px] resize-y"
                placeholder={`Enter ${section.label.toLowerCase()} details...`}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {sectionData.image_urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`${section.label} image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(section.value, index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(section.value, file);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                    disabled={uploading === section.value}
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition">
                    {uploading === section.value ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </>
                    )}
                  </div>
                </label>

                <button
                  type="button"
                  onClick={() => handleSaveSection(section.value)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
