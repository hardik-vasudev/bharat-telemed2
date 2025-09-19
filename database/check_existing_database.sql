-- Check Existing Database Structure
-- Run these queries first to understand your current database

-- ====================================
-- 1. CHECK ALL EXISTING TABLES
-- ====================================
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ====================================
-- 2. CHECK DOCTORS TABLE STRUCTURE
-- ====================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'doctors'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ====================================
-- 3. CHECK PATIENTS TABLE STRUCTURE
-- ====================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'patients'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ====================================
-- 4. CHECK IF OTHER RELATED TABLES EXIST
-- ====================================
SELECT
    table_name,
    'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'consultations',
        'prescriptions',
        'medicines',
        'prescription_medicines',
        'appointments',
        'users'
    );

-- ====================================
-- 5. CHECK EXISTING FOREIGN KEYS
-- ====================================
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';

-- ====================================
-- 6. CHECK EXISTING INDEXES
-- ====================================
SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ====================================
-- 7. CHECK IF CONSULTATIONS TABLE EXISTS AND ITS STRUCTURE
-- ====================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'consultations' AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'CONSULTATIONS table exists';
    ELSE
        RAISE NOTICE 'CONSULTATIONS table does NOT exist';
    END IF;
END
$$;

-- If consultations exists, show its structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'consultations'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ====================================
-- 8. CHECK SAMPLE DATA FROM EXISTING TABLES
-- ====================================
-- Check doctors
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'doctors') THEN
        RAISE NOTICE 'Sample from DOCTORS table:';
    END IF;
END
$$;

SELECT
    'doctors' as table_name,
    COUNT(*) as total_records
FROM doctors
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'doctors');

-- Check patients
SELECT
    'patients' as table_name,
    COUNT(*) as total_records
FROM patients
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patients');

-- ====================================
-- 9. CHECK WHAT ID COLUMNS ARE USED
-- ====================================
SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE column_name LIKE '%id%'
    AND table_schema = 'public'
ORDER BY table_name, column_name;