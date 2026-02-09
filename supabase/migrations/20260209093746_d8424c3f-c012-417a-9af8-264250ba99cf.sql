
-- Add selfie_url column to kyc_submissions
ALTER TABLE public.kyc_submissions ADD COLUMN IF NOT EXISTS selfie_url text;

-- Storage policies for kyc-documents bucket
-- Users can upload their own KYC documents
CREATE POLICY "Users can upload own kyc docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own KYC documents
CREATE POLICY "Users can view own kyc docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update/replace their own KYC documents
CREATE POLICY "Users can update own kyc docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all KYC documents
CREATE POLICY "Admins can view all kyc docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' 
  AND public.has_role(auth.uid(), 'admin')
);
