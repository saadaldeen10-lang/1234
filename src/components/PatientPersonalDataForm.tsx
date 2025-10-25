import React, { useState, useEffect } from 'react';
import { supabase, Patient } from '../lib/supabase';
import { User, Loader2, Save } from 'lucide-react';

interface PatientPersonalDataFormProps {
  patient: Patient;
}

interface FormData {
  id?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  file_number: string;
  id_number: string;
  sex: string;
  birth_date: string;
  nationality: string;
  marital_status: string;
  city: string;
  area: string;
  street: string;
  home_number: string;
  mobile: string;
  telephone: string;
  registration_date: string;
  data_register_name: string;
  relative_name: string;
  relative_relation: string;
  relative_phone: string;
  relative_city: string;
  relative_area: string;
  relative_street: string;
  relative_home_number: string;
  relative_mobile: string;
}

export const PatientPersonalDataForm: React.FC<PatientPersonalDataFormProps> = ({ patient }) => {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    file_number: '',
    id_number: '',
    sex: '',
    birth_date: '',
    nationality: '',
    marital_status: '',
    city: '',
    area: '',
    street: '',
    home_number: '',
    mobile: '',
    telephone: '',
    registration_date: '',
    data_register_name: '',
    relative_name: '',
    relative_relation: '',
    relative_phone: '',
    relative_city: '',
    relative_area: '',
    relative_street: '',
    relative_home_number: '',
    relative_mobile: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadFormData();
  }, [patient.id]);

  const loadFormData = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_personal_data')
        .select('*')
        .eq('patient_id', patient.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          id: data.id,
          first_name: data.first_name || '',
          middle_name: data.middle_name || '',
          last_name: data.last_name || '',
          file_number: data.file_number || '',
          id_number: data.id_number || '',
          sex: data.sex || '',
          birth_date: data.birth_date || '',
          nationality: data.nationality || '',
          marital_status: data.marital_status || '',
          city: data.city || '',
          area: data.area || '',
          street: data.street || '',
          home_number: data.home_number || '',
          mobile: data.mobile || '',
          telephone: data.telephone || '',
          registration_date: data.registration_date || '',
          data_register_name: data.data_register_name || '',
          relative_name: data.relative_name || '',
          relative_relation: data.relative_relation || '',
          relative_phone: data.relative_phone || '',
          relative_city: data.relative_city || '',
          relative_area: data.relative_area || '',
          relative_street: data.relative_street || '',
          relative_home_number: data.relative_home_number || '',
          relative_mobile: data.relative_mobile || '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form data');
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
        first_name: formDataWithoutId.first_name,
        middle_name: formDataWithoutId.middle_name,
        last_name: formDataWithoutId.last_name,
        file_number: formDataWithoutId.file_number,
        id_number: formDataWithoutId.id_number,
        sex: formDataWithoutId.sex,
        birth_date: formDataWithoutId.birth_date || null,
        nationality: formDataWithoutId.nationality,
        marital_status: formDataWithoutId.marital_status,
        city: formDataWithoutId.city,
        area: formDataWithoutId.area,
        street: formDataWithoutId.street,
        home_number: formDataWithoutId.home_number,
        mobile: formDataWithoutId.mobile,
        telephone: formDataWithoutId.telephone,
        registration_date: formDataWithoutId.registration_date || null,
        data_register_name: formDataWithoutId.data_register_name,
        relative_name: formDataWithoutId.relative_name,
        relative_relation: formDataWithoutId.relative_relation,
        relative_phone: formDataWithoutId.relative_phone,
        relative_city: formDataWithoutId.relative_city,
        relative_area: formDataWithoutId.relative_area,
        relative_street: formDataWithoutId.relative_street,
        relative_home_number: formDataWithoutId.relative_home_number,
        relative_mobile: formDataWithoutId.relative_mobile,
      };

      if (formData.id) {
        const { error: updateError } = await supabase
          .from('patient_personal_data')
          .update(dataToSave)
          .eq('id', formData.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('patient_personal_data')
          .insert(dataToSave)
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        if (data) {
          setFormData(prev => ({ ...prev, id: data.id }));
        }
      }

      setSuccess('Personal data saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      setError(`Failed to save personal data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-teal-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            معلومات شخصية عن المريض Patient Personal Data
          </h2>
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
        <div className="border-2 border-teal-200 rounded-lg p-6 bg-teal-50">
          <h3 className="text-xl font-bold text-teal-800 mb-4">Patient Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الإسم Name (First, Middle, Last)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <input
                  type="text"
                  value={formData.middle_name}
                  onChange={(e) => handleChange('middle_name', e.target.value)}
                  placeholder="Middle Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الملف File No.
                </label>
                <input
                  type="text"
                  value={formData.file_number}
                  onChange={(e) => handleChange('file_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهوية ID No.
                </label>
                <input
                  type="text"
                  value={formData.id_number}
                  onChange={(e) => handleChange('id_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الجنس Sex
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleChange('sex', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="male">ذكر Male</option>
                  <option value="female">أنثى Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الميلاد Birth Date
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الجنسية Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة الإجتماعية Marital Status
              </label>
              <select
                value={formData.marital_status}
                onChange={(e) => handleChange('marital_status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              >
                <option value="">Select</option>
                <option value="single">أعزب Single</option>
                <option value="married">متزوج Married</option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Address Information</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان / المنطقة Address/City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحي Area
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الشارع Street
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم المنزل Home No.
                    </label>
                    <input
                      type="text"
                      value={formData.home_number}
                      onChange={(e) => handleChange('home_number', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الجوال Mobile
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Data Registration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التاريخ Date
                  </label>
                  <input
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) => handleChange('registration_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم مسجل البيانات Data Register Name
                  </label>
                  <input
                    type="text"
                    value={formData.data_register_name}
                    onChange={(e) => handleChange('data_register_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
          <h3 className="text-xl font-bold text-purple-800 mb-4">
            بيانات أقرب شخص Relative Data
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الإسم Name
                </label>
                <input
                  type="text"
                  value={formData.relative_name}
                  onChange={(e) => handleChange('relative_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صلة القرابة Relative
                </label>
                <input
                  type="text"
                  value={formData.relative_relation}
                  onChange={(e) => handleChange('relative_relation', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف Phone Number
              </label>
              <input
                type="tel"
                value={formData.relative_phone}
                onChange={(e) => handleChange('relative_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان / المنطقة Address/City
                </label>
                <input
                  type="text"
                  value={formData.relative_city}
                  onChange={(e) => handleChange('relative_city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الحي Area
                </label>
                <input
                  type="text"
                  value={formData.relative_area}
                  onChange={(e) => handleChange('relative_area', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الشارع Street
                </label>
                <input
                  type="text"
                  value={formData.relative_street}
                  onChange={(e) => handleChange('relative_street', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم المنزل Home No.
                </label>
                <input
                  type="text"
                  value={formData.relative_home_number}
                  onChange={(e) => handleChange('relative_home_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الجوال Mobile
              </label>
              <input
                type="tel"
                value={formData.relative_mobile}
                onChange={(e) => handleChange('relative_mobile', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Personal Data
          </>
        )}
      </button>
    </div>
  );
};
