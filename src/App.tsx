import { useState } from 'react';
import { PatientRegistrationForm } from './components/PatientRegistrationForm';
import { PatientHistoryForm } from './components/PatientHistoryForm';
import { PatientSearch } from './components/PatientSearch';
import { GeneralPatientOrientation } from './components/GeneralPatientOrientation';
import { AdmissionsDischargeForm } from './components/AdmissionsDischargeForm';
import { PatientPersonalDataForm } from './components/PatientPersonalDataForm';
import { Patient } from './lib/supabase';
import { Activity, FileText, Search as SearchIcon } from 'lucide-react';

function App() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'register' | 'search'>('register');
  const [viewMode, setViewMode] = useState<'history' | 'orientation' | 'admission' | 'personal'>('history');

  const handlePatientRegistered = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('register');
  };

  const handlePatientFound = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Patient Management System</h1>
          </div>
          <p className="text-gray-600 ml-13">Register patients and manage comprehensive medical records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 px-4 py-3 font-medium transition flex items-center justify-center gap-2 ${
                    activeTab === 'register'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Register
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 px-4 py-3 font-medium transition flex items-center justify-center gap-2 ${
                    activeTab === 'search'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SearchIcon className="w-4 h-4" />
                  Search
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'register' ? (
                  <PatientRegistrationForm onPatientRegistered={handlePatientRegistered} />
                ) : (
                  <PatientSearch onPatientFound={handlePatientFound} />
                )}
              </div>
            </div>

            {selectedPatient && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Patient</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number:</span>
                    <span className="font-medium text-gray-800">{selectedPatient.patient_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-800">{selectedPatient.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium text-gray-800">{selectedPatient.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium text-gray-800">{selectedPatient.gender}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => setViewMode('personal')}
                    className={`px-3 py-3 font-medium rounded-lg transition text-sm ${
                      viewMode === 'personal'
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Personal Data
                  </button>
                  <button
                    onClick={() => setViewMode('history')}
                    className={`px-3 py-3 font-medium rounded-lg transition text-sm ${
                      viewMode === 'history'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    History
                  </button>
                  <button
                    onClick={() => setViewMode('orientation')}
                    className={`px-3 py-3 font-medium rounded-lg transition text-sm ${
                      viewMode === 'orientation'
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Orientation
                  </button>
                  <button
                    onClick={() => setViewMode('admission')}
                    className={`px-3 py-3 font-medium rounded-lg transition text-sm ${
                      viewMode === 'admission'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Admission
                  </button>
                </div>

                {viewMode === 'personal' ? (
                  <PatientPersonalDataForm patient={selectedPatient} />
                ) : viewMode === 'history' ? (
                  <PatientHistoryForm patient={selectedPatient} />
                ) : viewMode === 'orientation' ? (
                  <GeneralPatientOrientation patient={selectedPatient} />
                ) : (
                  <AdmissionsDischargeForm patient={selectedPatient} />
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Patient Selected</h3>
                <p className="text-gray-500">
                  Register a new patient or search for an existing patient to view and manage their medical records.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
