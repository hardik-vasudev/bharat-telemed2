'use client'

import { useState, useEffect } from 'react'
import { Video, Phone, FileText, X } from 'lucide-react'
import { IndependentDoctorNotepad } from '@/components/teleconsultation/IndependentDoctorNotepad'
import { IndependentPrescriptionBuilder } from '@/components/teleconsultation/IndependentPrescriptionBuilder'
import JaaSMeetComponent from '@/components/teleconsultation/JaaSMeetComponent'
import { generateJaaSRoomName } from '@/lib/video/jaas-config'
import { TeleconsultationNavbar } from '@/components/teleconsultation/TeleconsultationNavbar'
import { DiseasePrediction } from '@/components/teleconsultation/DiseasePrediction'

export default function TeleconsultationPage() {
  const [callDuration, setCallDuration] = useState(0)
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false)
  const [consultationStarted, setConsultationStarted] = useState(false)
  const [meetingEnded, setMeetingEnded] = useState(false)
  const [finalCallDuration, setFinalCallDuration] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDiseasePredictionOpen, setIsDiseasePredictionOpen] = useState(false)

  // Mock consultation data - replace with real data from your backend
  const consultationData = {
    patientId: 'patient_001',
    patientName: 'John Smith',
    patientEmail: 'john.smith@email.com',
    doctorId: 'doctor_001',
    doctorName: 'Dr. Hardik Vasudev',
    doctorEmail: 'hardik.vasudev@bharattelemed.com',
    appointmentId: 'appt_12345',
    userRole: 'doctor' as const // Change to 'patient' for patient view
  }

  // Generate consistent room name (same as patient would use)
  const roomName = 'Bharat Telemed'

  const meetingConfig = {
    roomName,
    doctorId: consultationData.doctorId,
    doctorName: consultationData.doctorName,
    doctorEmail: consultationData.doctorEmail,
    patientId: consultationData.patientId,
    patientName: consultationData.patientName,
    patientEmail: consultationData.patientEmail,
    userRole: consultationData.userRole,
    appointmentId: consultationData.appointmentId
  }

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (consultationStarted) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [consultationStarted])

  const handleMeetingStart = () => {
    setConsultationStarted(true)
  }

  const handleMeetingEnd = () => {
    setFinalCallDuration(callDuration) // Save final duration
    setConsultationStarted(false)
    setMeetingEnded(true) // Show post-meeting screen
  }

  const handleRejoinMeeting = () => {
    setMeetingEnded(false)
    setCallDuration(0)
    // Meeting will reinitialize automatically
  }

  const handleGoToDashboard = () => {
    // Navigate to dashboard - you can replace with actual navigation
    window.location.href = '/dashboard'
  }

  const handleMeetingError = (error: string) => {
    console.error('Meeting error:', error)
    // Handle error - show notification, redirect, etc.
  }

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Show post-meeting screen if meeting ended
  if (meetingEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Navbar */}
        <TeleconsultationNavbar
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenNotepad={() => setIsNotepadOpen(true)}
          onOpenPrescription={() => setIsPrescriptionOpen(true)}
          onOpenDiseasePrediction={() => setIsDiseasePredictionOpen(true)}
          isNotepadOpen={isNotepadOpen}
          isPrescriptionOpen={isPrescriptionOpen}
        />

        {/* Post-meeting content */}
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Consultation Ended</h2>
            <p className="text-gray-600 mb-6">
              Your consultation has been completed successfully.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">{formatDuration(finalCallDuration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Participants:</span>
                <span className="font-semibold text-gray-900">
                  {consultationData.doctorName} & {consultationData.patientName}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRejoinMeeting}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Video className="h-5 w-5" />
                <span>Rejoin Meeting</span>
              </button>

              <button
                onClick={handleGoToDashboard}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Teleconsultation Navbar */}
      <TeleconsultationNavbar
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenNotepad={() => setIsNotepadOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenDiseasePrediction={() => setIsDiseasePredictionOpen(true)}
        isNotepadOpen={isNotepadOpen}
        isPrescriptionOpen={isPrescriptionOpen}
      />

      {/* Main Content - Adjust height to account for navbar */}
      <div className="h-[calc(100vh-64px)] flex">
          {/* Video Call Section - Takes full width when notepad is closed */}
          <div className={`relative transition-all duration-300 ${
            isNotepadOpen ? 'flex-1' : 'w-full'
          }`}>
            <JaaSMeetComponent
              meetingConfig={meetingConfig}
              onMeetingStart={handleMeetingStart}
              onMeetingEnd={handleMeetingEnd}
              onError={handleMeetingError}
              showControls={true}
              className="h-full w-full"
            />

          </div>

          {/* Enhanced Doctor Notepad Section with smooth animations */}
          {isNotepadOpen && (
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col transform transition-all duration-500 ease-out shadow-2xl"
                 style={{
                   animation: 'slideInFromRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                   backdropFilter: 'blur(10px)'
                 }}>

              {/* Enhanced Header with close button */}
              <div className="relative p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Consultation Notes</h2>
                    <p className="text-xs text-gray-600">Live session recording</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotepadOpen(false)}
                  className="p-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  title="Close notepad"
                >
                  <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                </button>

                {/* Animated indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform scale-x-0 animate-pulse"
                     style={{ animation: 'expandWidth 0.8s ease-out 0.3s forwards' }}></div>
              </div>

              <div className="flex-1">
                <IndependentDoctorNotepad patientName="John Smith" />
              </div>
            </div>
          )}


          {/* Prescription Builder Modal */}
          {isPrescriptionOpen && (
            <IndependentPrescriptionBuilder
              onClose={() => setIsPrescriptionOpen(false)}
              patientName="John Smith"
            />
          )}

          {/* Disease Prediction Modal */}
          {isDiseasePredictionOpen && (
            <DiseasePrediction
              onClose={() => setIsDiseasePredictionOpen(false)}
              patientName="John Smith"
            />
          )}

      </div>
    </div>
  )
}

// Add CSS animations for teleconsultation page
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes expandWidth {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `

  if (!document.head.querySelector('style[data-teleconsultation-animations]')) {
    styleSheet.setAttribute('data-teleconsultation-animations', 'true')
    document.head.appendChild(styleSheet)
  }
}