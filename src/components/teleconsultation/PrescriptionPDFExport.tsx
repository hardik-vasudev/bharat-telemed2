'use client'

import { useState } from 'react'
import { Download, FileText, X, Printer } from 'lucide-react'

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterMeal: 'before' | 'after' | 'with'
}

interface ConsultationNote {
  id: string
  timestamp: Date
  content: string
  category: 'symptoms' | 'diagnosis' | 'prescription' | 'general'
}

interface PrescriptionPDFExportProps {
  notes: ConsultationNote[]
  patientName: string
  doctorName: string
  onClose: () => void
}

const frequencies = [
  { value: 'once_daily', label: 'Once daily', symbol: '1-0-0' },
  { value: 'twice_daily', label: 'Twice daily', symbol: '1-0-1' },
  { value: 'thrice_daily', label: 'Thrice daily', symbol: '1-1-1' },
  { value: 'as_needed', label: 'As needed (SOS)', symbol: 'SOS' }
]

export function PrescriptionPDFExport({ notes, patientName, doctorName, onClose }: PrescriptionPDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const prescriptionNotes = notes.filter(note => note.category === 'prescription')
  const diagnosisNotes = notes.filter(note => note.category === 'diagnosis')
  const generalNotes = notes.filter(note => note.category === 'general')
  const symptomNotes = notes.filter(note => note.category === 'symptoms')

  const generatePDF = async () => {
    setIsGenerating(true)

    // Create a new window for the prescription
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (!printWindow) {
      alert('Please allow popups to generate the prescription PDF')
      setIsGenerating(false)
      return
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${patientName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .clinic-name {
            font-size: 28px;
            font-weight: bold;
            color: #10b981;
            margin: 10px 0 5px 0;
          }

          .clinic-subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
          }

          .contact-info {
            font-size: 12px;
            color: #666;
            display: flex;
            justify-content: center;
            gap: 20px;
          }

          .doctor-info {
            background: #f0fdf4;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
          }

          .doctor-info h3 {
            margin: 0 0 10px 0;
            color: #166534;
          }

          .patient-info {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
          }

          .patient-info h3 {
            margin: 0 0 10px 0;
            color: #374151;
          }

          .section {
            margin-bottom: 25px;
          }

          .section h3 {
            color: #374151;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
          }

          .prescription-item {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
          }

          .medicine-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .medicine-number {
            background: #10b981;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          }

          .medicine-name {
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
          }

          .medicine-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            font-size: 14px;
            color: #6b7280;
          }

          .medicine-instructions {
            background: #eff6ff;
            border: 1px solid #dbeafe;
            border-radius: 6px;
            padding: 10px;
            margin-top: 10px;
            font-size: 14px;
            color: #1e40af;
          }

          .note-content {
            background: #fffbeb;
            border: 1px solid #fed7aa;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
            white-space: pre-line;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }

          @media print {
            body {
              padding: 10px;
            }

            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🩺</div>
          <h1 class="clinic-name">Bharat Telemed</h1>
          <p class="clinic-subtitle">Digital Healthcare Platform</p>
          <div class="contact-info">
            <span>📞 +91 98765 43210</span>
            <span>🌐 www.bharattelemed.com</span>
          </div>
        </div>

        <div class="doctor-info">
          <h3>Doctor Information</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 14px;">
            <div><strong>Name:</strong> ${doctorName}</div>
            <div><strong>Date:</strong> ${currentDate}</div>
            <div><strong>Time:</strong> ${new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div class="patient-info">
          <h3>Patient Information</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 14px;">
            <div><strong>Name:</strong> ${patientName}</div>
            <div><strong>Patient ID:</strong> PS001</div>
          </div>
        </div>

        ${diagnosisNotes.length > 0 ? `
        <div class="section">
          <h3>🔍 Diagnosis</h3>
          ${diagnosisNotes.map(note => `
            <div class="note-content">
              ${note.content}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${symptomNotes.length > 0 ? `
        <div class="section">
          <h3>🤒 Symptoms</h3>
          ${symptomNotes.map(note => `
            <div class="note-content">
              ${note.content}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${prescriptionNotes.length > 0 ? `
        <div class="section">
          <h3>💊 Prescribed Medicines</h3>
          ${prescriptionNotes.map((note, index) => {
            // Parse prescription content
            const content = note.content.replace('PRESCRIPTION:\n', '');
            const medicines = content.split('\n').filter(line => line.trim());

            return medicines.map((medicine, medIndex) => `
              <div class="prescription-item">
                <div class="medicine-header">
                  <div class="medicine-number">${medIndex + 1}</div>
                  <div class="medicine-name">${medicine.split(' - ')[0]}</div>
                </div>
                <div class="medicine-details">
                  <div><strong>Details:</strong> ${medicine.split(' - ')[1] || ''}</div>
                </div>
              </div>
            `).join('');
          }).join('')}
        </div>
        ` : ''}

        ${generalNotes.length > 0 ? `
        <div class="section">
          <h3>📋 General Instructions</h3>
          ${generalNotes.map(note => `
            <div class="note-content">
              ${note.content}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="footer">
          <p><strong>Important:</strong> This is a digitally generated prescription</p>
          <p>For any queries, contact: support@bharattelemed.com</p>
          <p><strong>© 2024 Bharat Telemed - Digital Healthcare Platform</strong></p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent)
    printWindow.document.close()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
      setIsGenerating(false)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Generate Prescription PDF</h2>
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
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 mb-2">Prescription Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-emerald-700">
                <div>
                  <span className="font-medium">Diagnosis Notes:</span> {diagnosisNotes.length}
                </div>
                <div>
                  <span className="font-medium">Prescriptions:</span> {prescriptionNotes.length}
                </div>
                <div>
                  <span className="font-medium">Symptoms:</span> {symptomNotes.length}
                </div>
                <div>
                  <span className="font-medium">Instructions:</span> {generalNotes.length}
                </div>
              </div>
            </div>

            {/* Preview of content */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Content Preview:</h4>

              {diagnosisNotes.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Diagnosis:</h5>
                  {diagnosisNotes.slice(0, 2).map(note => (
                    <p key={note.id} className="text-sm text-gray-600 ml-4">• {note.content}</p>
                  ))}
                  {diagnosisNotes.length > 2 && (
                    <p className="text-sm text-gray-500 ml-4">... and {diagnosisNotes.length - 2} more</p>
                  )}
                </div>
              )}

              {prescriptionNotes.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Prescriptions:</h5>
                  {prescriptionNotes.slice(0, 2).map(note => (
                    <div key={note.id} className="text-sm text-gray-600 ml-4">
                      • {note.content.split('\n').slice(0, 2).join(', ')}
                    </div>
                  ))}
                  {prescriptionNotes.length > 2 && (
                    <p className="text-sm text-gray-500 ml-4">... and {prescriptionNotes.length - 2} more</p>
                  )}
                </div>
              )}
            </div>

            {notes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Notes Available</h3>
                <p className="text-sm">Add some consultation notes before generating the prescription.</p>
              </div>
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
            onClick={generatePDF}
            disabled={isGenerating || notes.length === 0}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                <span>Generate & Print PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}