-- Bharat Telemed Prescription System for Supabase
-- This creates prescription functionality that integrates with Supabase auth.users

-- ====================================
-- DOCTOR PROFILES TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    specialization TEXT,
    registration_number VARCHAR(100),
    clinic_name VARCHAR(255),
    clinic_address TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- PATIENT PROFILES TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- MEDICINE FREQUENCY MASTER TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS medicine_frequencies (
    id SERIAL PRIMARY KEY,
    frequency_code VARCHAR(10) NOT NULL UNIQUE,
    frequency_name VARCHAR(50) NOT NULL,
    frequency_symbol VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ====================================
-- MEDICINES MASTER TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_code VARCHAR(10) NOT NULL UNIQUE,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    strength VARCHAR(100),
    form VARCHAR(50),
    manufacturer VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- CONSULTATIONS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id VARCHAR(50) NOT NULL UNIQUE,
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    consultation_type VARCHAR(20) DEFAULT 'video' CHECK (consultation_type IN ('video', 'audio', 'chat', 'in_person')),
    consultation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    consultation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- PRESCRIPTIONS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id VARCHAR(50) NOT NULL UNIQUE,
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    prescription_date TIMESTAMP WITH TIME ZONE NOT NULL,
    diagnosis TEXT,
    general_instructions TEXT,
    follow_up_date DATE,
    total_medicines INTEGER DEFAULT 0,
    prescription_status VARCHAR(20) DEFAULT 'active' CHECK (prescription_status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- PRESCRIPTION MEDICINES TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS prescription_medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE RESTRICT,
    medicine_code VARCHAR(10) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed')),
    frequency_code VARCHAR(10) NOT NULL,
    duration_days INTEGER NOT NULL,
    meal_timing VARCHAR(10) DEFAULT 'after' CHECK (meal_timing IN ('before', 'after', 'with')),
    special_instructions TEXT,
    medicine_sequence INTEGER NOT NULL,
    prescription_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- PRESCRIPTION HISTORY TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS prescription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('created', 'updated', 'cancelled', 'completed')),
    changed_by UUID REFERENCES doctor_profiles(id) ON DELETE SET NULL,
    change_details JSONB,
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- CREATE INDEXES
-- ====================================
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_doctor_id ON doctor_profiles(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_patient_id ON patient_profiles(patient_id);
CREATE INDEX IF NOT EXISTS idx_medicines_code ON medicines(medicine_code);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(medicine_name);
CREATE INDEX IF NOT EXISTS idx_consultations_consultation_id ON consultations(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_prescription_id ON prescriptions(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medicines_prescription_id ON prescription_medicines(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medicines_medicine_code ON prescription_medicines(medicine_code);
CREATE INDEX IF NOT EXISTS idx_prescription_medicines_prescription_code ON prescription_medicines(prescription_code);

-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================

-- Enable RLS on all tables
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_history ENABLE ROW LEVEL SECURITY;

-- Doctor profiles policies
CREATE POLICY "Doctors can view their own profile" ON doctor_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile" ON doctor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Patient profiles policies
CREATE POLICY "Patients can view their own profile" ON patient_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Patients can update their own profile" ON patient_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Doctors can view patient profiles during consultations
CREATE POLICY "Doctors can view patient profiles" ON patient_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM doctor_profiles dp
            WHERE dp.user_id = auth.uid()
        )
    );

-- Consultations policies
CREATE POLICY "Users can view their own consultations" ON consultations
    FOR SELECT USING (
        patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()) OR
        doctor_id IN (SELECT id FROM doctor_profiles WHERE user_id = auth.uid())
    );

-- Prescriptions policies
CREATE POLICY "Users can view their own prescriptions" ON prescriptions
    FOR SELECT USING (
        patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()) OR
        doctor_id IN (SELECT id FROM doctor_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
    FOR INSERT WITH CHECK (
        doctor_id IN (SELECT id FROM doctor_profiles WHERE user_id = auth.uid())
    );

-- Prescription medicines policies
CREATE POLICY "Users can view prescription medicines" ON prescription_medicines
    FOR SELECT USING (
        prescription_id IN (
            SELECT id FROM prescriptions WHERE
            patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()) OR
            doctor_id IN (SELECT id FROM doctor_profiles WHERE user_id = auth.uid())
        )
    );

-- ====================================
-- FUNCTIONS AND TRIGGERS
-- ====================================

-- Function to generate prescription code
CREATE OR REPLACE FUNCTION generate_prescription_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.prescription_code := NEW.medicine_code || '-' ||
                            REGEXP_REPLACE(NEW.dosage, '[^0-9]', '', 'g') || '-' ||
                            NEW.duration_days::text;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for prescription code generation
DROP TRIGGER IF EXISTS trigger_generate_prescription_code ON prescription_medicines;
CREATE TRIGGER trigger_generate_prescription_code
    BEFORE INSERT OR UPDATE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION generate_prescription_code();

-- Function to update medicine count
CREATE OR REPLACE FUNCTION update_prescription_medicine_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE prescriptions
        SET total_medicines = (
            SELECT COUNT(*) FROM prescription_medicines
            WHERE prescription_id = NEW.prescription_id
        )
        WHERE id = NEW.prescription_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE prescriptions
        SET total_medicines = (
            SELECT COUNT(*) FROM prescription_medicines
            WHERE prescription_id = OLD.prescription_id
        )
        WHERE id = OLD.prescription_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for medicine count
DROP TRIGGER IF EXISTS trigger_update_medicine_count ON prescription_medicines;
CREATE TRIGGER trigger_update_medicine_count
    AFTER INSERT OR DELETE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_prescription_medicine_count();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS trigger_doctor_profiles_updated_at ON doctor_profiles;
CREATE TRIGGER trigger_doctor_profiles_updated_at
    BEFORE UPDATE ON doctor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_patient_profiles_updated_at ON patient_profiles;
CREATE TRIGGER trigger_patient_profiles_updated_at
    BEFORE UPDATE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- INSERT SAMPLE DATA
-- ====================================

-- Medicine frequencies
INSERT INTO medicine_frequencies (frequency_code, frequency_name, frequency_symbol, description)
SELECT * FROM (VALUES
    ('OD', 'Once Daily', '1-0-0', 'Take once a day'),
    ('BD', 'Twice Daily', '1-0-1', 'Take twice a day (morning and evening)'),
    ('TDS', 'Thrice Daily', '1-1-1', 'Take three times a day'),
    ('QID', 'Four Times Daily', '1-1-1-1', 'Take four times a day'),
    ('SOS', 'As Needed', 'SOS', 'Take as needed when symptoms occur'),
    ('STAT', 'Immediately', 'STAT', 'Take immediately, single dose'),
    ('HS', 'At Bedtime', 'HS', 'Take at bedtime'),
    ('AC', 'Before Meals', 'AC', 'Take before meals'),
    ('PC', 'After Meals', 'PC', 'Take after meals')
) AS new_data(frequency_code, frequency_name, frequency_symbol, description)
WHERE NOT EXISTS (SELECT 1 FROM medicine_frequencies LIMIT 1);

-- Sample medicines
INSERT INTO medicines (medicine_code, medicine_name, generic_name, strength, form, manufacturer)
SELECT * FROM (VALUES
    ('AC', 'Paracetamol', 'Acetaminophen', '500mg', 'tablet', 'Generic Pharma'),
    ('IB', 'Ibuprofen', 'Ibuprofen', '400mg', 'tablet', 'Generic Pharma'),
    ('AS', 'Aspirin', 'Acetylsalicylic Acid', '325mg', 'tablet', 'Generic Pharma'),
    ('DC', 'Diclofenac', 'Diclofenac Sodium', '50mg', 'tablet', 'Generic Pharma'),
    ('AX', 'Amoxicillin', 'Amoxicillin', '500mg', 'capsule', 'Generic Pharma'),
    ('AZ', 'Azithromycin', 'Azithromycin', '250mg', 'tablet', 'Generic Pharma'),
    ('CX', 'Cephalexin', 'Cephalexin', '500mg', 'capsule', 'Generic Pharma'),
    ('CF', 'Ciprofloxacin', 'Ciprofloxacin', '500mg', 'tablet', 'Generic Pharma'),
    ('OM', 'Omeprazole', 'Omeprazole', '20mg', 'capsule', 'Generic Pharma'),
    ('RT', 'Ranitidine', 'Ranitidine', '150mg', 'tablet', 'Generic Pharma'),
    ('CT', 'Cetirizine', 'Cetirizine', '10mg', 'tablet', 'Generic Pharma'),
    ('LT', 'Loratadine', 'Loratadine', '10mg', 'tablet', 'Generic Pharma'),
    ('CS', 'Cough Syrup', 'Dextromethorphan', '10mg/5ml', 'syrup', 'Generic Pharma'),
    ('VD', 'Vitamin D3', 'Cholecalciferol', '60000IU', 'capsule', 'Generic Pharma'),
    ('VB', 'Vitamin B Complex', 'B-Complex', '1 tablet', 'tablet', 'Generic Pharma'),
    ('MV', 'Multivitamin', 'Multivitamin', '1 tablet', 'tablet', 'Generic Pharma'),
    ('OR', 'ORS', 'Oral Rehydration Salts', '1 packet', 'powder', 'Generic Pharma')
) AS new_medicines(medicine_code, medicine_name, generic_name, strength, form, manufacturer)
WHERE NOT EXISTS (SELECT 1 FROM medicines LIMIT 1);

-- ====================================
-- USEFUL FUNCTIONS FOR FRONTEND
-- ====================================

-- Function to create prescription (called from frontend)
CREATE OR REPLACE FUNCTION create_prescription(
    p_consultation_id VARCHAR(50),
    p_patient_id UUID,
    p_diagnosis TEXT,
    p_general_instructions TEXT,
    p_follow_up_date DATE
) RETURNS UUID AS $$
DECLARE
    prescription_count INTEGER;
    new_prescription_id VARCHAR(50);
    prescription_uuid UUID;
    doctor_profile_id UUID;
BEGIN
    -- Get doctor profile ID from current user
    SELECT id INTO doctor_profile_id
    FROM doctor_profiles
    WHERE user_id = auth.uid();

    IF doctor_profile_id IS NULL THEN
        RAISE EXCEPTION 'User is not a doctor';
    END IF;

    -- Generate unique prescription ID
    SELECT COUNT(*) + 1 INTO prescription_count
    FROM prescriptions
    WHERE DATE(prescription_date) = CURRENT_DATE;

    new_prescription_id := 'RX' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') ||
                          LPAD(prescription_count::text, 4, '0');

    -- Insert prescription
    INSERT INTO prescriptions (
        prescription_id, consultation_id, patient_id, doctor_id,
        prescription_date, diagnosis, general_instructions, follow_up_date
    ) VALUES (
        new_prescription_id,
        (SELECT id FROM consultations WHERE consultation_id = p_consultation_id),
        p_patient_id,
        doctor_profile_id,
        NOW(),
        p_diagnosis,
        p_general_instructions,
        p_follow_up_date
    ) RETURNING id INTO prescription_uuid;

    -- Add to history
    INSERT INTO prescription_history (prescription_id, action_type, changed_by, change_details)
    VALUES (prescription_uuid, 'created', doctor_profile_id,
            '{"action": "prescription_created"}'::jsonb);

    RETURN prescription_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add medicine to prescription
CREATE OR REPLACE FUNCTION add_medicine_to_prescription(
    p_prescription_id UUID,
    p_medicine_code VARCHAR(10),
    p_dosage VARCHAR(100),
    p_frequency VARCHAR(20),
    p_duration_days INTEGER,
    p_meal_timing VARCHAR(10),
    p_special_instructions TEXT
) RETURNS VOID AS $$
DECLARE
    v_medicine_id UUID;
    v_medicine_name VARCHAR(255);
    v_frequency_code VARCHAR(10);
    v_sequence INTEGER;
BEGIN
    -- Get medicine details
    SELECT id, medicine_name INTO v_medicine_id, v_medicine_name
    FROM medicines
    WHERE medicine_code = p_medicine_code;

    -- Get frequency code
    SELECT frequency_symbol INTO v_frequency_code
    FROM medicine_frequencies
    WHERE frequency_code = CASE
        WHEN p_frequency = 'once_daily' THEN 'OD'
        WHEN p_frequency = 'twice_daily' THEN 'BD'
        WHEN p_frequency = 'thrice_daily' THEN 'TDS'
        WHEN p_frequency = 'four_times_daily' THEN 'QID'
        WHEN p_frequency = 'as_needed' THEN 'SOS'
    END;

    -- Get next sequence number
    SELECT COALESCE(MAX(medicine_sequence), 0) + 1 INTO v_sequence
    FROM prescription_medicines
    WHERE prescription_id = p_prescription_id;

    -- Insert medicine
    INSERT INTO prescription_medicines (
        prescription_id, medicine_id, medicine_code, medicine_name, dosage,
        frequency, frequency_code, duration_days, meal_timing,
        special_instructions, medicine_sequence
    ) VALUES (
        p_prescription_id, v_medicine_id, p_medicine_code, v_medicine_name, p_dosage,
        p_frequency, v_frequency_code, p_duration_days, p_meal_timing,
        p_special_instructions, v_sequence
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- FINAL SUCCESS MESSAGE
-- ====================================
DO $$
BEGIN
    RAISE NOTICE 'Bharat Telemed Prescription System installed successfully!';
    RAISE NOTICE 'Tables: doctor_profiles, patient_profiles, consultations, prescriptions, prescription_medicines';
    RAISE NOTICE 'Medicine codes: AC (Paracetamol), IB (Ibuprofen), AZ (Azithromycin), etc.';
    RAISE NOTICE 'Prescription format: AC-2-7 (medicine-dosage-days)';
    RAISE NOTICE 'Row Level Security enabled for data protection';
END
$$;