-- Bharat Telemed Prescription Database Schema for PostgreSQL
-- Created for professional prescription management system

-- ====================================
-- MEDICINES MASTER TABLE
-- ====================================
CREATE TABLE medicines (
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

-- Create indexes for medicines
CREATE INDEX idx_medicine_code ON medicines(medicine_code);
CREATE INDEX idx_medicine_name ON medicines(medicine_name);
CREATE INDEX idx_is_active ON medicines(is_active);

-- Add comments
COMMENT ON TABLE medicines IS 'Master table for all medicines with unique codes';
COMMENT ON COLUMN medicines.medicine_code IS 'Unique code like AC for Paracetamol';
COMMENT ON COLUMN medicines.strength IS 'e.g., 500mg, 250mg';
COMMENT ON COLUMN medicines.form IS 'tablet, capsule, syrup, injection';

-- ====================================
-- DOCTORS TABLE
-- ====================================
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    specialization TEXT,
    registration_number VARCHAR(100),
    clinic_name VARCHAR(255),
    clinic_address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for doctors
CREATE INDEX idx_doctor_id ON doctors(doctor_id);
CREATE INDEX idx_doctor_email ON doctors(email);
CREATE INDEX idx_doctor_is_active ON doctors(is_active);

COMMENT ON TABLE doctors IS 'Doctor information for prescriptions';

-- ====================================
-- PATIENTS TABLE
-- ====================================
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    emergency_contact VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for patients
CREATE INDEX idx_patient_id ON patients(patient_id);
CREATE INDEX idx_patient_email ON patients(email);
CREATE INDEX idx_patient_phone ON patients(phone);
CREATE INDEX idx_patient_is_active ON patients(is_active);

COMMENT ON TABLE patients IS 'Patient information';

-- ====================================
-- CONSULTATIONS TABLE
-- ====================================
CREATE TABLE consultations (
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

-- Create indexes for consultations
CREATE INDEX idx_consultation_id ON consultations(consultation_id);
CREATE INDEX idx_consultation_patient_id ON consultations(patient_id);
CREATE INDEX idx_consultation_doctor_id ON consultations(doctor_id);
CREATE INDEX idx_consultation_date ON consultations(consultation_date);
CREATE INDEX idx_consultation_status ON consultations(status);

-- Add foreign keys for consultations
ALTER TABLE consultations ADD CONSTRAINT fk_consultation_patient
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE;
ALTER TABLE consultations ADD CONSTRAINT fk_consultation_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE;

COMMENT ON TABLE consultations IS 'Consultation sessions between doctors and patients';

-- ====================================
-- PRESCRIPTIONS TABLE
-- ====================================
CREATE TABLE prescriptions (
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

-- Create indexes for prescriptions
CREATE INDEX idx_prescription_id ON prescriptions(prescription_id);
CREATE INDEX idx_prescription_consultation_id ON prescriptions(consultation_id);
CREATE INDEX idx_prescription_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescription_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescription_date ON prescriptions(prescription_date);
CREATE INDEX idx_prescription_status ON prescriptions(prescription_status);

-- Add foreign keys for prescriptions
ALTER TABLE prescriptions ADD CONSTRAINT fk_prescription_consultation
    FOREIGN KEY (consultation_id) REFERENCES consultations(consultation_id) ON DELETE SET NULL;
ALTER TABLE prescriptions ADD CONSTRAINT fk_prescription_patient
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE;
ALTER TABLE prescriptions ADD CONSTRAINT fk_prescription_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE;

COMMENT ON TABLE prescriptions IS 'Main prescription records';

-- ====================================
-- PRESCRIPTION MEDICINES TABLE
-- ====================================
CREATE TABLE prescription_medicines (
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

-- Create indexes for prescription_medicines
CREATE INDEX idx_prescription_medicines_prescription_id ON prescription_medicines(prescription_id);
CREATE INDEX idx_prescription_medicines_medicine_code ON prescription_medicines(medicine_code);
CREATE INDEX idx_prescription_medicines_prescription_code ON prescription_medicines(prescription_code);
CREATE INDEX idx_prescription_medicines_sequence ON prescription_medicines(medicine_sequence);
CREATE INDEX idx_prescription_medicines_composite ON prescription_medicines(prescription_id, medicine_sequence);

-- Add foreign keys for prescription_medicines
ALTER TABLE prescription_medicines ADD CONSTRAINT fk_prescription_medicines_prescription
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE;
ALTER TABLE prescription_medicines ADD CONSTRAINT fk_prescription_medicines_medicine
    FOREIGN KEY (medicine_code) REFERENCES medicines(medicine_code) ON DELETE RESTRICT;

COMMENT ON TABLE prescription_medicines IS 'Individual medicines in each prescription with auto-generated codes';
COMMENT ON COLUMN prescription_medicines.dosage IS 'e.g., 1 tablet, 2 tablets';
COMMENT ON COLUMN prescription_medicines.frequency_code IS 'e.g., 1-0-0, 1-0-1, 1-1-1, SOS';
COMMENT ON COLUMN prescription_medicines.medicine_sequence IS 'Order of medicine in prescription';

-- ====================================
-- PRESCRIPTION HISTORY TABLE (for tracking changes)
-- ====================================
CREATE TABLE prescription_history (
    id BIGSERIAL PRIMARY KEY,
    prescription_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('created', 'updated', 'cancelled', 'completed')),
    changed_by VARCHAR(50) NOT NULL, -- doctor_id who made the change
    change_details JSONB, -- Details of what was changed
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for prescription_history
CREATE INDEX idx_prescription_history_prescription_id ON prescription_history(prescription_id);
CREATE INDEX idx_prescription_history_action_type ON prescription_history(action_type);
CREATE INDEX idx_prescription_history_changed_by ON prescription_history(changed_by);
CREATE INDEX idx_prescription_history_timestamp ON prescription_history(action_timestamp);

-- Add foreign key for prescription_history
ALTER TABLE prescription_history ADD CONSTRAINT fk_prescription_history_prescription
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE;

COMMENT ON TABLE prescription_history IS 'Audit trail for prescription changes';
COMMENT ON COLUMN prescription_history.changed_by IS 'doctor_id who made the change';
COMMENT ON COLUMN prescription_history.change_details IS 'Details of what was changed';

-- ====================================
-- MEDICINE FREQUENCY MASTER TABLE
-- ====================================
CREATE TABLE medicine_frequencies (
    id SERIAL PRIMARY KEY,
    frequency_code VARCHAR(10) NOT NULL UNIQUE,
    frequency_name VARCHAR(50) NOT NULL,
    frequency_symbol VARCHAR(20) NOT NULL, -- e.g., 1-0-0, 1-0-1, 1-1-1
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE medicine_frequencies IS 'Master table for medicine frequency codes';
COMMENT ON COLUMN medicine_frequencies.frequency_symbol IS 'e.g., 1-0-0, 1-0-1, 1-1-1';

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

-- Trigger to auto-generate prescription code
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

-- Trigger to update medicine count
CREATE TRIGGER trigger_update_medicine_count
    AFTER INSERT OR DELETE ON prescription_medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_prescription_medicine_count();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER trigger_medicines_updated_at BEFORE UPDATE ON medicines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- INSERT SAMPLE DATA
-- ====================================

-- Sample Medicine Frequencies
INSERT INTO medicine_frequencies (frequency_code, frequency_name, frequency_symbol, description) VALUES
('OD', 'Once Daily', '1-0-0', 'Take once a day'),
('BD', 'Twice Daily', '1-0-1', 'Take twice a day (morning and evening)'),
('TDS', 'Thrice Daily', '1-1-1', 'Take three times a day'),
('QID', 'Four Times Daily', '1-1-1-1', 'Take four times a day'),
('SOS', 'As Needed', 'SOS', 'Take as needed when symptoms occur'),
('STAT', 'Immediately', 'STAT', 'Take immediately, single dose'),
('HS', 'At Bedtime', 'HS', 'Take at bedtime'),
('AC', 'Before Meals', 'AC', 'Take before meals'),
('PC', 'After Meals', 'PC', 'Take after meals');

-- Sample Medicines with Codes
INSERT INTO medicines (medicine_code, medicine_name, generic_name, strength, form, manufacturer) VALUES
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
('IN', 'Insulin', 'Human Insulin', '100IU/ml', 'injection', 'Generic Pharma');

-- Sample Doctor
INSERT INTO doctors (doctor_id, full_name, email, phone, specialization, registration_number, clinic_name) VALUES
('DOC001', 'Dr. Sarah Wilson', 'sarah.wilson@bharattelemed.com', '+91-9876543210', 'General Medicine,Internal Medicine', 'MCI-12345', 'Bharat Telemed Clinic');

-- Sample Patient
INSERT INTO patients (patient_id, full_name, email, phone, date_of_birth, gender, address) VALUES
('PAT001', 'John Smith', 'john.smith@email.com', '+91-9876543211', '1985-06-15', 'male', '123 Main Street, City, State - 123456');

-- ====================================
-- USEFUL VIEWS
-- ====================================

-- View for complete prescription details
CREATE VIEW prescription_details AS
SELECT
    p.prescription_id,
    p.prescription_date,
    p.diagnosis,
    p.general_instructions,
    p.follow_up_date,
    pt.full_name as patient_name,
    pt.patient_id,
    EXTRACT(YEAR FROM AGE(pt.date_of_birth)) as age,
    d.full_name as doctor_name,
    d.doctor_id,
    d.specialization,
    pm.medicine_name,
    pm.prescription_code,
    pm.dosage,
    pm.frequency,
    pm.frequency_code,
    pm.duration_days,
    pm.meal_timing,
    pm.special_instructions,
    pm.medicine_sequence
FROM prescriptions p
JOIN patients pt ON p.patient_id = pt.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
LEFT JOIN prescription_medicines pm ON p.prescription_id = pm.prescription_id
ORDER BY p.prescription_date DESC, pm.medicine_sequence ASC;

-- View for patient prescription history
CREATE VIEW patient_prescription_history AS
SELECT
    pt.patient_id,
    pt.full_name as patient_name,
    p.prescription_id,
    p.prescription_date,
    p.diagnosis,
    d.full_name as doctor_name,
    COUNT(pm.id) as total_medicines
FROM patients pt
JOIN prescriptions p ON pt.patient_id = p.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
LEFT JOIN prescription_medicines pm ON p.prescription_id = pm.prescription_id
GROUP BY pt.patient_id, pt.full_name, p.prescription_id, p.prescription_date, p.diagnosis, d.full_name
ORDER BY p.prescription_date DESC;

-- ====================================
-- STORED PROCEDURES (Functions in PostgreSQL)
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
-- FINAL SETUP NOTES
-- ====================================

/*
PRESCRIPTION CODE FORMAT:
- Format: {MEDICINE_CODE}-{DOSAGE_NUMBER}-{DURATION_DAYS}
- Example: AC-2-7 means Paracetamol (AC), 2 tablets, for 7 days
- Example: IB-1-5 means Ibuprofen (IB), 1 tablet, for 5 days

FREQUENCY CODES:
- OD: Once Daily (1-0-0)
- BD: Twice Daily (1-0-1)
- TDS: Thrice Daily (1-1-1)
- QID: Four Times Daily (1-1-1-1)
- SOS: As needed

USAGE EXAMPLES:
1. Create prescription:
   SELECT create_prescription('CONS123', 'PAT001', 'DOC001', 'Common Cold', 'Take rest and drink plenty of water', '2024-02-01');

2. Add medicine:
   SELECT add_medicine_to_prescription('RX20241201001', 'AC', '2 tablets', 'twice_daily', 7, 'after', 'Take with plenty of water');

This PostgreSQL schema supports:
- Professional prescription management
- Medicine coding system
- Automatic code generation (AC-2-7 format)
- Complete audit trail
- Patient history tracking
- Doctor and patient management
- Consultation tracking
*/