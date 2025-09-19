'use client'

import {
  FileText,
  User,
  Calendar,
  Phone,
  MapPin,
  Stethoscope,
  Download,
  Eye
} from 'lucide-react'

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterMeal: 'before' | 'after' | 'with'
}

interface PatientDetails {
  name: string
  age: string
  gender: 'male' | 'female' | 'other'
  phone: string
  weight?: string
  height?: string
  allergies?: string
}

interface PrescriptionData {
  patient: PatientDetails
  medicines: Medicine[]
  followUpDate?: string
  generalInstructions: string
  diagnosis: string
}

interface PrescriptionPreviewProps {
  data: PrescriptionData
  doctorName: string
  doctorSpecialization: string
}

const frequencies = [
  { value: 'once_daily', label: 'Once daily', symbol: '1-0-0' },
  { value: 'twice_daily', label: 'Twice daily', symbol: '1-0-1' },
  { value: 'thrice_daily', label: 'Thrice daily', symbol: '1-1-1' },
  { value: 'four_times', label: 'Four times daily', symbol: '1-1-1-1' },
  { value: 'as_needed', label: 'As needed (SOS)', symbol: 'SOS' }
]

export function PrescriptionPreview({ data, doctorName, doctorSpecialization }: PrescriptionPreviewProps) {
  const getFrequencySymbol = (frequency: string) => {
    return frequencies.find(f => f.value === frequency)?.symbol || frequency
  }

  const getMealTimingText = (timing: string) => {
    switch (timing) {
      case 'before': return 'Before meal'
      case 'after': return 'After meal'
      case 'with': return 'With meal'
      default: return timing
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Preview Header */}
      <div className="bg-emerald-600 text-white p-4">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <h3 className="font-semibold">Prescription Preview</h3>
        </div>
      </div>

      {/* Prescription Content */}
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Header with Logo */}
        <div className="text-center mb-6 pb-4 border-b-2 border-emerald-600">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-emerald-600 mb-1">Bharat Telemed</h1>
          <p className="text-sm text-gray-600">Digital Healthcare Platform</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-2">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>www.bharattelemed.com</span>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="mb-6">
          <div className="bg-emerald-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Doctor Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {doctorName}</p>
              <p><span className="font-medium">Specialization:</span> {doctorSpecialization}</p>
              <p><span className="font-medium">Date:</span> {currentDate}</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient Information</span>
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Name:</span> {data.patient.name || 'N/A'}</div>
              <div><span className="font-medium">Age:</span> {data.patient.age || 'N/A'}</div>
              <div><span className="font-medium">Gender:</span> {data.patient.gender || 'N/A'}</div>
              <div><span className="font-medium">Phone:</span> {data.patient.phone || 'N/A'}</div>
              {data.patient.weight && (
                <div><span className="font-medium">Weight:</span> {data.patient.weight} kg</div>
              )}
              {data.patient.height && (
                <div><span className="font-medium">Height:</span> {data.patient.height} cm</div>
              )}
            </div>
            {data.patient.allergies && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                <span className="font-medium text-red-700">Allergies:</span> {data.patient.allergies}
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis */}
        {data.diagnosis && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Diagnosis</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              {data.diagnosis}
            </div>
          </div>
        )}

        {/* Medicines */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Prescribed Medicines</h3>
          {data.medicines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No medicines added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.medicines.map((medicine, index) => (
                <div key={medicine.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start space-x-3">
                    <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{medicine.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {medicine.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {getFrequencySymbol(medicine.frequency)}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {medicine.duration}
                        </div>
                        <div>
                          <span className="font-medium">Timing:</span> {getMealTimingText(medicine.beforeAfterMeal)}
                        </div>
                      </div>
                      {medicine.instructions && (
                        <div className="mt-2 text-sm text-blue-700 bg-blue-50 p-2 rounded">
                          <span className="font-medium">Instructions:</span> {medicine.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* General Instructions */}
        {data.generalInstructions && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">General Instructions</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm whitespace-pre-line">
              {data.generalInstructions}
            </div>
          </div>
        )}

        {/* Follow-up Date */}
        {data.followUpDate && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Follow-up Date</span>
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm">
              <span className="font-medium">Next Appointment:</span> {new Date(data.followUpDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>This is a digitally generated prescription</p>
            <p>For any queries, contact: support@bharattelemed.com</p>
            <p className="font-medium">© 2024 Bharat Telemed - Digital Healthcare Platform</p>
          </div>
        </div>
      </div>

      {/* Preview Actions */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="text-xs text-gray-600 text-center">
          <p>Live preview updates as you build your prescription</p>
        </div>
      </div>
    </div>
  )
}