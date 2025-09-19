'use client'

import { useState } from 'react'
import {
  Pill,
  Plus,
  X,
  Search,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Save,
  Trash2,
  Calendar,
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

interface PrescriptionBuilderProps {
  onSave: (medicines: Medicine[], diagnosis: string, instructions: string, followUpDate: string) => void
  onClose: () => void
  patientName: string
}

const commonMedicines = [
  'Paracetamol 500mg',
  'Ibuprofen 400mg',
  'Amoxicillin 500mg',
  'Azithromycin 250mg',
  'Cetirizine 10mg',
  'Omeprazole 20mg',
  'Vitamin D3 60000IU',
  'Cough Syrup',
  'ORS Packets',
  'Multivitamin'
]

const frequencies = [
  { value: 'once_daily', label: 'Once daily', symbol: '1-0-0' },
  { value: 'twice_daily', label: 'Twice daily', symbol: '1-0-1' },
  { value: 'thrice_daily', label: 'Thrice daily', symbol: '1-1-1' },
  { value: 'as_needed', label: 'As needed (SOS)', symbol: 'SOS' }
]

const durations = ['3 days', '5 days', '7 days', '10 days', '14 days']

export function PrescriptionBuilder({ onSave, onClose, patientName }: PrescriptionBuilderProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [diagnosis, setDiagnosis] = useState('')
  const [generalInstructions, setGeneralInstructions] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [isAddingMedicine, setIsAddingMedicine] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: 'twice_daily',
    duration: '7 days',
    instructions: '',
    beforeAfterMeal: 'after' as const
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
  }

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage) return

    const medicine: Medicine = {
      id: Date.now().toString(),
      ...newMedicine
    }

    setMedicines(prev => [...prev, medicine])
    resetForm()
  }

  const removeMedicine = (id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id))
  }

  const selectMedicine = (medicineName: string) => {
    setNewMedicine(prev => ({ ...prev, name: medicineName }))
    setSearchTerm('')
  }

  const handleSave = () => {
    if (medicines.length === 0 && !diagnosis) return
    onSave(medicines, diagnosis, generalInstructions, followUpDate)
    onClose()
  }

  const getFrequencyLabel = (frequency: string) => {
    return frequencies.find(f => f.value === frequency)?.label || frequency
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Quick Prescription Builder</h2>
              <p className="text-emerald-100 text-sm">Patient: {patientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto space-y-6">
          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Enter diagnosis..."
              rows={2}
            />
          </div>

          {/* Add Medicine Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medicines</h3>
              {!isAddingMedicine && (
                <button
                  onClick={() => setIsAddingMedicine(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Medicine</span>
                </button>
              )}
            </div>

            {/* Add Medicine Form */}
            {isAddingMedicine && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Add New Medicine</h4>
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Search medicine..."
                    />

                    {/* Suggestions */}
                    {searchTerm && !newMedicine.name && filteredMedicines.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredMedicines.slice(0, 5).map((medicine, index) => (
                          <button
                            key={index}
                            onClick={() => selectMedicine(medicine)}
                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-2"
                          >
                            <Pill className="h-3 w-3 text-emerald-600" />
                            <span className="text-sm">{medicine}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Dosage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMedicine.dosage}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="1 tablet"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newMedicine.frequency}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      Duration
                    </label>
                    <select
                      value={newMedicine.duration}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Meal Timing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Timing
                    </label>
                    <select
                      value={newMedicine.beforeAfterMeal}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, beforeAfterMeal: e.target.value as 'before' | 'after' | 'with' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={newMedicine.instructions}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Special instructions..."
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={addMedicine}
                  disabled={!newMedicine.name || !newMedicine.dosage}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Medicine</span>
                </button>
              </div>
            )}

            {/* Medicines List */}
            {medicines.length > 0 && (
              <div className="space-y-3">
                {medicines.map((medicine, index) => (
                  <div key={medicine.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div><span className="font-medium">Dosage:</span> {medicine.dosage}</div>
                          <div><span className="font-medium">Frequency:</span> {getFrequencyLabel(medicine.frequency)}</div>
                          <div><span className="font-medium">Duration:</span> {medicine.duration}</div>
                          <div><span className="font-medium">Timing:</span> {medicine.beforeAfterMeal} meal</div>
                        </div>
                        {medicine.instructions && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {medicine.instructions}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeMedicine(medicine.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {medicines.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Pill className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No medicines added yet</p>
              </div>
            )}
          </div>

          {/* General Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Instructions
            </label>
            <textarea
              value={generalInstructions}
              onChange={(e) => setGeneralInstructions(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Enter general instructions for the patient..."
              rows={3}
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            {followUpDate && (
              <p className="mt-1 text-sm text-gray-600">
                Follow-up scheduled for: {new Date(followUpDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={medicines.length === 0 && !diagnosis}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}