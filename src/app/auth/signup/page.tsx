'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Stethoscope, ArrowLeft, CheckCircle, X } from 'lucide-react'
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth'
import { authService } from '@/lib/auth/auth-utils'
import { Specialization } from '@/lib/supabase/types'

const commonQualifications = [
  'MBBS',
  'MD',
  'MS',
  'DNB',
  'DM',
  'MCh',
  'FCPS',
  'FRCS',
  'MRCP',
  'DO',
  'Diploma',
]

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [loadingSpecializations, setLoadingSpecializations] = useState(true)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      specialization: [],
      qualification: [],
      termsAccepted: false,
    },
  })

  const watchedSpecialization = watch('specialization')
  const watchedQualification = watch('qualification')

  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        const data = await authService.getSpecializations()
        setSpecializations(data)
      } catch (error) {
        console.error('Failed to load specializations:', error)
      } finally {
        setLoadingSpecializations(false)
      }
    }

    loadSpecializations()
  }, [])

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)

    try {
      const result = await authService.signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        medicalLicenseNumber: data.medicalLicenseNumber,
        specialization: data.specialization,
        qualification: data.qualification,
      })

      if (result.success) {
        router.push('/auth/login?message=signup_success')
      } else {
        setError('root', { message: result.error || 'Registration failed' })
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleArraySelection = (array: string[], value: string, onChange: (newArray: string[]) => void) => {
    if (array.includes(value)) {
      onChange(array.filter(item => item !== value))
    } else {
      onChange([...array, value])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Doctor Registration
            </h1>
            <p className="text-gray-600">
              Join Bharat Telemed to start providing online consultations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Dr. John Doe"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 9876543210"
                  {...register('phoneNumber')}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="dr.example@hospital.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Medical License Number */}
            <div>
              <label htmlFor="medicalLicenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Medical License Number <span className="text-red-500">*</span>
              </label>
              <input
                id="medicalLicenseNumber"
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  errors.medicalLicenseNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MED123456"
                {...register('medicalLicenseNumber')}
              />
              {errors.medicalLicenseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.medicalLicenseNumber.message}</p>
              )}
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations <span className="text-red-500">*</span>
              </label>
              <Controller
                name="specialization"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {loadingSpecializations ? (
                      <p className="text-gray-500">Loading specializations...</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {specializations.map((spec) => (
                          <label
                            key={spec.id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={value.includes(spec.name)}
                              onChange={() => toggleArraySelection(value, spec.name, onChange)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{spec.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Selected: {watchedSpecialization.join(', ') || 'None'}
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications <span className="text-red-500">*</span>
              </label>
              <Controller
                name="qualification"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {commonQualifications.map((qual) => (
                        <label
                          key={qual}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={value.includes(qual)}
                            onChange={() => toggleArraySelection(value, qual, onChange)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{qual}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              />
              {errors.qualification && (
                <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Selected: {watchedQualification.join(', ') || 'None'}
              </p>
            </div>

            {/* Terms and Conditions */}
            <div>
              <Controller
                name="termsAccepted"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={onChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                )}
              />
              {errors.termsAccepted && (
                <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Doctor Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Bharat Telemed. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}