-- =============================================
-- Bharat Telemed Database Schema
-- Doctor Authentication System (Supabase)
-- =============================================

-- Create custom types for doctor-only system
CREATE TYPE doctor_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- =============================================
-- Doctor Profiles Table (Main Table)
-- =============================================
CREATE TABLE public.doctor_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    status doctor_status NOT NULL DEFAULT 'pending_verification',
    avatar_url TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address JSONB,
    emergency_contact JSONB,

    -- Doctor-specific fields
    medical_license_number TEXT UNIQUE NOT NULL,
    specialization TEXT[] NOT NULL,
    qualification TEXT[] NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    bio TEXT,
    languages_spoken TEXT[] DEFAULT ARRAY['English'],
    availability JSONB,
    verification_status verification_status DEFAULT 'pending',
    verification_documents JSONB,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_consultations INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Doctor Specializations Reference Table
-- =============================================
CREATE TABLE public.specializations (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common medical specializations
INSERT INTO public.specializations (name, description) VALUES
('General Medicine', 'Primary healthcare and general medical conditions'),
('Cardiology', 'Heart and cardiovascular system disorders'),
('Dermatology', 'Skin, hair, and nail conditions'),
('Pediatrics', 'Medical care for infants, children, and adolescents'),
('Orthopedics', 'Musculoskeletal system disorders'),
('Gynecology', 'Female reproductive health'),
('Neurology', 'Nervous system disorders'),
('Psychiatry', 'Mental health and behavioral disorders'),
('Ophthalmology', 'Eye and vision care'),
('ENT', 'Ear, nose, and throat disorders');

-- =============================================
-- Audit Log Table
-- =============================================
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX idx_doctor_profiles_email ON public.doctor_profiles(email);
CREATE INDEX idx_doctor_profiles_status ON public.doctor_profiles(status);
CREATE INDEX idx_doctor_profiles_specialization ON public.doctor_profiles USING GIN(specialization);
CREATE INDEX idx_doctor_profiles_verification ON public.doctor_profiles(verification_status);
CREATE INDEX idx_doctor_profiles_license ON public.doctor_profiles(medical_license_number);
CREATE INDEX idx_audit_logs_doctor_id ON public.audit_logs(doctor_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_specializations_name ON public.specializations(name);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;

-- Doctor Profiles Policies
CREATE POLICY "Doctors can view own profile" ON public.doctor_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Doctors can update own profile" ON public.doctor_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Doctors can insert own profile" ON public.doctor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view verified doctors" ON public.doctor_profiles
    FOR SELECT USING (verification_status = 'verified');

-- Audit Logs Policies
CREATE POLICY "Doctors can view own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = doctor_id);

-- Specializations Policies (Public read access)
CREATE POLICY "Anyone can view specializations" ON public.specializations
    FOR SELECT USING (true);

-- =============================================
-- Functions and Triggers
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_doctor_profiles_updated_at
    BEFORE UPDATE ON public.doctor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create doctor profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create doctor profile if metadata indicates doctor role
    IF NEW.raw_user_meta_data->>'role' = 'doctor' THEN
        INSERT INTO public.doctor_profiles (
            id,
            email,
            full_name,
            phone_number,
            medical_license_number,
            specialization,
            qualification
        ) VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Dr. Unknown'),
            COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
            COALESCE(NEW.raw_user_meta_data->>'medical_license_number', ''),
            COALESCE(string_to_array(NEW.raw_user_meta_data->>'specialization', ','), ARRAY['General Medicine']),
            COALESCE(string_to_array(NEW.raw_user_meta_data->>'qualification', ','), ARRAY['MBBS'])
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create doctor profile on signup
CREATE TRIGGER on_auth_doctor_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_doctor();

-- Function to log doctor profile changes
CREATE OR REPLACE FUNCTION public.log_doctor_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        doctor_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address
    ) VALUES (
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        inet_client_addr()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for audit logging
CREATE TRIGGER audit_doctor_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.doctor_profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_doctor_changes();

-- =============================================
-- Sample Data (Optional - for development)
-- =============================================

-- This section can be uncommented for development environments
/*
-- Note: You'll need to create actual auth users first through Supabase Auth
-- Then manually insert their UUIDs here

INSERT INTO public.doctor_profiles (
    id, email, full_name, phone_number,
    medical_license_number, specialization, qualification,
    experience_years, consultation_fee, verification_status, status
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'dr.smith@bharattelemed.com',
    'Dr. John Smith',
    '+91-9876543210',
    'MED12345',
    ARRAY['Cardiology'],
    ARRAY['MBBS', 'MD Cardiology'],
    10,
    500.00,
    'verified',
    'active'
),
(
    '00000000-0000-0000-0000-000000000002',
    'dr.patel@bharattelemed.com',
    'Dr. Priya Patel',
    '+91-9876543211',
    'MED67890',
    ARRAY['Pediatrics'],
    ARRAY['MBBS', 'MD Pediatrics'],
    8,
    400.00,
    'verified',
    'active'
);
*/