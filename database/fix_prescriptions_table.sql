-- Fix Prescriptions Table - Add Missing Columns
-- Run this script in your Supabase SQL Editor

-- ====================================
-- CHECK AND ADD MISSING COLUMNS TO PRESCRIPTIONS TABLE
-- ====================================

-- Add diagnosis column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prescriptions'
        AND column_name = 'diagnosis'
    ) THEN
        ALTER TABLE prescriptions ADD COLUMN diagnosis TEXT;
        RAISE NOTICE '✅ Added diagnosis column to prescriptions table';
    ELSE
        RAISE NOTICE '✅ diagnosis column already exists';
    END IF;
END
$$;

-- Add general_instructions column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prescriptions'
        AND column_name = 'general_instructions'
    ) THEN
        ALTER TABLE prescriptions ADD COLUMN general_instructions TEXT;
        RAISE NOTICE '✅ Added general_instructions column to prescriptions table';
    ELSE
        RAISE NOTICE '✅ general_instructions column already exists';
    END IF;
END
$$;

-- Add follow_up_date column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prescriptions'
        AND column_name = 'follow_up_date'
    ) THEN
        ALTER TABLE prescriptions ADD COLUMN follow_up_date DATE;
        RAISE NOTICE '✅ Added follow_up_date column to prescriptions table';
    ELSE
        RAISE NOTICE '✅ follow_up_date column already exists';
    END IF;
END
$$;

-- Add consultation_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prescriptions'
        AND column_name = 'consultation_id'
    ) THEN
        ALTER TABLE prescriptions ADD COLUMN consultation_id UUID;
        RAISE NOTICE '✅ Added consultation_id column to prescriptions table';
    ELSE
        RAISE NOTICE '✅ consultation_id column already exists';
    END IF;
END
$$;

-- Add prescription_date column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prescriptions'
        AND column_name = 'prescription_date'
    ) THEN
        ALTER TABLE prescriptions ADD COLUMN prescription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Added prescription_date column to prescriptions table';
    ELSE
        RAISE NOTICE '✅ prescription_date column already exists';
    END IF;
END
$$;

-- Add medications column if it doesn't exist (for storing JSONB medicine data)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prescriptions'
        AND column_name = 'medications'
    ) THEN
        ALTER TABLE prescriptions ADD COLUMN medications JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE '✅ Added medications column to prescriptions table';
    ELSE
        RAISE NOTICE '✅ medications column already exists';
    END IF;
END
$$;

-- ====================================
-- SHOW CURRENT TABLE STRUCTURE
-- ====================================

-- Display current prescriptions table structure
SELECT
    'PRESCRIPTIONS TABLE STRUCTURE' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'prescriptions'
ORDER BY ordinal_position;

-- ====================================
-- SUCCESS MESSAGE
-- ====================================
DO $$
BEGIN
    RAISE NOTICE '✅ Prescriptions table structure updated!';
    RAISE NOTICE '📋 All required columns should now exist:';
    RAISE NOTICE '   - diagnosis (TEXT)';
    RAISE NOTICE '   - general_instructions (TEXT)';
    RAISE NOTICE '   - follow_up_date (DATE)';
    RAISE NOTICE '   - consultation_id (UUID)';
    RAISE NOTICE '   - prescription_date (TIMESTAMP)';
    RAISE NOTICE '   - medications (JSONB)';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Now run the safe_medicine_migration.sql script to complete setup!';
END
$$;