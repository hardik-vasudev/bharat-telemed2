'use client'

import { useState, useEffect } from 'react'
import { User, Phone, Calendar, Weight, Ruler, AlertTriangle, ChevronRight } from 'lucide-react'

interface PatientDetails {
  name: string
  age: string
  gender: 'male' | 'female' | 'other'
  phone: string
  weight?: string
  height?: string
  allergies?: string
}

interface PatientDetailsFormProps {
  patient: PatientDetails
  onUpdate: (patient: PatientDetails) => void
  onNext: () => void
}

export function PatientDetailsForm({ patient, onUpdate, onNext }: PatientDetailsFormProps) {
  const [formData, setFormData] = useState<PatientDetails>(patient)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  const updateField = (field: keyof PatientDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required'
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required'
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Please enter a valid age'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
        <p className="text-gray-600">Please enter the patient&apos;s basic information to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter patient's full name"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Age in years"
              min="0"
              max="150"
            />
          </div>
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateField('gender', e.target.value as 'male' | 'female' | 'other')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+91 9876543210"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Weight (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (Optional)
          </label>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateField('weight', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Weight in kg"
              min="0"
            />
          </div>
        </div>

        {/* Height (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (Optional)
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={formData.height || ''}
              onChange={(e) => updateField('height', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Height in cm"
              min="0"
            />
          </div>
        </div>

        {/* Allergies (Optional) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Allergies (Optional)
          </label>
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              value={formData.allergies || ''}
              onChange={(e) => updateField('allergies', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              placeholder="List any known allergies (e.g., Penicillin, Peanuts, etc.)"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 font-medium"
        >
          <span>Continue to Medicines</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}