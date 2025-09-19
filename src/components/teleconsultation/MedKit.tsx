'use client'

import { useState } from 'react'
import { Briefcase, FileText, Pill, X, ChevronDown } from 'lucide-react'

interface MedKitProps {
  onOpenNotepad: () => void
  onOpenPrescription: () => void
  isNotepadOpen: boolean
  isPrescriptionOpen: boolean
}

export function MedKit({ onOpenNotepad, onOpenPrescription, isNotepadOpen, isPrescriptionOpen }: MedKitProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative">
      {/* MedKit Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
        title="Medical Toolkit"
      >
        <Briefcase className="h-5 w-5" />
        <span className="text-sm font-medium">MedKit</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[200px] z-50"
             style={{ animation: 'fadeIn 0.2s ease-out' }}>

          {/* Prescription Builder Option */}
          <button
            onClick={() => {
              onOpenPrescription()
              setIsExpanded(false)
            }}
            disabled={isPrescriptionOpen}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
              isPrescriptionOpen
                ? 'bg-blue-50 text-blue-600 cursor-not-allowed'
                : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${isPrescriptionOpen ? 'bg-blue-100' : 'bg-blue-50'}`}>
              <Pill className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Quick Prescription</div>
              <div className="text-xs text-gray-500">Build prescriptions fast</div>
            </div>
            {isPrescriptionOpen && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Notepad Option */}
          <button
            onClick={() => {
              onOpenNotepad()
              setIsExpanded(false)
            }}
            disabled={isNotepadOpen}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
              isNotepadOpen
                ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed'
                : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${isNotepadOpen ? 'bg-emerald-100' : 'bg-emerald-50'}`}>
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Consultation Notes</div>
              <div className="text-xs text-gray-500">Take notes during call</div>
            </div>
            {isNotepadOpen && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Separator */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Status Info */}
          <div className="px-3 py-2 text-xs text-gray-500 text-center">
            {isNotepadOpen && isPrescriptionOpen && 'Both tools active'}
            {isNotepadOpen && !isPrescriptionOpen && 'Notepad active'}
            {!isNotepadOpen && isPrescriptionOpen && 'Prescription active'}
            {!isNotepadOpen && !isPrescriptionOpen && 'Select a medical tool'}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}