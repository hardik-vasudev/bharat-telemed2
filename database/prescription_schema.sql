-- Bharat Telemed Prescription Database Schema
-- Created for professional prescription management system

-- ====================================
-- MEDICINES MASTER TABLE
-- ====================================
CREATE TABLE medicines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    medicine_code VARCHAR(10) NOT NULL UNIQUE COMMENT 'Unique code like AC for Paracetamol',
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    strength VARCHAR(100) COMMENT 'e.g., 500mg, 250mg',
    form VARCHAR(50) COMMENT 'tablet, capsule, syrup, injection',
    manufacturer VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_medicine_code (medicine_code),
    INDEX idx_medicine_name (medicine_name),
    INDEX idx_is_active (is_active)
) COMMENT 'Master table for all medicines with unique codes';

-- ====================================
-- DOCTORS TABLE
-- ====================================
CREATE TABLE doctors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_doctor_id (doctor_id),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
) COMMENT 'Doctor information for prescriptions';

-- ====================================
-- PATIENTS TABLE
-- ====================================
CREATE TABLE patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    emergency_contact VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_patient_id (patient_id),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_is_active (is_active)
) COMMENT 'Patient information';

-- ====================================
-- CONSULTATIONS TABLE
-- ====================================
CREATE TABLE consultations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    consultation_id VARCHAR(50) NOT NULL UNIQUE,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    consultation_type ENUM('video', 'audio', 'chat', 'in_person') DEFAULT 'video',
    consultation_date DATETIME NOT NULL,
    duration_minutes INT,
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    consultation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_consultation_id (consultation_id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_consultation_date (consultation_date),
    INDEX idx_status (status),

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
) COMMENT 'Consultation sessions between doctors and patients';

-- ====================================
-- PRESCRIPTIONS TABLE
-- ====================================
CREATE TABLE prescriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prescription_id VARCHAR(50) NOT NULL UNIQUE,
    consultation_id VARCHAR(50),
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    prescription_date DATETIME NOT NULL,
    diagnosis TEXT,
    general_instructions TEXT,
    follow_up_date DATE,
    total_medicines INT DEFAULT 0,
    prescription_status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_prescription_id (prescription_id),
    INDEX idx_consultation_id (consultation_id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_prescription_date (prescription_date),
    INDEX idx_prescription_status (prescription_status),

    FOREIGN KEY (consultation_id) REFERENCES consultations(consultation_id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
) COMMENT 'Main prescription records';

-- ====================================
-- PRESCRIPTION MEDICINES TABLE
-- ====================================
CREATE TABLE prescription_medicines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prescription_id VARCHAR(50) NOT NULL,
    medicine_code VARCHAR(10) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL COMMENT 'e.g., 1 tablet, 2 tablets',
    frequency ENUM('once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed') NOT NULL,
    frequency_code VARCHAR(10) NOT NULL COMMENT 'e.g., 1-0-0, 1-0-1, 1-1-1, SOS',
    duration_days INT NOT NULL,
    meal_timing ENUM('before', 'after', 'with') DEFAULT 'after',
    special_instructions TEXT,
    medicine_sequence INT NOT NULL COMMENT 'Order of medicine in prescription',

    -- Generate prescription code: AC-2-7 (Medicine_Code-Dosage_Number-Duration_Days)
    prescription_code VARCHAR(50) GENERATED ALWAYS AS (
        CONCAT(medicine_code, '-',
               REGEXP_REPLACE(dosage, '[^0-9]', ''), '-',
               duration_days)
    ) STORED,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_prescription_id (prescription_id),
    INDEX idx_medicine_code (medicine_code),
    INDEX idx_prescription_code (prescription_code),
    INDEX idx_medicine_sequence (medicine_sequence),

    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_code) REFERENCES medicines(medicine_code) ON DELETE RESTRICT
) COMMENT 'Individual medicines in each prescription with auto-generated codes';

-- ====================================
-- PRESCRIPTION HISTORY TABLE (for tracking changes)
-- ====================================
CREATE TABLE prescription_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prescription_id VARCHAR(50) NOT NULL,
    action_type ENUM('created', 'updated', 'cancelled', 'completed') NOT NULL,
    changed_by VARCHAR(50) NOT NULL COMMENT 'doctor_id who made the change',
    change_details JSON COMMENT 'Details of what was changed',
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_prescription_id (prescription_id),
    INDEX idx_action_type (action_type),
    INDEX idx_changed_by (changed_by),
    INDEX idx_action_timestamp (action_timestamp),

    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE
) COMMENT 'Audit trail for prescription changes';

-- ====================================
-- MEDICINE FREQUENCY MASTER TABLE
-- ====================================
CREATE TABLE medicine_frequencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    frequency_code VARCHAR(10) NOT NULL UNIQUE,
    frequency_name VARCHAR(50) NOT NULL,
    frequency_symbol VARCHAR(20) NOT NULL COMMENT 'e.g., 1-0-0, 1-0-1, 1-1-1',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
) COMMENT 'Master table for medicine frequency codes';

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
    pt.age,
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
GROUP BY p.prescription_id
ORDER BY p.prescription_date DESC;

-- ====================================
-- STORED PROCEDURES
-- ====================================

DELIMITER //

-- Procedure to create a new prescription
CREATE PROCEDURE CreatePrescription(
    IN p_consultation_id VARCHAR(50),
    IN p_patient_id VARCHAR(50),
    IN p_doctor_id VARCHAR(50),
    IN p_diagnosis TEXT,
    IN p_general_instructions TEXT,
    IN p_follow_up_date DATE,
    OUT p_prescription_id VARCHAR(50)
)
BEGIN
    DECLARE prescription_count INT;

    -- Generate unique prescription ID
    SELECT COUNT(*) + 1 INTO prescription_count FROM prescriptions WHERE DATE(prescription_date) = CURDATE();
    SET p_prescription_id = CONCAT('RX', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(prescription_count, 4, '0'));

    -- Insert prescription
    INSERT INTO prescriptions (
        prescription_id, consultation_id, patient_id, doctor_id,
        prescription_date, diagnosis, general_instructions, follow_up_date
    ) VALUES (
        p_prescription_id, p_consultation_id, p_patient_id, p_doctor_id,
        NOW(), p_diagnosis, p_general_instructions, p_follow_up_date
    );

    -- Add to history
    INSERT INTO prescription_history (prescription_id, action_type, changed_by, change_details)
    VALUES (p_prescription_id, 'created', p_doctor_id, JSON_OBJECT('action', 'prescription_created'));

END //

-- Procedure to add medicine to prescription
CREATE PROCEDURE AddMedicineToPrescription(
    IN p_prescription_id VARCHAR(50),
    IN p_medicine_code VARCHAR(10),
    IN p_dosage VARCHAR(100),
    IN p_frequency ENUM('once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed'),
    IN p_duration_days INT,
    IN p_meal_timing ENUM('before', 'after', 'with'),
    IN p_special_instructions TEXT
)
BEGIN
    DECLARE v_medicine_name VARCHAR(255);
    DECLARE v_frequency_code VARCHAR(10);
    DECLARE v_sequence INT;

    -- Get medicine name
    SELECT medicine_name INTO v_medicine_name FROM medicines WHERE medicine_code = p_medicine_code;

    -- Get frequency code
    SELECT frequency_symbol INTO v_frequency_code FROM medicine_frequencies
    WHERE frequency_code = CASE
        WHEN p_frequency = 'once_daily' THEN 'OD'
        WHEN p_frequency = 'twice_daily' THEN 'BD'
        WHEN p_frequency = 'thrice_daily' THEN 'TDS'
        WHEN p_frequency = 'four_times_daily' THEN 'QID'
        WHEN p_frequency = 'as_needed' THEN 'SOS'
    END;

    -- Get next sequence number
    SELECT COALESCE(MAX(medicine_sequence), 0) + 1 INTO v_sequence
    FROM prescription_medicines WHERE prescription_id = p_prescription_id;

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

    -- Update total medicines count
    UPDATE prescriptions
    SET total_medicines = (
        SELECT COUNT(*) FROM prescription_medicines WHERE prescription_id = p_prescription_id
    )
    WHERE prescription_id = p_prescription_id;

END //

DELIMITER ;

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================
CREATE INDEX idx_prescription_medicines_composite ON prescription_medicines(prescription_id, medicine_sequence);
CREATE INDEX idx_prescription_date_doctor ON prescriptions(doctor_id, prescription_date DESC);
CREATE INDEX idx_patient_prescriptions ON prescriptions(patient_id, prescription_date DESC);

-- ====================================
-- COMMENTS & DOCUMENTATION
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
1. Create prescription: CALL CreatePrescription('CONS123', 'PAT001', 'DOC001', 'Common Cold', 'Take rest and drink plenty of water', '2024-02-01', @prescription_id);
2. Add medicine: CALL AddMedicineToPrescription(@prescription_id, 'AC', '2 tablets', 'twice_daily', 7, 'after', 'Take with plenty of water');

This schema supports:
- Professional prescription management
- Medicine coding system
- Automatic code generation (AC-2-7 format)
- Complete audit trail
- Patient history tracking
- Doctor and patient management
- Consultation tracking
*/