'use client'

import { Stethoscope, Calendar, User, Phone, MapPin } from 'lucide-react'

interface PrescriptionHeaderProps {
  doctorName: string
  doctorSpecialization: string
  currentDate?: string
}

export function PrescriptionHeader({
  doctorName,
  doctorSpecialization,
  currentDate
}: PrescriptionHeaderProps) {
  const displayDate = currentDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-white border-b-2 border-emerald-600 p-6">
      {/* Logo and Clinic Name */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-emerald-600 mb-2">Bharat Telemed</h1>
        <p className="text-gray-600 text-lg">Digital Healthcare Platform</p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mt-3">
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>www.bharattelemed.com</span>
          </div>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="bg-emerald-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <User className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-semibold text-gray-900">{doctorName}</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Stethoscope className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Specialization</p>
              <p className="font-semibold text-gray-900">{doctorSpecialization}</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-gray-900">{displayDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}