# Bharat Telemed - Doctor Dashboard

A modern telemedicine platform dashboard for healthcare professionals, built with Next.js 15, React 18, TypeScript, and Supabase.

## 🏥 Overview

Bharat Telemed is a comprehensive telemedicine ecosystem featuring a professional doctor dashboard with a clean, medical-themed interface designed for healthcare professionals to manage online consultations, patient data, and medical records.

## ✨ Features

- **🔐 Simplified Authentication System**: Secure doctor login/signup with email verification
- **📊 Professional Dashboard**: Modern, responsive interface with medical-themed design
- **👨‍⚕️ Doctor Profile Management**: Complete profile setup with specializations and qualifications
- **🔒 Route Protection**: Middleware-based authentication for secure access
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **⚡ Real-time State Management**: React Context with Supabase integration
- **🎨 Professional UI Components**: Consistent emerald/teal theme with Lucide icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Basic understanding of Next.js and React

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bharat-telemed
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_jwt_secret_key
NEXTAUTH_URL=http://localhost:3002

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME="Bharat Telemed"

# Development Settings
NODE_ENV=development
```

4. **Database Setup**
Run the SQL setup script in your Supabase SQL editor:
```sql
-- See database/supabase-setup.sql for complete schema
-- Creates doctor_profiles table and specializations with RLS policies
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with email verification
- **Styling**: Tailwind CSS with emerald/teal medical theme
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **State Management**: React Context + Supabase real-time subscriptions

### Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx      # Doctor login form
│   │   ├── signup/page.tsx     # Doctor registration form
│   │   └── callback/page.tsx   # Email verification callback
│   ├── dashboard/page.tsx      # Main dashboard interface
│   ├── profile/page.tsx        # Doctor profile management
│   └── layout.tsx              # Root layout with AuthProvider
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── dashboard/              # Dashboard-specific components
│   └── profile/                # Profile-specific components
├── contexts/
│   └── AuthContext.tsx         # Global authentication state
├── lib/
│   ├── auth/
│   │   └── auth-utils.ts       # Authentication service class
│   ├── supabase/
│   │   ├── client.ts           # Supabase client configuration
│   │   └── types.ts            # Database type definitions
│   ├── validations/
│   │   └── auth.ts             # Zod schemas for forms
│   └── utils.ts                # Utility functions
├── hooks/
│   └── useRequireAuth.ts       # Authentication hook for protected routes
└── middleware.ts               # Route protection middleware
```

## 🔐 Authentication System

### Simplified Flow

1. **Doctor Registration**: Complete medical profile setup with specializations
2. **Email Verification**: Automatic verification after successful signup
3. **Secure Login**: JWT-based authentication with session management
4. **Route Protection**: Middleware-based access control
5. **Profile Management**: Update doctor information and credentials

### Key Components

- **AuthContext**: Global authentication state management
- **AuthService**: Centralized authentication operations
- **Middleware**: Route protection and redirection logic
- **Protected Routes**: Automatic redirect for unauthenticated users

### Database Schema

```sql
-- Doctor Profiles Table
doctor_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  medical_license_number TEXT UNIQUE NOT NULL,
  specialization TEXT[],
  qualification TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- Specializations Reference Table
specializations (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## 🛡️ Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Zod schemas for all forms
- **CSRF Protection**: Built-in Next.js security features
- **Email Verification**: Mandatory verification for new accounts
- **Medical License Validation**: Unique license number requirements

## 🎨 Design System

### Color Palette
- **Primary**: Emerald (medical/healthcare theme)
- **Secondary**: Teal
- **Background**: Gradient from emerald-50 to teal-50
- **Text**: Professional gray tones
- **Status**: Success (green), Error (red), Warning (amber)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Professional, readable font sizes
- **Forms**: Clear labels with validation feedback

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Professional styling with hover states
- **Forms**: Accessible inputs with clear validation
- **Icons**: Lucide React medical-themed icons

## 🧪 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Professional linting configuration
- **Prettier**: Consistent code formatting
- **Zod**: Runtime type validation for all APIs

### Component Structure
- **Reusable Components**: Stored in `components/ui/`
- **Page Components**: Minimal logic, delegate to components
- **Hooks**: Custom hooks for shared logic
- **Context**: Global state management

### Testing
- **Unit Tests**: Required for utility functions
- **Integration Tests**: API and authentication flows
- **E2E Tests**: Critical user journeys

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🚀 Deployment

### Environment Variables
Ensure all production environment variables are set:
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Set production Supabase URLs and keys
- Generate secure `NEXTAUTH_SECRET`

### Build and Deploy
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Follow the established code style and conventions
2. Use TypeScript for all new code
3. Add appropriate tests for new features
4. Update documentation for significant changes
5. Ensure all linting and type checks pass

## 📄 License

This project is proprietary software for Bharat Telemed healthcare platform.

## 🆘 Support

For technical support or questions about the authentication system:
1. Check the troubleshooting section in `/docs`
2. Review Supabase configuration
3. Verify environment variables
4. Check browser console for authentication errors

---

**Built with ❤️ for healthcare professionals**
