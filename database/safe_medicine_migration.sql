-- Safe Medicine System Migration - Only creates what doesn't exist
-- Run this script in your Supabase SQL Editor

-- ====================================
-- CREATE TABLES (IF NOT EXISTS)
-- ====================================

-- Medicine frequencies table
CREATE TABLE IF NOT EXISTS medicine_frequencies (
    id SERIAL PRIMARY KEY,
    frequency_code VARCHAR(10) NOT NULL UNIQUE,
    frequency_name VARCHAR(50) NOT NULL,
    frequency_symbol VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicines master table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    medicine_code VARCHAR(10) NOT NULL UNIQUE,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    strength VARCHAR(100),
    form VARCHAR(50),
    manufacturer VARCHAR(255),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescription medicines table
CREATE TABLE IF NOT EXISTS prescription_medicines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE RESTRICT,
    medicine_code VARCHAR(10) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed')),
    frequency_code VARCHAR(10) NOT NULL,
    frequency_symbol VARCHAR(20) NOT NULL,
    duration_days INTEGER NOT NULL,
    meal_timing VARCHAR(10) DEFAULT 'after' CHECK (meal_timing IN ('before', 'after', 'with')),
    special_instructions TEXT,
    medicine_sequence INTEGER NOT NULL,
    prescription_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- CREATE INDEXES (IF NOT EXISTS)
-- ====================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medicines_code') THEN
        CREATE INDEX idx_medicines_code ON medicines(medicine_code);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medicines_name') THEN
        CREATE INDEX idx_medicines_name ON medicines(medicine_name);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medicines_category') THEN
        CREATE INDEX idx_medicines_category ON medicines(category);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_medicines_prescription_id') THEN
        CREATE INDEX idx_prescription_medicines_prescription_id ON prescription_medicines(prescription_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_medicines_medicine_code') THEN
        CREATE INDEX idx_prescription_medicines_medicine_code ON prescription_medicines(medicine_code);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_medicines_prescription_code') THEN
        CREATE INDEX idx_prescription_medicines_prescription_code ON prescription_medicines(prescription_code);
    END IF;
END
$$;

-- ====================================
-- ENABLE RLS (SAFE)
-- ====================================

DO $$
BEGIN
    -- Enable RLS only if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'medicines'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'prescription_medicines'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE prescription_medicines ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- ====================================
-- CREATE POLICIES (IF NOT EXISTS)
-- ====================================

DO $$
BEGIN
    -- Medicines policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'medicines'
        AND policyname = 'Anyone can view active medicines'
    ) THEN
        CREATE POLICY "Anyone can view active medicines" ON medicines
            FOR SELECT USING (is_active = true);
    END IF;

    -- Prescription medicines policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'prescription_medicines'
        AND policyname = 'Users can view their prescription medicines'
    ) THEN
        CREATE POLICY "Users can view their prescription medicines" ON prescription_medicines
            FOR SELECT USING (
                prescription_id IN (
                    SELECT id FROM prescriptions WHERE patient_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'prescription_medicines'
        AND policyname = 'Doctors can add medicines to prescriptions'
    ) THEN
        CREATE POLICY "Doctors can add medicines to prescriptions" ON prescription_medicines
            FOR INSERT WITH CHECK (
                prescription_id IN (
                    SELECT id FROM prescriptions WHERE doctor_id IN (
                        SELECT id FROM doctor_profiles WHERE id = auth.uid()
                    )
                )
            );
    END IF;
END
$$;

-- ====================================
-- CREATE OR REPLACE FUNCTIONS
-- ====================================

-- Function to generate prescription code
CREATE OR REPLACE FUNCTION generate_prescription_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.prescription_code := NEW.medicine_code || '-' ||
                            REGEXP_REPLACE(NEW.dosage, '[^0-9]', '', 'g') || '-' ||
                            NEW.duration_days::text;

    IF REGEXP_REPLACE(NEW.dosage, '[^0-9]', '', 'g') = '' THEN
        NEW.prescription_code := NEW.medicine_code || '-1-' || NEW.duration_days::text;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update prescription medicine count
CREATE OR REPLACE FUNCTION update_prescription_medicine_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE prescriptions
        SET medications = (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'medicine_code', pm.medicine_code,
                    'name', pm.medicine_name,
                    'dosage', pm.dosage,
                    'frequency', pm.frequency,
                    'frequency_symbol', pm.frequency_symbol,
                    'duration_days', pm.duration_days,
                    'meal_timing', pm.meal_timing,
                    'instructions', pm.special_instructions,
                    'prescription_code', pm.prescription_code,
                    'sequence', pm.medicine_sequence
                ) ORDER BY pm.medicine_sequence
            )
            FROM prescription_medicines pm
            WHERE pm.prescription_id = NEW.prescription_id
        )
        WHERE id = NEW.prescription_id;
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE prescriptions
        SET medications = (
            SELECT CASE
                WHEN COUNT(*) = 0 THEN '[]'::jsonb
                ELSE jsonb_agg(
                    jsonb_build_object(
                        'medicine_code', pm.medicine_code,
                        'name', pm.medicine_name,
                        'dosage', pm.dosage,
                        'frequency', pm.frequency,
                        'frequency_symbol', pm.frequency_symbol,
                        'duration_days', pm.duration_days,
                        'meal_timing', pm.meal_timing,
                        'instructions', pm.special_instructions,
                        'prescription_code', pm.prescription_code,
                        'sequence', pm.medicine_sequence
                    ) ORDER BY pm.medicine_sequence
                )
            END
            FROM prescription_medicines pm
            WHERE pm.prescription_id = OLD.prescription_id
        )
        WHERE id = OLD.prescription_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- CREATE TRIGGERS (SAFE)
-- ====================================

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS trigger_generate_prescription_code ON prescription_medicines;
DROP TRIGGER IF EXISTS trigger_update_medicine_count ON prescription_medicines;
DROP TRIGGER IF EXISTS trigger_medicines_updated_at ON medicines;

-- Create triggers
CREATE TRIGGER trigger_generate_prescription_code
    BEFORE INSERT OR UPDATE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION generate_prescription_code();

CREATE TRIGGER trigger_update_medicine_count
    AFTER INSERT OR DELETE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_prescription_medicine_count();

CREATE TRIGGER trigger_medicines_updated_at
    BEFORE UPDATE ON medicines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- INSERT SAMPLE DATA (IF TABLES ARE EMPTY)
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
WHERE NOT EXISTS (SELECT 1 FROM medicine_frequencies LIMIT 1)
ON CONFLICT (frequency_code) DO NOTHING;

-- Sample medicines
INSERT INTO medicines (medicine_code, medicine_name, generic_name, strength, form, manufacturer, category)
SELECT * FROM (VALUES
    ('AC', 'Paracetamol', 'Acetaminophen', '500mg', 'tablet', 'Generic Pharma', 'pain_relief'),
    ('IB', 'Ibuprofen', 'Ibuprofen', '400mg', 'tablet', 'Generic Pharma', 'pain_relief'),
    ('AS', 'Aspirin', 'Acetylsalicylic Acid', '325mg', 'tablet', 'Generic Pharma', 'pain_relief'),
    ('DC', 'Diclofenac', 'Diclofenac Sodium', '50mg', 'tablet', 'Generic Pharma', 'pain_relief'),
    ('AX', 'Amoxicillin', 'Amoxicillin', '500mg', 'capsule', 'Generic Pharma', 'antibiotic'),
    ('AZ', 'Azithromycin', 'Azithromycin', '250mg', 'tablet', 'Generic Pharma', 'antibiotic'),
    ('CX', 'Cephalexin', 'Cephalexin', '500mg', 'capsule', 'Generic Pharma', 'antibiotic'),
    ('CF', 'Ciprofloxacin', 'Ciprofloxacin', '500mg', 'tablet', 'Generic Pharma', 'antibiotic'),
    ('OM', 'Omeprazole', 'Omeprazole', '20mg', 'capsule', 'Generic Pharma', 'antacid'),
    ('RT', 'Ranitidine', 'Ranitidine', '150mg', 'tablet', 'Generic Pharma', 'antacid'),
    ('AL', 'Antacid', 'Aluminum + Magnesium Hydroxide', '10ml', 'syrup', 'Generic Pharma', 'antacid'),
    ('CT', 'Cetirizine', 'Cetirizine', '10mg', 'tablet', 'Generic Pharma', 'antihistamine'),
    ('LT', 'Loratadine', 'Loratadine', '10mg', 'tablet', 'Generic Pharma', 'antihistamine'),
    ('CS', 'Cough Syrup', 'Dextromethorphan', '10mg/5ml', 'syrup', 'Generic Pharma', 'cough_cold'),
    ('DH', 'Dextromethorphan', 'Dextromethorphan HBr', '15mg', 'tablet', 'Generic Pharma', 'cough_cold'),
    ('VD', 'Vitamin D3', 'Cholecalciferol', '60000IU', 'capsule', 'Generic Pharma', 'vitamin'),
    ('VB', 'Vitamin B Complex', 'B-Complex', '1 tablet', 'tablet', 'Generic Pharma', 'vitamin'),
    ('MV', 'Multivitamin', 'Multivitamin', '1 tablet', 'tablet', 'Generic Pharma', 'vitamin'),
    ('OR', 'ORS', 'Oral Rehydration Salts', '1 packet', 'powder', 'Generic Pharma', 'emergency'),
    ('IN', 'Insulin', 'Human Insulin', '100IU/ml', 'injection', 'Generic Pharma', 'diabetes')
) AS new_medicines(medicine_code, medicine_name, generic_name, strength, form, manufacturer, category)
WHERE NOT EXISTS (SELECT 1 FROM medicines LIMIT 1)
ON CONFLICT (medicine_code) DO NOTHING;

-- ====================================
-- CREATE UTILITY FUNCTIONS
-- ====================================

CREATE OR REPLACE FUNCTION add_medicine_to_prescription(
    p_prescription_id UUID,
    p_medicine_code VARCHAR(10),
    p_dosage VARCHAR(100),
    p_frequency VARCHAR(20),
    p_duration_days INTEGER,
    p_meal_timing VARCHAR(10) DEFAULT 'after',
    p_special_instructions TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_medicine_id UUID;
    v_medicine_name VARCHAR(255);
    v_frequency_symbol VARCHAR(20);
    v_sequence INTEGER;
    v_prescription_medicine_id UUID;
BEGIN
    SELECT id, medicine_name INTO v_medicine_id, v_medicine_name
    FROM medicines
    WHERE medicine_code = p_medicine_code AND is_active = true;

    IF v_medicine_id IS NULL THEN
        RAISE EXCEPTION 'Medicine with code % not found', p_medicine_code;
    END IF;

    SELECT frequency_symbol INTO v_frequency_symbol
    FROM medicine_frequencies
    WHERE frequency_code = CASE
        WHEN p_frequency = 'once_daily' THEN 'OD'
        WHEN p_frequency = 'twice_daily' THEN 'BD'
        WHEN p_frequency = 'thrice_daily' THEN 'TDS'
        WHEN p_frequency = 'four_times_daily' THEN 'QID'
        WHEN p_frequency = 'as_needed' THEN 'SOS'
        ELSE 'BD'
    END;

    SELECT COALESCE(MAX(medicine_sequence), 0) + 1 INTO v_sequence
    FROM prescription_medicines
    WHERE prescription_id = p_prescription_id;

    INSERT INTO prescription_medicines (
        prescription_id, medicine_id, medicine_code, medicine_name,
        dosage, frequency, frequency_code, frequency_symbol, duration_days,
        meal_timing, special_instructions, medicine_sequence
    ) VALUES (
        p_prescription_id, v_medicine_id, p_medicine_code, v_medicine_name,
        p_dosage, p_frequency,
        CASE
            WHEN p_frequency = 'once_daily' THEN 'OD'
            WHEN p_frequency = 'twice_daily' THEN 'BD'
            WHEN p_frequency = 'thrice_daily' THEN 'TDS'
            WHEN p_frequency = 'four_times_daily' THEN 'QID'
            WHEN p_frequency = 'as_needed' THEN 'SOS'
            ELSE 'BD'
        END,
        v_frequency_symbol, p_duration_days,
        p_meal_timing, p_special_instructions, v_sequence
    ) RETURNING id INTO v_prescription_medicine_id;

    RETURN v_prescription_medicine_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_active_medicines()
RETURNS TABLE (
    medicine_code VARCHAR(10),
    medicine_name VARCHAR(255),
    generic_name VARCHAR(255),
    strength VARCHAR(100),
    form VARCHAR(50),
    category VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.medicine_code,
        m.medicine_name,
        m.generic_name,
        m.strength,
        m.form,
        m.category
    FROM medicines m
    WHERE m.is_active = true
    ORDER BY m.medicine_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- SUCCESS MESSAGE
-- ====================================
DO $$
BEGIN
    RAISE NOTICE '✅ Safe Medicine System Migration Completed!';
    RAISE NOTICE '📋 Tables: medicines, prescription_medicines, medicine_frequencies created/verified';
    RAISE NOTICE '💊 Sample medicines: AC (Paracetamol), IB (Ibuprofen), AZ (Azithromycin)... added if tables were empty';
    RAISE NOTICE '🏷️  Prescription Format: AC-2-7 (medicine-dosage-days) auto-generated';
    RAISE NOTICE '🔗 Integrated with existing prescriptions table';
    RAISE NOTICE '🔒 Row Level Security policies created/verified';
    RAISE NOTICE '';
    RAISE NOTICE '📖 Test the system:';
    RAISE NOTICE '   1. Go to /teleconsultation page';
    RAISE NOTICE '   2. Open Prescription Builder';
    RAISE NOTICE '   3. Search for medicines (should work now!)';
    RAISE NOTICE '   4. Save prescription (no more errors!)';
END
$$;