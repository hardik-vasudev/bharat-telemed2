'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Stethoscope
} from 'lucide-react'

interface FollowUpSectionProps {
  followUpDate?: string
  generalInstructions: string
  diagnosis: string
  onUpdateFollowUp: (date: string) => void
  onUpdateInstructions: (instructions: string, diagnosis: string) => void
  onNext: () => void
  onBack: () => void
}

export function FollowUpSection({
  followUpDate,
  generalInstructions,
  diagnosis,
  onUpdateFollowUp,
  onUpdateInstructions,
  onNext,
  onBack
}: FollowUpSectionProps) {
  const [formData, setFormData] = useState({
    followUpDate: followUpDate || '',
    diagnosis: diagnosis || '',
    generalInstructions: generalInstructions || ''
  })

  useEffect(() => {
    onUpdateFollowUp(formData.followUpDate)
    onUpdateInstructions(formData.generalInstructions, formData.diagnosis)
  }, [formData, onUpdateFollowUp, onUpdateInstructions])

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Generate suggested follow-up dates
  const generateFollowUpSuggestions = () => {
    const today = new Date()
    const suggestions = [
      { label: '3 days', days: 3 },
      { label: '1 week', days: 7 },
      { label: '2 weeks', days: 14 },
      { label: '1 month', days: 30 },
      { label: '3 months', days: 90 }
    ]

    return suggestions.map(suggestion => {
      const date = new Date(today)
      date.setDate(today.getDate() + suggestion.days)
      return {
        ...suggestion,
        date: date.toISOString().split('T')[0],
        formatted: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      }
    })
  }

  const followUpSuggestions = generateFollowUpSuggestions()

  // Common diagnosis suggestions
  const commonDiagnoses = [
    'Upper Respiratory Tract Infection',
    'Viral Fever',
    'Bacterial Infection',
    'Hypertension',
    'Diabetes Mellitus Type 2',
    'Gastroenteritis',
    'Migraine',
    'Allergic Rhinitis',
    'Bronchitis',
    'Urinary Tract Infection',
    'Musculoskeletal Pain',
    'Anxiety Disorder',
    'Vitamin D Deficiency',
    'Iron Deficiency Anemia',
    'Acid Reflux Disease'
  ]

  // Common instructions
  const commonInstructions = [
    'Take adequate rest and stay hydrated',
    'Avoid cold and spicy foods',
    'Complete the full course of antibiotics',
    'Monitor blood pressure daily',
    'Check blood sugar levels regularly',
    'Avoid alcohol and smoking',
    'Take medicine on time as prescribed',
    'Return if symptoms persist or worsen',
    'Follow a healthy diet and exercise regularly',
    'Get adequate sleep (7-8 hours)',
    'Avoid stress and maintain work-life balance',
    'Keep the affected area clean and dry',
    'Apply warm compress as needed',
    'Avoid driving if feeling drowsy from medication'
  ]

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Follow-up & Instructions</h2>
        <p className="text-gray-600">Add diagnosis, follow-up date, and general instructions for the patient.</p>
      </div>

      {/* Diagnosis Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              value={formData.diagnosis}
              onChange={(e) => updateField('diagnosis', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Enter the diagnosis..."
              rows={3}
            />
          </div>
        </div>

        {/* Common Diagnosis Suggestions */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Quick Select Common Diagnoses:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonDiagnoses.slice(0, 9).map((diagnosisOption) => (
              <button
                key={diagnosisOption}
                onClick={() => updateField('diagnosis', diagnosisOption)}
                className={`text-left px-3 py-2 rounded-lg border transition-colors text-sm ${
                  formData.diagnosis === diagnosisOption
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                {diagnosisOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up Date Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Follow-up Date (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => updateField('followUpDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Quick Follow-up Suggestions */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {followUpSuggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => updateField('followUpDate', suggestion.date)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
                  formData.followUpDate === suggestion.date
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{suggestion.label}</span>
                <span className="text-xs text-gray-500">({suggestion.formatted})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* General Instructions Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            General Instructions
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              value={formData.generalInstructions}
              onChange={(e) => updateField('generalInstructions', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Enter general instructions for the patient..."
              rows={4}
            />
          </div>
        </div>

        {/* Common Instructions */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Add Common Instructions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonInstructions.slice(0, 10).map((instruction) => (
              <button
                key={instruction}
                onClick={() => {
                  const currentInstructions = formData.generalInstructions
                  const newInstruction = currentInstructions
                    ? `${currentInstructions}\n• ${instruction}`
                    : `• ${instruction}`
                  updateField('generalInstructions', newInstruction)
                }}
                className="text-left px-3 py-2 rounded-lg border bg-gray-50 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-sm"
              >
                + {instruction}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Important Notes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure all instructions are clear and easy to understand</li>
              <li>• Follow-up date helps in tracking patient progress</li>
              <li>• Include emergency contact information if needed</li>
              <li>• Mention when to return for urgent care</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Medicines</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={!formData.diagnosis}
          className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span>Review Prescription</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}