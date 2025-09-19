export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          doctor_id: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctor_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      doctor_profiles: {
        Row: {
          address: Json | null
          availability: Json | null
          avatar_url: string | null
          bio: string | null
          consultation_fee: number
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: Json | null
          experience_years: number
          full_name: string
          gender: string | null
          id: string
          languages_spoken: string[] | null
          medical_license_number: string
          phone_number: string
          qualification: string[]
          rating: number | null
          specialization: string[]
          status: Database["public"]["Enums"]["doctor_status"]
          total_consultations: number | null
          updated_at: string | null
          verification_documents: Json | null
          verification_status: Database["public"]["Enums"]["verification_status"] | null
        }
        Insert: {
          address?: Json | null
          availability?: Json | null
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: Json | null
          experience_years?: number
          full_name: string
          gender?: string | null
          id: string
          languages_spoken?: string[] | null
          medical_license_number: string
          phone_number: string
          qualification: string[]
          rating?: number | null
          specialization: string[]
          status?: Database["public"]["Enums"]["doctor_status"]
          total_consultations?: number | null
          updated_at?: string | null
          verification_documents?: Json | null
          verification_status?: Database["public"]["Enums"]["verification_status"] | null
        }
        Update: {
          address?: Json | null
          availability?: Json | null
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: Json | null
          experience_years?: number
          full_name?: string
          gender?: string | null
          id?: string
          languages_spoken?: string[] | null
          medical_license_number?: string
          phone_number?: string
          qualification?: string[]
          rating?: number | null
          specialization?: string[]
          status?: Database["public"]["Enums"]["doctor_status"]
          total_consultations?: number | null
          updated_at?: string | null
          verification_documents?: Json | null
          verification_status?: Database["public"]["Enums"]["verification_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      medicine_frequencies: {
        Row: {
          created_at: string | null
          description: string | null
          frequency_code: string
          frequency_name: string
          frequency_symbol: string
          id: number
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          frequency_code: string
          frequency_name: string
          frequency_symbol: string
          id?: number
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          frequency_code?: string
          frequency_name?: string
          frequency_symbol?: string
          id?: number
          is_active?: boolean | null
        }
        Relationships: []
      }
      medicines: {
        Row: {
          category: string | null
          created_at: string | null
          form: string | null
          generic_name: string | null
          id: string
          is_active: boolean | null
          manufacturer: string | null
          medicine_code: string
          medicine_name: string
          strength: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          form?: string | null
          generic_name?: string | null
          id?: string
          is_active?: boolean | null
          manufacturer?: string | null
          medicine_code: string
          medicine_name: string
          strength?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          form?: string | null
          generic_name?: string | null
          id?: string
          is_active?: boolean | null
          manufacturer?: string | null
          medicine_code?: string
          medicine_name?: string
          strength?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prescription_medicines: {
        Row: {
          created_at: string | null
          dosage: string
          duration_days: number
          frequency: string
          frequency_code: string
          frequency_symbol: string
          id: string
          meal_timing: string | null
          medicine_code: string
          medicine_id: string | null
          medicine_name: string
          medicine_sequence: number
          prescription_code: string | null
          prescription_id: string | null
          special_instructions: string | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          duration_days: number
          frequency: string
          frequency_code: string
          frequency_symbol: string
          id?: string
          meal_timing?: string | null
          medicine_code: string
          medicine_id?: string | null
          medicine_name: string
          medicine_sequence: number
          prescription_code?: string | null
          prescription_id?: string | null
          special_instructions?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          duration_days?: number
          frequency?: string
          frequency_code?: string
          frequency_symbol?: string
          id?: string
          meal_timing?: string | null
          medicine_code?: string
          medicine_id?: string | null
          medicine_name?: string
          medicine_sequence?: number
          prescription_code?: string | null
          prescription_id?: string | null
          special_instructions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_medicines_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_medicines_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      prescriptions: {
        Row: {
          consultation_id: string | null
          created_at: string | null
          diagnosis: string | null
          doctor_id: string | null
          follow_up_date: string | null
          general_instructions: string | null
          id: string
          medications: Json | null
          patient_id: string | null
          prescription_date: string | null
          updated_at: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          follow_up_date?: string | null
          general_instructions?: string | null
          id?: string
          medications?: Json | null
          patient_id?: string | null
          prescription_date?: string | null
          updated_at?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          follow_up_date?: string | null
          general_instructions?: string | null
          id?: string
          medications?: Json | null
          patient_id?: string | null
          prescription_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      specializations: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      doctor_status: "active" | "inactive" | "suspended" | "pending_verification"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

// Helper types for doctor authentication
export type DoctorProfile = Tables<'doctor_profiles'>
export type DoctorInsert = TablesInsert<'doctor_profiles'>
export type DoctorUpdate = TablesUpdate<'doctor_profiles'>
export type DoctorStatus = Enums<'doctor_status'>
export type VerificationStatus = Enums<'verification_status'>
export type Specialization = Tables<'specializations'>

// Helper types for medicine and prescription system
export type Medicine = Tables<'medicines'>
export type MedicineInsert = TablesInsert<'medicines'>
export type MedicineUpdate = TablesUpdate<'medicines'>
export type MedicineFrequency = Tables<'medicine_frequencies'>
export type Prescription = Tables<'prescriptions'>
export type PrescriptionInsert = TablesInsert<'prescriptions'>
export type PrescriptionUpdate = TablesUpdate<'prescriptions'>
export type PrescriptionMedicine = Tables<'prescription_medicines'>
export type PrescriptionMedicineInsert = TablesInsert<'prescription_medicines'>
export type PrescriptionMedicineUpdate = TablesUpdate<'prescription_medicines'>