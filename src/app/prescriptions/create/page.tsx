'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Download,
  Save,
  Plus,
  Calendar,
  User,
  Stethoscope,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import { PrescriptionHeader } from '@/components/prescriptions/PrescriptionHeader'
import { PatientDetailsForm } from '@/components/prescriptions/PatientDetailsForm'
import { MedicineSelector } from '@/components/prescriptions/MedicineSelector'
import { FollowUpSection } from '@/components/prescriptions/FollowUpSection'
import { PrescriptionPreview } from '@/components/prescriptions/PrescriptionPreview'
import { useAuth } from '@/contexts/AuthContext'

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

export default function CreatePrescriptionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    patient: {
      name: '',
      age: '',
      gender: 'male',
      phone: ''
    },
    medicines: [],
    generalInstructions: '',
    diagnosis: ''
  })

  const updatePatientDetails = (patient: PatientDetails) => {
    setPrescriptionData(prev => ({ ...prev, patient }))
  }

  const addMedicine = (medicine: Medicine) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: [...prev.medicines, medicine]
    }))
  }

  const removeMedicine = (medicineId: string) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.filter(med => med.id !== medicineId)
    }))
  }

  const updateMedicine = (medicineId: string, updatedMedicine: Partial<Medicine>) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.map(med =>
        med.id === medicineId ? { ...med, ...updatedMedicine } : med
      )
    }))
  }

  const updateFollowUp = (followUpDate: string) => {
    setPrescriptionData(prev => ({ ...prev, followUpDate }))
  }

  const updateInstructions = (generalInstructions: string, diagnosis: string) => {
    setPrescriptionData(prev => ({ ...prev, generalInstructions, diagnosis }))
  }

  const savePrescription = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    // Show success message and redirect
    router.push('/prescriptions?created=true')
  }

  const steps = [
    { number: 1, title: 'Patient Details', icon: User },
    { number: 2, title: 'Add Medicines', icon: Plus },
    { number: 3, title: 'Follow-up & Notes', icon: Calendar },
    { number: 4, title: 'Review & Generate', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Prescriptions</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Prescription</h1>
              <p className="text-gray-600">Build a comprehensive prescription for your patient</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg px-4 py-2 border border-emerald-200">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Dr. {user?.user_metadata?.full_name || 'Doctor'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === step.number
                    ? 'bg-emerald-600 text-white'
                    : currentStep > step.number
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-4 ${
                    currentStep > step.number ? 'bg-emerald-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Step Content */}
              <div className="p-8">
                {currentStep === 1 && (
                  <PatientDetailsForm
                    patient={prescriptionData.patient}
                    onUpdate={updatePatientDetails}
                    onNext={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 2 && (
                  <MedicineSelector
                    medicines={prescriptionData.medicines}
                    onAdd={addMedicine}
                    onRemove={removeMedicine}
                    onUpdate={updateMedicine}
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                  />
                )}

                {currentStep === 3 && (
                  <FollowUpSection
                    followUpDate={prescriptionData.followUpDate}
                    generalInstructions={prescriptionData.generalInstructions}
                    diagnosis={prescriptionData.diagnosis}
                    onUpdateFollowUp={updateFollowUp}
                    onUpdateInstructions={updateInstructions}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Prescription</h2>
                      <p className="text-gray-600 mb-6">
                        Please review all details before generating the prescription PDF.
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Edit
                      </button>

                      <button
                        onClick={savePrescription}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Generate PDF Prescription</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PrescriptionPreview
                data={prescriptionData}
                doctorName={user?.user_metadata?.full_name || 'Dr. Name'}
                doctorSpecialization={user?.user_metadata?.specialization?.split(',')[0] || 'General Medicine'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}