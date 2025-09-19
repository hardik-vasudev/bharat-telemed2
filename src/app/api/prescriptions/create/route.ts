import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { PrescriptionInsert, PrescriptionMedicineInsert } from '@/lib/supabase/types'

interface CreatePrescriptionRequest {
  patientId: string
  doctorId: string
  consultationId?: string
  diagnosis: string
  generalInstructions: string
  followUpDate?: string
  medicines: Array<{
    medicineCode: string
    medicineName: string
    dosage: string
    frequency: string
    frequencyCode: string
    frequencySymbol: string
    durationDays: number
    mealTiming: 'before' | 'after' | 'with'
    instructions?: string
  }>
}

export async function POST(request: NextRequest) {
  console.log('🚀 API /prescriptions/create called')

  try {
    const body: CreatePrescriptionRequest = await request.json()

    console.log('📝 Creating prescription with data:', JSON.stringify(body, null, 2))

    const {
      patientId,
      doctorId,
      consultationId,
      diagnosis,
      generalInstructions,
      followUpDate,
      medicines
    } = body

    // Validate required fields (diagnosis is optional now)
    if (!patientId || !doctorId || medicines.length === 0) {
      console.error('❌ Validation failed: Missing required fields')
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: patientId, doctorId, and at least one medicine'
      }, { status: 400 })
    }

    const supabase = createServerClient()

    // First, check if the prescriptions table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('prescriptions')
      .select('count')
      .limit(1)

    if (tableError) {
      console.error('❌ Database table check failed:', tableError)

      if (tableError.code === '42P01') { // Table does not exist
        return NextResponse.json({
          success: false,
          error: 'Prescription tables not found. Please run the database migration script: \\i database/add_medicine_coding_system.sql',
          details: tableError.message
        }, { status: 500 })
      }

      return NextResponse.json({
        success: false,
        error: 'Database connection error',
        details: tableError.message
      }, { status: 500 })
    }

    console.log('✅ Database tables verified')

    // Start a transaction by creating the prescription first
    const prescriptionData: Record<string, unknown> = {
      patient_id: patientId,
      doctor_id: doctorId,
      prescription_date: new Date().toISOString(),
      medications: [] // Will be updated by the trigger
    }

    // Add optional fields that may not exist in the table yet
    if (consultationId) {
      prescriptionData.consultation_id = consultationId
    }

    if (diagnosis.trim()) {
      prescriptionData.diagnosis = diagnosis.trim()
    }

    if (generalInstructions.trim()) {
      prescriptionData.general_instructions = generalInstructions.trim()
    }

    if (followUpDate) {
      prescriptionData.follow_up_date = followUpDate
    }

    console.log('📄 Inserting prescription data:', prescriptionData)

    const { data: prescription, error: prescriptionError } = await supabase
      .from('prescriptions')
      .insert(prescriptionData)
      .select()
      .single()

    if (prescriptionError) {
      console.error('❌ Error creating prescription:', prescriptionError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create prescription',
        details: prescriptionError.message,
        code: prescriptionError.code
      }, { status: 500 })
    }

    console.log('✅ Prescription created:', prescription)

    // Get medicine IDs for the medicines
    const medicineCodes = medicines.map(m => m.medicineCode)
    const { data: medicineData, error: medicineError } = await supabase
      .from('medicines')
      .select('id, medicine_code')
      .in('medicine_code', medicineCodes)

    if (medicineError) {
      console.error('Error fetching medicine data:', medicineError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch medicine data',
        details: medicineError.message
      }, { status: 500 })
    }

    // Create prescription medicines
    const prescriptionMedicines: PrescriptionMedicineInsert[] = medicines.map((med, index) => {
      const medicineRecord = medicineData?.find(m => m.medicine_code === med.medicineCode)

      return {
        prescription_id: prescription.id,
        medicine_id: medicineRecord?.id || null,
        medicine_code: med.medicineCode,
        medicine_name: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        frequency_code: med.frequencyCode,
        frequency_symbol: med.frequencySymbol,
        duration_days: med.durationDays,
        meal_timing: med.mealTiming,
        special_instructions: med.instructions || null,
        medicine_sequence: index + 1,
        // prescription_code will be auto-generated by the trigger
      }
    })

    const { data: savedMedicines, error: medicinesError } = await supabase
      .from('prescription_medicines')
      .insert(prescriptionMedicines)
      .select()

    if (medicinesError) {
      console.error('Error saving prescription medicines:', medicinesError)
      // Try to cleanup the prescription if medicines failed
      await supabase.from('prescriptions').delete().eq('id', prescription.id)
      return NextResponse.json({
        success: false,
        error: 'Failed to save prescription medicines',
        details: medicinesError.message
      }, { status: 500 })
    }

    // Get the updated prescription with medicines
    const { data: finalPrescription, error: finalError } = await supabase
      .from('prescriptions')
      .select(`
        *,
        prescription_medicines (
          *
        )
      `)
      .eq('id', prescription.id)
      .single()

    if (finalError) {
      console.error('Error fetching final prescription:', finalError)
    }

    return NextResponse.json({
      success: true,
      prescription: finalPrescription || prescription,
      prescriptionId: prescription.id,
      medicinesAdded: savedMedicines?.length || 0
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 })
  }
}