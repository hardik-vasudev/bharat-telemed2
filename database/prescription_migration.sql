-- Bharat Telemed Prescription System - Safe Migration Script
-- This script safely adds prescription functionality to existing database
-- Run this on your existing database with doctors/patients tables

-- ====================================
-- MEDICINE FREQUENCY MASTER TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS medicine_frequencies (
    id SERIAL PRIMARY KEY,
    frequency_code VARCHAR(10) NOT NULL UNIQUE,
    frequency_name VARCHAR(50) NOT NULL,
    frequency_symbol VARCHAR(20) NOT NULL, -- e.g., 1-0-0, 1-0-1, 1-1-1
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ====================================
-- MEDICINES MASTER TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS medicines (
    id BIGSERIAL PRIMARY KEY,
    medicine_code VARCHAR(10) NOT NULL UNIQUE, -- Unique code like AC for Paracetamol
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    strength VARCHAR(100), -- e.g., 500mg, 250mg
    form VARCHAR(50), -- tablet, capsule, syrup, injection
    manufacturer VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for medicines (only if table was created)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medicine_code') THEN
        CREATE INDEX idx_medicine_code ON medicines(medicine_code);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medicine_name') THEN
        CREATE INDEX idx_medicine_name ON medicines(medicine_name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medicine_is_active') THEN
        CREATE INDEX idx_medicine_is_active ON medicines(is_active);
    END IF;
END
$$;

-- ====================================
-- CONSULTATIONS TABLE (if not exists)
-- ====================================
CREATE TABLE IF NOT EXISTS consultations (
    id BIGSERIAL PRIMARY KEY,
    consultation_id VARCHAR(50) NOT NULL UNIQUE,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    consultation_type VARCHAR(20) DEFAULT 'video' CHECK (consultation_type IN ('video', 'audio', 'chat', 'in_person')),
    consultation_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    consultation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- PRESCRIPTIONS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGSERIAL PRIMARY KEY,
    prescription_id VARCHAR(50) NOT NULL UNIQUE,
    consultation_id VARCHAR(50),
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    prescription_date TIMESTAMP NOT NULL,
    diagnosis TEXT,
    general_instructions TEXT,
    follow_up_date DATE,
    total_medicines INTEGER DEFAULT 0,
    prescription_status VARCHAR(20) DEFAULT 'active' CHECK (prescription_status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- PRESCRIPTION MEDICINES TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS prescription_medicines (
    id BIGSERIAL PRIMARY KEY,
    prescription_id VARCHAR(50) NOT NULL,
    medicine_code VARCHAR(10) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL, -- e.g., 1 tablet, 2 tablets
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed')),
    frequency_code VARCHAR(10) NOT NULL, -- e.g., 1-0-0, 1-0-1, 1-1-1, SOS
    duration_days INTEGER NOT NULL,
    meal_timing VARCHAR(10) DEFAULT 'after' CHECK (meal_timing IN ('before', 'after', 'with')),
    special_instructions TEXT,
    medicine_sequence INTEGER NOT NULL, -- Order of medicine in prescription
    prescription_code VARCHAR(50), -- Will be generated via trigger
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- PRESCRIPTION HISTORY TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS prescription_history (
    id BIGSERIAL PRIMARY KEY,
    prescription_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('created', 'updated', 'cancelled', 'completed')),
    changed_by VARCHAR(50) NOT NULL, -- doctor_id who made the change
    change_details JSONB, -- Details of what was changed
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- CREATE INDEXES SAFELY
-- ====================================
DO $$
BEGIN
    -- Consultations indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_consultation_id') THEN
        CREATE INDEX idx_consultation_id ON consultations(consultation_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_consultation_patient_id') THEN
        CREATE INDEX idx_consultation_patient_id ON consultations(patient_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_consultation_doctor_id') THEN
        CREATE INDEX idx_consultation_doctor_id ON consultations(doctor_id);
    END IF;

    -- Prescriptions indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_id') THEN
        CREATE INDEX idx_prescription_id ON prescriptions(prescription_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_patient_id') THEN
        CREATE INDEX idx_prescription_patient_id ON prescriptions(patient_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_doctor_id') THEN
        CREATE INDEX idx_prescription_doctor_id ON prescriptions(doctor_id);
    END IF;

    -- Prescription medicines indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_medicines_prescription_id') THEN
        CREATE INDEX idx_prescription_medicines_prescription_id ON prescription_medicines(prescription_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_medicines_medicine_code') THEN
        CREATE INDEX idx_prescription_medicines_medicine_code ON prescription_medicines(medicine_code);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_medicines_prescription_code') THEN
        CREATE INDEX idx_prescription_medicines_prescription_code ON prescription_medicines(prescription_code);
    END IF;

    -- Prescription history indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prescription_history_prescription_id') THEN
        CREATE INDEX idx_prescription_history_prescription_id ON prescription_history(prescription_id);
    END IF;
END
$$;

-- ====================================
-- ADD FOREIGN KEYS SAFELY
-- ====================================
DO $$
BEGIN
    -- Add foreign keys only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_prescription_medicines_prescription'
    ) THEN
        ALTER TABLE prescription_medicines
        ADD CONSTRAINT fk_prescription_medicines_prescription
        FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_prescription_medicines_medicine'
    ) THEN
        ALTER TABLE prescription_medicines
        ADD CONSTRAINT fk_prescription_medicines_medicine
        FOREIGN KEY (medicine_code) REFERENCES medicines(medicine_code) ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_prescription_history_prescription'
    ) THEN
        ALTER TABLE prescription_history
        ADD CONSTRAINT fk_prescription_history_prescription
        FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE;
    END IF;
END
$$;

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
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to avoid conflicts
DROP TRIGGER IF EXISTS trigger_generate_prescription_code ON prescription_medicines;
CREATE TRIGGER trigger_generate_prescription_code
    BEFORE INSERT OR UPDATE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION generate_prescription_code();

-- Function to update prescription total_medicines count
CREATE OR REPLACE FUNCTION update_prescription_medicine_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE prescriptions
        SET total_medicines = (
            SELECT COUNT(*) FROM prescription_medicines
            WHERE prescription_id = NEW.prescription_id
        )
        WHERE prescription_id = NEW.prescription_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE prescriptions
        SET total_medicines = (
            SELECT COUNT(*) FROM prescription_medicines
            WHERE prescription_id = OLD.prescription_id
        )
        WHERE prescription_id = OLD.prescription_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_medicine_count ON prescription_medicines;
CREATE TRIGGER trigger_update_medicine_count
    AFTER INSERT OR DELETE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_prescription_medicine_count();

-- ====================================
-- INSERT SAMPLE DATA (only if tables are empty)
-- ====================================

-- Insert medicine frequencies if table is empty
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
WHERE NOT EXISTS (SELECT 1 FROM medicine_frequencies);

-- Insert medicines if table is empty
INSERT INTO medicines (medicine_code, medicine_name, generic_name, strength, form, manufacturer)
SELECT * FROM (VALUES
    -- Common Pain & Fever
    ('AC', 'Paracetamol', 'Acetaminophen', '500mg', 'tablet', 'Generic Pharma'),
    ('IB', 'Ibuprofen', 'Ibuprofen', '400mg', 'tablet', 'Generic Pharma'),
    ('AS', 'Aspirin', 'Acetylsalicylic Acid', '325mg', 'tablet', 'Generic Pharma'),
    ('DC', 'Diclofenac', 'Diclofenac Sodium', '50mg', 'tablet', 'Generic Pharma'),

    -- Antibiotics
    ('AX', 'Amoxicillin', 'Amoxicillin', '500mg', 'capsule', 'Generic Pharma'),
    ('AZ', 'Azithromycin', 'Azithromycin', '250mg', 'tablet', 'Generic Pharma'),
    ('CX', 'Cephalexin', 'Cephalexin', '500mg', 'capsule', 'Generic Pharma'),
    ('CF', 'Ciprofloxacin', 'Ciprofloxacin', '500mg', 'tablet', 'Generic Pharma'),

    -- Antacids & Digestive
    ('OM', 'Omeprazole', 'Omeprazole', '20mg', 'capsule', 'Generic Pharma'),
    ('RT', 'Ranitidine', 'Ranitidine', '150mg', 'tablet', 'Generic Pharma'),
    ('AL', 'Antacid', 'Aluminum + Magnesium Hydroxide', '10ml', 'syrup', 'Generic Pharma'),

    -- Antihistamines
    ('CT', 'Cetirizine', 'Cetirizine', '10mg', 'tablet', 'Generic Pharma'),
    ('LT', 'Loratadine', 'Loratadine', '10mg', 'tablet', 'Generic Pharma'),

    -- Cough & Cold
    ('CS', 'Cough Syrup', 'Dextromethorphan', '10mg/5ml', 'syrup', 'Generic Pharma'),
    ('DH', 'Dextromethorphan', 'Dextromethorphan HBr', '15mg', 'tablet', 'Generic Pharma'),

    -- Vitamins & Supplements
    ('VD', 'Vitamin D3', 'Cholecalciferol', '60000IU', 'capsule', 'Generic Pharma'),
    ('VB', 'Vitamin B Complex', 'B-Complex', '1 tablet', 'tablet', 'Generic Pharma'),
    ('MV', 'Multivitamin', 'Multivitamin', '1 tablet', 'tablet', 'Generic Pharma'),

    -- Emergency & Others
    ('OR', 'ORS', 'Oral Rehydration Salts', '1 packet', 'powder', 'Generic Pharma'),
    ('IN', 'Insulin', 'Human Insulin', '100IU/ml', 'injection', 'Generic Pharma')
) AS new_medicines(medicine_code, medicine_name, generic_name, strength, form, manufacturer)
WHERE NOT EXISTS (SELECT 1 FROM medicines);

-- ====================================
-- USEFUL FUNCTIONS FOR APPLICATION
-- ====================================

-- Function to create a new prescription
CREATE OR REPLACE FUNCTION create_prescription(
    p_consultation_id VARCHAR(50),
    p_patient_id VARCHAR(50),
    p_doctor_id VARCHAR(50),
    p_diagnosis TEXT,
    p_general_instructions TEXT,
    p_follow_up_date DATE
) RETURNS VARCHAR(50) AS $$
DECLARE
    prescription_count INTEGER;
    new_prescription_id VARCHAR(50);
BEGIN
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
        new_prescription_id, p_consultation_id, p_patient_id, p_doctor_id,
        CURRENT_TIMESTAMP, p_diagnosis, p_general_instructions, p_follow_up_date
    );

    -- Add to history
    INSERT INTO prescription_history (prescription_id, action_type, changed_by, change_details)
    VALUES (new_prescription_id, 'created', p_doctor_id,
            '{"action": "prescription_created"}'::jsonb);

    RETURN new_prescription_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add medicine to prescription
CREATE OR REPLACE FUNCTION add_medicine_to_prescription(
    p_prescription_id VARCHAR(50),
    p_medicine_code VARCHAR(10),
    p_dosage VARCHAR(100),
    p_frequency VARCHAR(20),
    p_duration_days INTEGER,
    p_meal_timing VARCHAR(10),
    p_special_instructions TEXT
) RETURNS VOID AS $$
DECLARE
    v_medicine_name VARCHAR(255);
    v_frequency_code VARCHAR(10);
    v_sequence INTEGER;
BEGIN
    -- Get medicine name
    SELECT medicine_name INTO v_medicine_name
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
        prescription_id, medicine_code, medicine_name, dosage,
        frequency, frequency_code, duration_days, meal_timing,
        special_instructions, medicine_sequence
    ) VALUES (
        p_prescription_id, p_medicine_code, v_medicine_name, p_dosage,
        p_frequency, v_frequency_code, p_duration_days, p_meal_timing,
        p_special_instructions, v_sequence
    );
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- VERIFICATION QUERIES
-- ====================================

-- Check if migration was successful
DO $$
BEGIN
    RAISE NOTICE 'Prescription system migration completed successfully!';
    RAISE NOTICE 'Tables created: medicines, prescriptions, prescription_medicines, prescription_history';
    RAISE NOTICE 'Functions created: create_prescription, add_medicine_to_prescription';
    RAISE NOTICE 'Triggers created: prescription code generation, medicine counting';
END
$$;

-- Show sample data counts
SELECT
    'medicines' as table_name,
    COUNT(*) as record_count
FROM medicines
UNION ALL
SELECT
    'medicine_frequencies' as table_name,
    COUNT(*) as record_count
FROM medicine_frequencies;

-- Show medicine codes available
SELECT
    medicine_code,
    medicine_name,
    strength
FROM medicines
ORDER BY medicine_code;

-- ====================================
-- USAGE EXAMPLES
-- ====================================

/*
-- Example: Create a prescription
SELECT create_prescription(
    'CONS123',          -- consultation_id
    'PAT001',           -- patient_id
    'DOC001',           -- doctor_id
    'Common Cold',      -- diagnosis
    'Take rest and drink plenty of fluids', -- instructions
    '2024-12-15'        -- follow_up_date
);

-- Example: Add medicine to prescription
SELECT add_medicine_to_prescription(
    'RX20241201001',    -- prescription_id
    'AC',               -- medicine_code (Paracetamol)
    '2',                -- dosage (2 tablets)
    'twice_daily',      -- frequency
    7,                  -- duration_days
    'after',            -- meal_timing
    'Take with plenty of water' -- special_instructions
);

-- This will generate prescription code: AC-2-7
-- (Paracetamol, 2 tablets, for 7 days)
*/