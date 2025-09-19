# Bharat Telemed Authentication System

## Overview

The Bharat Telemed authentication system is built specifically for doctor-only access using Supabase Auth with a custom doctor profile system. This system ensures secure access, proper verification workflows, and HIPAA-compliant data handling.

## Architecture

### Core Components

1. **Supabase Auth** - Handles user authentication (email/password)
2. **Doctor Profiles** - Extended profile system for medical professionals
3. **Verification System** - Admin verification for doctor credentials
4. **Row Level Security** - Database-level access control

### Key Features

- ✅ Doctor-only registration and login
- ✅ Email verification required
- ✅ Medical license validation
- ✅ Specialization and qualification tracking
- ✅ Admin verification workflow
- ✅ Professional profile management
- ✅ Audit logging for security
- ✅ Mobile-responsive design

## Database Schema

### Doctor Profiles Table

```sql
CREATE TABLE public.doctor_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    status doctor_status DEFAULT 'pending_verification',
    medical_license_number TEXT UNIQUE NOT NULL,
    specialization TEXT[] NOT NULL,
    qualification TEXT[] NOT NULL,
    experience_years INTEGER DEFAULT 0,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    verification_status verification_status DEFAULT 'pending',
    -- ... additional fields
);
```

### Custom Types

```sql
CREATE TYPE doctor_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
```

## Authentication Flow

### 1. Doctor Registration
1. Doctor fills registration form with:
   - Personal details (name, phone, email)
   - Medical credentials (license number)
   - Specializations and qualifications
   - Password (with strength requirements)
2. Supabase creates auth user with metadata
3. Database trigger creates doctor profile
4. Email verification sent automatically
5. Redirect to verification pending page

### 2. Email Verification
1. Doctor clicks verification link in email
2. Supabase confirms email address
3. Doctor profile status updates automatically
4. Doctor can now log in

### 3. Admin Verification
1. Admin reviews doctor credentials
2. Verification status updated to 'verified' or 'rejected'
3. Doctor receives notification
4. Verified doctors gain full dashboard access

### 4. Login Process
1. Doctor enters email/password
2. Supabase validates credentials
3. System checks verification status
4. Redirect based on verification state:
   - Unverified → Pending verification page
   - Verified → Dashboard
   - Rejected → Contact admin page

## Security Features

### Row Level Security (RLS)
- Doctors can only access their own data
- Public can view verified doctor profiles (for patient booking)
- Audit logs are user-specific
- Specializations have public read access

### Password Requirements
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- No common passwords allowed

### Audit Logging
All profile changes are automatically logged with:
- User ID and action type
- Old and new values
- IP address and timestamp
- Table and record information

## Component Structure

### Authentication Pages
```
src/app/auth/
├── login/page.tsx          # Doctor login form
├── signup/page.tsx         # Doctor registration form
├── verify-email/page.tsx   # Email verification status
└── forgot-password/page.tsx # Password reset
```

### Authentication Logic
```
src/lib/auth/
├── auth-utils.ts          # Core authentication service
└── validations/auth.ts    # Form validation schemas
```

### Context and Hooks
```
src/contexts/
└── AuthContext.tsx        # Global auth state management

src/hooks/
└── useAuthRedirect.ts     # Route protection and redirects
```

## Usage Examples

### Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext'

function DashboardPage() {
  const { user, doctorProfile, loading, signOut } = useAuth()

  if (loading) return <Loading />
  if (!user) return <Redirect to="/auth/login" />

  return (
    <div>
      <h1>Welcome, Dr. {doctorProfile?.full_name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Using Route Protection

```tsx
import { useRequireAuth } from '@/hooks/useAuthRedirect'

function ProtectedPage() {
  const { user, doctorProfile, isVerified, loading } = useRequireAuth()

  if (loading) return <Loading />
  if (!isVerified) return <VerificationPending />

  return <DashboardContent />
}
```

### Form Validation

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@/lib/validations/auth'

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    const result = await authService.signIn(data)
    // Handle result...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  )
}
```

## Environment Setup

### Required Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
NEXTAUTH_SECRET=your-jwt-secret
NEXTAUTH_URL=http://localhost:3000
```

### Supabase Configuration

1. **Authentication Settings**
   - Enable email authentication
   - Set site URL: `http://localhost:3000`
   - Configure redirect URLs for auth callbacks

2. **Email Templates**
   - Customize signup confirmation email
   - Set proper redirect URLs for verification

3. **Database Setup**
   - Run the provided SQL schema
   - Enable RLS on all tables
   - Verify triggers and functions

## API Integration

### Authentication Service Methods

```typescript
// Sign up new doctor
const result = await authService.signUp({
  email: 'doctor@example.com',
  password: 'SecurePass123',
  fullName: 'Dr. John Doe',
  phoneNumber: '+1234567890',
  medicalLicenseNumber: 'MED123456',
  specialization: ['Cardiology'],
  qualification: ['MBBS', 'MD'],
})

// Sign in doctor
const result = await authService.signIn({
  email: 'doctor@example.com',
  password: 'SecurePass123',
})

// Get current user
const user = await authService.getCurrentUser()

// Get doctor profile
const profile = await authService.getDoctorProfile(userId)

// Update profile
await authService.updateDoctorProfile(userId, updates)

// Sign out
await authService.signOut()
```

## Error Handling

### Common Error Scenarios

1. **Invalid Credentials**
   - Display user-friendly error message
   - Allow retry with forgot password option

2. **Email Already Exists**
   - Suggest login instead of signup
   - Provide forgot password link

3. **Weak Password**
   - Show password requirements
   - Provide real-time validation

4. **Network Errors**
   - Show retry option
   - Graceful offline handling

### Error Display Pattern

```tsx
{errors.root && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
    <p className="text-sm text-red-600">{errors.root.message}</p>
  </div>
)}
```

## Testing

### Test User Creation

For development/testing, create test doctors in Supabase:

1. Go to Authentication > Users
2. Create user with doctor role metadata
3. Run profile creation manually if needed
4. Set verification status as needed

### Test Scenarios

- [ ] Doctor registration flow
- [ ] Email verification process
- [ ] Login with valid/invalid credentials
- [ ] Password strength validation
- [ ] Profile data persistence
- [ ] Route protection
- [ ] Admin verification workflow
- [ ] Audit log creation

## Security Considerations

### Data Protection
- All patient data is separate from auth system
- Doctor profiles contain only professional information
- Sensitive medical data requires additional encryption

### Access Control
- Doctors can only access own profile data
- Public endpoints limited to verified doctor listings
- Admin functions require elevated permissions

### Compliance
- HIPAA-aligned data structure
- Audit trails for all changes
- Secure password requirements
- Email verification mandatory

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Email templates configured
- [ ] Redirect URLs updated
- [ ] SSL certificates in place
- [ ] Error monitoring configured
- [ ] Backup procedures established

## Troubleshooting

### Common Issues

1. **"Permission denied" SQL Error**
   - Remove the JWT secret line from SQL script
   - Use Supabase's built-in JWT handling

2. **Profile Not Created After Signup**
   - Check database triggers
   - Verify user metadata format
   - Check RLS policies

3. **Email Not Sending**
   - Verify Supabase email settings
   - Check email template configuration
   - Ensure proper redirect URLs

4. **Login Redirects Not Working**
   - Check environment variables
   - Verify auth callback URLs
   - Review route protection logic

### Debug Steps

1. Check browser network tab for API errors
2. Review Supabase logs for database issues
3. Verify environment variable values
4. Test auth flow in Supabase dashboard
5. Check console for JavaScript errors

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Social login options
- [ ] Advanced profile verification
- [ ] Integration with medical databases
- [ ] Mobile app authentication
- [ ] Single sign-on (SSO) support