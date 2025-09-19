# Bharat Telemed Database Setup

## Supabase Configuration

### 1. Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Supabase Dashboard URLs to Configure

#### Authentication Settings
1. **Go to Authentication > Settings**
   - Site URL: `http://localhost:3000`
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/dashboard`
     - `https://your-production-domain.com/auth/callback`
     - `https://your-production-domain.com/dashboard`

#### Email Templates (Authentication > Email Templates)
2. **Confirm Signup Template**
   - Subject: `Welcome to Bharat Telemed - Confirm Your Email`
   - Update redirect URL to: `{{ .SiteURL }}/auth/callback?type=signup&token={{ .Token }}`

3. **Reset Password Template**
   - Subject: `Reset Your Bharat Telemed Password`
   - Update redirect URL to: `{{ .SiteURL }}/auth/callback?type=recovery&token={{ .Token }}`

#### Database Setup
4. **SQL Editor**
   - Run the `supabase-setup.sql` script to create all tables and policies

#### Storage (Optional - for profile pictures)
5. **Storage > Create Bucket**
   - Bucket name: `avatars`
   - Public: `true`
   - File size limit: `5MB`
   - Allowed file types: `image/*`

### 3. Database Schema Overview

#### Core Tables:
- **user_profiles**: Main user information (doctors and patients)
- **doctor_profiles**: Doctor-specific information (license, specialization, etc.)
- **patient_profiles**: Patient-specific information (medical history, etc.)
- **audit_logs**: Track all profile changes for security

#### Key Features:
- Row Level Security (RLS) enabled
- Automatic profile creation on user signup
- Audit logging for all profile changes
- Role-based access control
- HIPAA-aligned data structure

### 4. User Roles

- **patient**: Default role for regular users
- **doctor**: Healthcare providers (requires verification)
- **admin**: System administrators

### 5. Database Policies

- Users can only view/edit their own profiles
- Patients can view verified doctors
- Audit logs are user-specific
- All changes are automatically logged

### 6. Next Steps After Setup

1. Run the SQL script in Supabase
2. Configure environment variables
3. Set up authentication URLs
4. Install required npm packages
5. Implement authentication components

## Security Notes

- All patient data follows HIPAA guidelines
- Row Level Security ensures data isolation
- All profile changes are audited
- JWT tokens are used for authentication
- Sensitive data is encrypted at rest