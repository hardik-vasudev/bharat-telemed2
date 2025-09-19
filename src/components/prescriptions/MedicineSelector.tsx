'use client'

import { useState } from 'react'
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Pill,
  X
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

interface MedicineSelectorProps {
  medicines: Medicine[]
  onAdd: (medicine: Medicine) => void
  onRemove: (medicineId: string) => void
  onUpdate: (medicineId: string, medicine: Partial<Medicine>) => void
  onNext: () => void
  onBack: () => void
}

// Common medicines database
const commonMedicines = [
  'Paracetamol 500mg',
  'Ibuprofen 400mg',
  'Amoxicillin 500mg',
  'Azithromycin 250mg',
  'Metformin 500mg',
  'Amlodipine 5mg',
  'Omeprazole 20mg',
  'Cetirizine 10mg',
  'Vitamin D3 60000IU',
  'Iron + Folic Acid',
  'Aspirin 75mg',
  'Atorvastatin 10mg',
  'Levothyroxine 50mcg',
  'Salbutamol Inhaler',
  'Pantoprazole 40mg',
  'Domperidone 10mg',
  'Diclofenac 50mg',
  'Cough Syrup',
  'Multivitamin',
  'Calcium + Vitamin D'
]

const frequencies = [
  { value: 'once_daily', label: 'Once daily', symbol: '1-0-0' },
  { value: 'twice_daily', label: 'Twice daily', symbol: '1-0-1' },
  { value: 'thrice_daily', label: 'Thrice daily', symbol: '1-1-1' },
  { value: 'four_times', label: 'Four times daily', symbol: '1-1-1-1' },
  { value: 'as_needed', label: 'As needed (SOS)', symbol: 'SOS' }
]

const durations = [
  '3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '1 month', '2 months', '3 months'
]

export function MedicineSelector({ medicines, onAdd, onRemove, onUpdate, onNext, onBack }: MedicineSelectorProps) {
  const [isAddingMedicine, setIsAddingMedicine] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: 'twice_daily',
    duration: '7 days',
    instructions: '',
    beforeAfterMeal: 'after' as 'before' | 'after' | 'with'
  })

  const filteredMedicines = commonMedicines.filter(med =>
    med.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: 'twice_daily',
      duration: '7 days',
      instructions: '',
      beforeAfterMeal: 'after'
    })
    setSearchTerm('')
    setIsAddingMedicine(false)
    setEditingId(null)
  }

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage) return

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      frequency: newMedicine.frequency,
      duration: newMedicine.duration,
      instructions: newMedicine.instructions,
      beforeAfterMeal: newMedicine.beforeAfterMeal
    }

    onAdd(medicine)
    resetForm()
  }

  const handleEditMedicine = (medicine: Medicine) => {
    setNewMedicine({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      duration: medicine.duration,
      instructions: medicine.instructions,
      beforeAfterMeal: medicine.beforeAfterMeal
    })
    setEditingId(medicine.id)
    setIsAddingMedicine(true)
  }

  const handleUpdateMedicine = () => {
    if (!editingId || !newMedicine.name || !newMedicine.dosage) return

    onUpdate(editingId, {
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      frequency: newMedicine.frequency,
      duration: newMedicine.duration,
      instructions: newMedicine.instructions,
      beforeAfterMeal: newMedicine.beforeAfterMeal
    })
    resetForm()
  }

  const selectMedicine = (medicineName: string) => {
    setNewMedicine(prev => ({ ...prev, name: medicineName }))
    setSearchTerm('')
  }

  const getFrequencyLabel = (frequency: string) => {
    return frequencies.find(f => f.value === frequency)?.label || frequency
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Medicines</h2>
        <p className="text-gray-600">Search and add medicines with dosage and instructions.</p>
      </div>

      {/* Add Medicine Button */}
      {!isAddingMedicine && (
        <button
          onClick={() => setIsAddingMedicine(true)}
          className="w-full p-4 border-2 border-dashed border-emerald-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2 text-emerald-600"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add New Medicine</span>
        </button>
      )}

      {/* Add/Edit Medicine Form */}
      {isAddingMedicine && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Medicine' : 'Add New Medicine'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Medicine Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={newMedicine.name || searchTerm}
                onChange={(e) => {
                  if (newMedicine.name) {
                    setNewMedicine(prev => ({ ...prev, name: e.target.value }))
                  } else {
                    setSearchTerm(e.target.value)
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Search for medicine..."
              />

              {/* Medicine Suggestions */}
              {searchTerm && !newMedicine.name && filteredMedicines.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredMedicines.slice(0, 10).map((medicine, index) => (
                    <button
                      key={index}
                      onClick={() => selectMedicine(medicine)}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-2">
                        <Pill className="h-4 w-4 text-emerald-600" />
                        <span>{medicine}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 1 tablet, 5ml"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                value={newMedicine.frequency}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label} ({freq.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={newMedicine.duration}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Before/After Meal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Timing
              </label>
              <select
                value={newMedicine.beforeAfterMeal}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, beforeAfterMeal: e.target.value as 'before' | 'after' | 'with' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="before">Before meal</option>
                <option value="after">After meal</option>
                <option value="with">With meal</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={newMedicine.instructions}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="e.g., Take with plenty of water, Avoid alcohol"
              rows={2}
            />
          </div>

          {/* Add/Update Button */}
          <div className="flex space-x-3">
            <button
              onClick={editingId ? handleUpdateMedicine : handleAddMedicine}
              disabled={!newMedicine.name || !newMedicine.dosage}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{editingId ? 'Update Medicine' : 'Add Medicine'}</span>
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Added Medicines List */}
      {medicines.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Added Medicines ({medicines.length})</h3>

          <div className="space-y-3">
            {medicines.map((medicine, index) => (
              <div key={medicine.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Dosage:</span> {medicine.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span> {getFrequencyLabel(medicine.frequency)}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {medicine.duration}
                      </div>
                      <div>
                        <span className="font-medium">Timing:</span> {medicine.beforeAfterMeal} meal
                      </div>
                    </div>

                    {medicine.instructions && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {medicine.instructions}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditMedicine(medicine)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit medicine"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemove(medicine.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Patient</span>
        </button>

        <button
          onClick={onNext}
          disabled={medicines.length === 0}
          className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span>Continue to Follow-up</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}