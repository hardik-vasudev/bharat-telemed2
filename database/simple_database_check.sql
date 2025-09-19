-- Simple Database Structure Check - Pure SQL
-- Run these queries one by one to understand your database

-- ====================================
-- 1. SHOW ALL EXISTING TABLES
-- ====================================
SELECT
    'EXISTING TABLES' as info,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ====================================
-- 2. SHOW ALL COLUMNS IN ALL TABLES
-- ====================================
SELECT
    'TABLE COLUMNS' as info,
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ====================================
-- 3. CHECK FOR USER/AUTH TABLES
-- ====================================
SELECT
    'USER/AUTH TABLES' as info,
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND (
        table_name ILIKE '%user%' OR
        table_name ILIKE '%auth%' OR
        table_name ILIKE '%doctor%' OR
        table_name ILIKE '%patient%' OR
        table_name ILIKE '%profile%'
    );

-- ====================================
-- 4. CHECK ID COLUMN PATTERNS
-- ====================================
SELECT
    'ID COLUMNS' as info,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND (
        column_name = 'id' OR
        column_name LIKE '%_id' OR
        column_name LIKE '%id%'
    )
ORDER BY table_name, column_name;

-- ====================================
-- 5. CHECK FOR SUPABASE AUTH (if applicable)
-- ====================================
SELECT
    'SUPABASE AUTH TABLES' as info,
    table_name
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

-- ====================================
-- 6. SHOW TABLE COUNTS
-- ====================================
-- You'll need to run these individually for each table that exists:

-- Example: If you have a 'users' table:
-- SELECT 'users table count' as info, COUNT(*) as records FROM users;

-- Example: If you have a 'profiles' table:
-- SELECT 'profiles table count' as info, COUNT(*) as records FROM profiles;