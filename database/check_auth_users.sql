-- Check Supabase auth.users table structure
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'auth'
    AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if we can reference auth.users
SELECT
    'auth.users sample' as info,
    id,
    email,
    created_at
FROM auth.users
LIMIT 3;