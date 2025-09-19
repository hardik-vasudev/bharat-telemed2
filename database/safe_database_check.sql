-- Safe Database Structure Check
-- This script safely checks what exists without causing errors

-- ====================================
-- 1. LIST ALL EXISTING TABLES
-- ====================================
\echo '=== EXISTING TABLES ==='
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ====================================
-- 2. CHECK WHAT COLUMNS EXIST IN ALL TABLES
-- ====================================
\echo ''
\echo '=== ALL COLUMNS IN ALL TABLES ==='
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ====================================
-- 3. CHECK FOR USER/AUTH RELATED TABLES
-- ====================================
\echo ''
\echo '=== USER/AUTH RELATED TABLES ==='
SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND (
        table_name ILIKE '%user%' OR
        table_name ILIKE '%auth%' OR
        table_name ILIKE '%doctor%' OR
        table_name ILIKE '%patient%' OR
        table_name ILIKE '%profile%' OR
        table_name ILIKE '%account%'
    )
ORDER BY table_name;

-- ====================================
-- 4. CHECK EXISTING FOREIGN KEYS
-- ====================================
\echo ''
\echo '=== EXISTING FOREIGN KEY RELATIONSHIPS ==='
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
-- 5. SHOW RECORD COUNTS FOR EXISTING TABLES
-- ====================================
\echo ''
\echo '=== TABLE RECORD COUNTS ==='

-- Dynamic query to count records in each table
DO $$
DECLARE
    table_record RECORD;
    sql_query TEXT;
    table_count INTEGER;
BEGIN
    FOR table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        sql_query := 'SELECT COUNT(*) FROM ' || quote_ident(table_record.table_name);
        EXECUTE sql_query INTO table_count;
        RAISE NOTICE 'Table: %, Records: %', table_record.table_name, table_count;
    END LOOP;
END
$$;

-- ====================================
-- 6. CHECK FOR ID PATTERNS
-- ====================================
\echo ''
\echo '=== ID COLUMN PATTERNS ==='
SELECT
    table_name,
    column_name,
    data_type,
    CASE
        WHEN column_name = 'id' THEN 'Primary Key'
        WHEN column_name LIKE '%_id' THEN 'Foreign Key'
        WHEN column_name LIKE '%id%' THEN 'ID-related'
        ELSE 'Other'
    END as id_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND (
        column_name = 'id' OR
        column_name LIKE '%_id' OR
        column_name LIKE '%id%'
    )
ORDER BY table_name, column_name;

-- ====================================
-- 7. SAMPLE DATA FROM FIRST AVAILABLE TABLE
-- ====================================
\echo ''
\echo '=== SAMPLE DATA FROM FIRST TABLE ==='
DO $$
DECLARE
    first_table TEXT;
    sql_query TEXT;
BEGIN
    SELECT table_name INTO first_table
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    LIMIT 1;

    IF first_table IS NOT NULL THEN
        RAISE NOTICE 'Showing sample from table: %', first_table;
        sql_query := 'SELECT * FROM ' || quote_ident(first_table) || ' LIMIT 3';
        -- Note: We can't dynamically execute and show results in DO block
        -- Run this manually: SELECT * FROM [first_table] LIMIT 3;
    ELSE
        RAISE NOTICE 'No tables found in database';
    END IF;
END
$$;

-- ====================================
-- 8. CHECK FOR SUPABASE AUTH TABLES
-- ====================================
\echo ''
\echo '=== SUPABASE AUTH TABLES (if using Supabase) ==='
SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

-- Check auth.users table specifically
SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'auth'
    AND table_name = 'users'
ORDER BY ordinal_position;

-- ====================================
-- 9. CHECK AVAILABLE SCHEMAS
-- ====================================
\echo ''
\echo '=== AVAILABLE SCHEMAS ==='
SELECT
    schema_name
FROM information_schema.schemata
WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schema_name;