'use client'

import { useState, useEffect } from 'react'
import {
  Pill,
  Plus,
  X,
  Search,
  AlertCircle,
  Save,
  Trash2,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  ChevronDown,
  Loader2
} from 'lucide-react'

interface Medicine {
  id: string
  code: string
  name: string
  genericName: string
  strength: string
  form: string
  dosage: string
  frequency: string
  frequencyCode: string
  durationDays: number
  mealTiming: 'before' | 'after' | 'with'
  instructions: string
  prescriptionCode: string // Auto-generated: AC-2-7
}

interface PrescriptionData {
  prescriptionId: string
  patientId: string
  doctorId: string
  consultationId: string
  diagnosis: string
  generalInstructions: string
  followUpDate: string
  medicines: Medicine[]
  prescriptionDate: string
}

interface IndependentPrescriptionBuilderProps {
  onClose: () => void
  patientName: string
}

interface MedicineData {
  code: string
  name: string
  genericName: string
  strength: string
  form: string
  category: string
  manufacturer?: string
}

const frequencyOptions = [
  { value: 'once_daily', label: 'Once Daily', code: 'OD', symbol: '1-0-0' },
  { value: 'twice_daily', label: 'Twice Daily', code: 'BD', symbol: '1-0-1' },
  { value: 'thrice_daily', label: 'Thrice Daily', code: 'TDS', symbol: '1-1-1' },
  { value: 'four_times_daily', label: 'Four Times Daily', code: 'QID', symbol: '1-1-1-1' },
  { value: 'as_needed', label: 'As Needed', code: 'SOS', symbol: 'SOS' }
]

const durationOptions = [3, 5, 7, 10, 14, 21, 30]

const commonInstructions = [
  "Take rest and drink plenty of fluids",
  "Avoid spicy and oily food",
  "Complete the full course of antibiotics",
  "Take medicine with food to avoid stomach upset",
  "Consult immediately if symptoms worsen",
  "Avoid alcohol during medication",
  "Take adequate rest",
  "Maintain proper hygiene"
]

export function IndependentPrescriptionBuilder({ onClose, patientName }: IndependentPrescriptionBuilderProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [diagnosis, setDiagnosis] = useState('')
  const [generalInstructions, setGeneralInstructions] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [isAddingMedicine, setIsAddingMedicine] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [savedMessage, setSavedMessage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [instructionsDropdownOpen, setInstructionsDropdownOpen] = useState(false)
  const [medicineDatabase, setMedicineDatabase] = useState<MedicineData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<MedicineData[]>([])
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(true)

  const [newMedicine, setNewMedicine] = useState({
    medicineId: '',
    dosage: '1',
    frequency: 'twice_daily',
    durationDays: 7,
    mealTiming: 'after' as const,
    instructions: ''
  })

  // Load all medicines on component mount
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const response = await fetch('/api/medicines/all')
        const data = await response.json()

        if (data.success) {
          setMedicineDatabase(data.medicines)
        } else {
          console.error('Failed to load medicines:', data.error)
        }
      } catch (error) {
        console.error('Error loading medicines:', error)
      } finally {
        setIsLoadingMedicines(false)
      }
    }

    loadMedicines()
  }, [])

  // Search medicines with API
  useEffect(() => {
    const searchMedicines = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(searchTerm)}`)
        const data = await response.json()

        if (data.success) {
          setSearchResults(data.medicines)
        } else {
          console.error('Failed to search medicines:', data.error)
          setSearchResults([])
        }
      } catch (error) {
        console.error('Error searching medicines:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchMedicines, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const filteredMedicines = searchTerm ? searchResults : medicineDatabase.slice(0, 10)

  // Generate prescription code: AC-2-7 (Medicine_Code-Dosage_Number-Duration_Days)
  const generatePrescriptionCode = (medicineCode: string, dosage: string, durationDays: number) => {
    const dosageNumber = dosage.replace(/[^0-9]/g, '') || '1'
    return `${medicineCode}-${dosageNumber}-${durationDays}`
  }

  const resetForm = () => {
    setNewMedicine({
      medicineId: '',
      dosage: '1',
      frequency: 'twice_daily',
      durationDays: 7,
      mealTiming: 'after',
      instructions: ''
    })
    setSearchTerm('')
    setIsAddingMedicine(false)
  }

  const addMedicine = () => {
    const selectedMedicine = medicineDatabase.find(med => med.code === newMedicine.medicineId)
    if (!selectedMedicine || !newMedicine.dosage) return

    const frequencyData = frequencyOptions.find(f => f.value === newMedicine.frequency)
    if (!frequencyData) return

    const prescriptionCode = generatePrescriptionCode(
      selectedMedicine.code,
      newMedicine.dosage,
      newMedicine.durationDays
    )

    const medicine: Medicine = {
      id: Date.now().toString(),
      code: selectedMedicine.code,
      name: selectedMedicine.name,
      genericName: selectedMedicine.genericName,
      strength: selectedMedicine.strength,
      form: selectedMedicine.form,
      dosage: newMedicine.dosage,
      frequency: newMedicine.frequency,
      frequencyCode: frequencyData.code,
      durationDays: newMedicine.durationDays,
      mealTiming: newMedicine.mealTiming,
      instructions: newMedicine.instructions,
      prescriptionCode
    }

    setMedicines(prev => [...prev, medicine])
    resetForm()
  }

  const removeMedicine = (id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id))
  }

  const selectMedicine = (medicine: MedicineData) => {
    setNewMedicine(prev => ({ ...prev, medicineId: medicine.code }))
    setSearchTerm('')
  }

  const addCommonInstruction = (instruction: string) => {
    if (!generalInstructions.includes(instruction)) {
      setGeneralInstructions(prev => prev ? `${prev}\n• ${instruction}` : `• ${instruction}`)
    }
    setInstructionsDropdownOpen(false)
  }

  const savePrescription = async () => {
    if (medicines.length === 0) {
      alert('Please add at least one medicine to the prescription')
      return
    }

    setIsSaving(true)

    try {
      console.log('💊 Starting prescription save process...')
      const prescriptionData = {
        patientId: 'PAT001', // This should come from props/context
        doctorId: 'DOC001', // This should come from auth context
        consultationId: `CONS_${Date.now()}`, // This should come from props
        diagnosis: diagnosis.trim(),
        generalInstructions: generalInstructions.trim(),
        followUpDate: followUpDate || undefined,
        medicines: medicines.map(med => ({
          medicineCode: med.code,
          medicineName: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          frequencyCode: med.frequencyCode,
          frequencySymbol: getFrequencySymbol(med.frequency),
          durationDays: med.durationDays,
          mealTiming: med.mealTiming,
          instructions: med.instructions
        }))
      }

      console.log('🚀 Sending prescription data:', prescriptionData)

      const response = await fetch('/api/prescriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      let data
      try {
        const responseText = await response.text()
        console.log('📡 Raw response:', responseText)

        data = JSON.parse(responseText)
        console.log('📡 Parsed response:', data)
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError)
        alert('Invalid response from server. Check browser console for details.')
        return
      }

      if (response.ok && data.success) {
        console.log('✅ Prescription saved successfully:', data)
        setSavedMessage(true)
        setTimeout(() => setSavedMessage(false), 3000)
      } else {
        console.error('❌ Failed to save prescription:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })

        // Show detailed error message to help with debugging
        const errorMessage = data?.details
          ? `${data.error}\n\nDetails: ${data.details}`
          : data?.error || `HTTP ${response.status}: ${response.statusText}`

        alert(`Error saving prescription:\n\n${errorMessage}`)
      }

    } catch (error) {
      console.error('Error saving prescription:', error)
      alert('Error saving prescription. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getFrequencySymbol = (frequency: string) => {
    const freq = frequencyOptions.find(f => f.value === frequency)
    return freq?.symbol || '1-0-1'
  }

  const testAPI = async () => {
    try {
      console.log('🧪 Testing API connection...')
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      })

      const data = await response.json()
      console.log('🧪 API Test Response:', data)

      if (data.success) {
        alert('✅ API is working correctly!')
      } else {
        alert('❌ API test failed: ' + data.error)
      }
    } catch (error) {
      console.error('🧪 API Test Error:', error)
      alert('❌ API connection failed: ' + error)
    }
  }

  const getFrequencyDisplay = (frequency: string) => {
    const freq = frequencyOptions.find(f => f.value === frequency)
    return freq ? `${freq.label} (${freq.symbol})` : frequency
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Pill className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Prescription Builder</h2>
                <div className="flex items-center space-x-4 text-emerald-100 mt-1">
                  <span className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{patientName}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date().toLocaleTimeString()}</span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(95vh-160px)]">
          {/* Form Section */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Diagnosis
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
                placeholder="Enter patient diagnosis..."
                rows={2}
              />
            </div>

            {/* Medicines Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Prescribed Medicines</h3>
                {!isAddingMedicine && (
                  <button
                    onClick={() => setIsAddingMedicine(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Medicine</span>
                  </button>
                )}
              </div>

              {/* Add Medicine Form */}
              {isAddingMedicine && (
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-6 space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-2">
                      <Pill className="h-5 w-5 text-emerald-600" />
                      <span>Add New Medicine</span>
                    </h4>
                    <button
                      onClick={resetForm}
                      className="p-2 rounded-xl hover:bg-white hover:bg-opacity-50 transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Medicine Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medicine Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500 animate-spin" />
                      )}
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Search by name, generic name, or code (e.g., AC for Paracetamol)..."
                        disabled={isLoadingMedicines}
                      />

                      {/* Medicine Suggestions */}
                      {(searchTerm && filteredMedicines.length > 0) || (!searchTerm && !isLoadingMedicines && filteredMedicines.length > 0) ? (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredMedicines.slice(0, 8).map((medicine) => (
                            <button
                              key={medicine.code}
                              onClick={() => selectMedicine(medicine)}
                              className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-semibold text-gray-900">{medicine.name}</div>
                                <div className="text-sm text-gray-600">{medicine.genericName} - {medicine.strength}</div>
                              </div>
                              <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-mono">
                                {medicine.code}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchTerm && !isSearching && filteredMedicines.length === 0 ? (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                          No medicines found for "{searchTerm}"
                        </div>
                      ) : null}

                      {isLoadingMedicines && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Loading medicines...
                        </div>
                      )}
                    </div>

                    {/* Selected Medicine Display */}
                    {newMedicine.medicineId && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200">
                        {(() => {
                          const selected = medicineDatabase.find(m => m.code === newMedicine.medicineId)
                          return selected ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{selected.name}</div>
                                <div className="text-sm text-gray-600">{selected.genericName} - {selected.strength}</div>
                              </div>
                              <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-mono">
                                {selected.code}
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Dosage */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dosage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMedicine.dosage}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., 1, 2, 1/2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of tablets/dose</p>
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={newMedicine.frequency}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {frequencyOptions.map((freq) => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label} ({freq.symbol})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration (Days)
                      </label>
                      <select
                        value={newMedicine.durationDays}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {durationOptions.map((days) => (
                          <option key={days} value={days}>
                            {days} days
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Meal Timing */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Meal Timing
                      </label>
                      <select
                        value={newMedicine.mealTiming}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, mealTiming: e.target.value as 'before' | 'after' | 'with' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="before">Before meal</option>
                        <option value="after">After meal</option>
                        <option value="with">With meal</option>
                      </select>
                    </div>
                  </div>

                  {/* Medicine Instructions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <input
                      type="text"
                      value={newMedicine.instructions}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, instructions: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Optional special instructions for this medicine..."
                    />
                  </div>

                  {/* Prescription Code Preview */}
                  {newMedicine.medicineId && (
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Prescription Code Preview:</div>
                      <div className="font-mono text-lg text-emerald-600 font-bold">
                        {generatePrescriptionCode(newMedicine.medicineId, newMedicine.dosage, newMedicine.durationDays)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Format: {newMedicine.medicineId} (medicine) - {newMedicine.dosage.replace(/[^0-9]/g, '') || '1'} (dosage) - {newMedicine.durationDays} (days)
                      </div>
                    </div>
                  )}

                  {/* Add Button */}
                  <button
                    onClick={addMedicine}
                    disabled={!newMedicine.medicineId || !newMedicine.dosage}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-semibold"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Medicine to Prescription</span>
                  </button>
                </div>
              )}

              {/* Medicines List */}
              {medicines.length > 0 ? (
                <div className="space-y-3">
                  {medicines.map((medicine, index) => (
                    <div key={medicine.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{medicine.name}</h4>
                              <p className="text-sm text-gray-600">{medicine.genericName} - {medicine.strength}</p>
                            </div>
                            <div className="ml-auto">
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-mono font-bold">
                                {medicine.prescriptionCode}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <div><span className="font-semibold text-gray-600">Dosage:</span> {medicine.dosage} {medicine.form}</div>
                              <div><span className="font-semibold text-gray-600">Frequency:</span> {getFrequencyDisplay(medicine.frequency)}</div>
                            </div>
                            <div className="space-y-1">
                              <div><span className="font-semibold text-gray-600">Duration:</span> {medicine.durationDays} days</div>
                              <div><span className="font-semibold text-gray-600">Timing:</span> {medicine.mealTiming} meal</div>
                            </div>
                          </div>

                          {medicine.instructions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">{medicine.instructions}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeMedicine(medicine.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                  <Pill className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No medicines added yet</p>
                  <p className="text-sm">Click "Add Medicine" to start building the prescription</p>
                </div>
              )}
            </div>

            {/* General Instructions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  General Instructions
                </label>
                <div className="relative">
                  <button
                    onClick={() => setInstructionsDropdownOpen(!instructionsDropdownOpen)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Common</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {instructionsDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setInstructionsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                        {commonInstructions.map((instruction, index) => (
                          <button
                            key={index}
                            onClick={() => addCommonInstruction(instruction)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                          >
                            {instruction}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <textarea
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
                placeholder="Enter general instructions for the patient..."
                rows={4}
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Follow-up Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              {followUpDate && (
                <p className="mt-2 text-sm text-gray-600">
                  Next appointment: {new Date(followUpDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {medicines.length > 0 && (
              <span>{medicines.length} medicine{medicines.length !== 1 ? 's' : ''} added</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={testAPI}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              🧪 Test API
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={savePrescription}
              disabled={isSaving || medicines.length === 0}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-semibold shadow-lg"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving Prescription...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save to Database</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Prescription saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  )
}