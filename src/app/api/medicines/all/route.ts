import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Medicine } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get all active medicines
    const { data: medicines, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('is_active', true)
      .order('medicine_name')

    if (error) {
      console.error('❌ Error fetching medicines:', error)

      if (error.code === '42P01') { // Table does not exist
        return NextResponse.json({
          success: false,
          error: 'Medicine tables not found. Please run the database migration script first.',
          details: 'Run: \\i database/add_medicine_coding_system.sql in your Supabase SQL editor'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: false,
        error: 'Failed to fetch medicines',
        details: error.message
      }, { status: 500 })
    }

    // Transform data to match frontend expectations
    const transformedMedicines = medicines?.map((medicine: Medicine) => ({
      code: medicine.medicine_code,
      name: medicine.medicine_name,
      genericName: medicine.generic_name,
      strength: medicine.strength,
      form: medicine.form,
      category: medicine.category,
      manufacturer: medicine.manufacturer
    })) || []

    return NextResponse.json({
      success: true,
      medicines: transformedMedicines
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}