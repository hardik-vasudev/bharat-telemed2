import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { DoctorProfile, DoctorInsert } from '@/lib/supabase/types'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  medicalLicenseNumber: string
  specialization: string[]
  qualification: string[]
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  data?: unknown
}

export class AuthService {
  private supabase = createClient()

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            medical_license_number: data.medicalLicenseNumber,
            specialization: data.specialization.join(','),
            qualification: data.qualification.join(','),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      return {
        success: true,
        data: authData,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      return {
        success: true,
        data: authData,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  async getDoctorProfile(userId: string): Promise<DoctorProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching doctor profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected error fetching doctor profile:', error)
      return null
    }
  }

  async updateDoctorProfile(userId: string, updates: Partial<DoctorInsert>): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase
        .from('doctor_profiles')
        .update(updates)
        .eq('id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async getSpecializations() {
    const { data, error } = await this.supabase
      .from('specializations')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching specializations:', error)
      return []
    }

    return data || []
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()