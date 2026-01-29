-- Add columns for ID photo storage to kyc_submissions
ALTER TABLE public.kyc_submissions
ADD COLUMN id_front_url TEXT,
ADD COLUMN id_back_url TEXT,
ADD COLUMN phone_number TEXT;

-- Create storage bucket for KYC ID photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: Users can upload their own KYC documents
CREATE POLICY "Users can upload own kyc documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy: Users can view their own KYC documents
CREATE POLICY "Users can view own kyc documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy: Admins can view all KYC documents
CREATE POLICY "Admins can view all kyc documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create table for OTP verification
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '10 minutes'),
  verified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(phone_number, otp_code)
);

-- Enable RLS on otp_verifications
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Users can insert their own OTP requests
CREATE POLICY "Users can create otp requests"
ON public.otp_verifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own OTP records
CREATE POLICY "Users can view own otp"
ON public.otp_verifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own OTP records (for verification)
CREATE POLICY "Users can update own otp"
ON public.otp_verifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);