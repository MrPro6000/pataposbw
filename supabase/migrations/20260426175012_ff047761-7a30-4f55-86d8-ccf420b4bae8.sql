-- 1) Lock down user_roles: only admins (or the new-user trigger via SECURITY DEFINER) may insert.
-- The has_role-based ALL policy already restricts admins, but Supabase requires
-- a permissive policy to allow non-admin INSERTs. We add an explicit restrictive
-- policy that blocks any non-admin INSERT, regardless of other policies.
DROP POLICY IF EXISTS "Block non-admin role inserts" ON public.user_roles;
CREATE POLICY "Block non-admin role inserts"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Same for UPDATE/DELETE so users can't escalate via update.
DROP POLICY IF EXISTS "Block non-admin role updates" ON public.user_roles;
CREATE POLICY "Block non-admin role updates"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Block non-admin role deletes" ON public.user_roles;
CREATE POLICY "Block non-admin role deletes"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2) OTP plaintext readability:
-- otp_code is already stored hashed (send-otp hashes with SHA-256), but the
-- existing SELECT policy lets the owning user read the column. verify-otp uses
-- the service role and does not need user-level SELECT, so drop the policy.
DROP POLICY IF EXISTS "Users can view own otp" ON public.otp_verifications;
DROP POLICY IF EXISTS "Users can update own otp" ON public.otp_verifications;
-- Inserts are still done by the user's session via send-otp (which uses the
-- service role internally), so we keep INSERT closed too — only service role writes.
DROP POLICY IF EXISTS "Users can create otp requests" ON public.otp_verifications;

-- 3) KYC documents DELETE policy for admins (right-to-erasure).
DROP POLICY IF EXISTS "Admins can delete kyc documents" ON storage.objects;
CREATE POLICY "Admins can delete kyc documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'kyc-documents' AND public.has_role(auth.uid(), 'admin'));

-- 4) my-bucket has zero policies. Add baseline owner-scoped policies so it is
-- usable but not exposed. Files must be stored under a folder named after the
-- user id, e.g. "<auth.uid()>/file.png".
DROP POLICY IF EXISTS "Users can read own files in my-bucket" ON storage.objects;
CREATE POLICY "Users can read own files in my-bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'my-bucket' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can upload own files to my-bucket" ON storage.objects;
CREATE POLICY "Users can upload own files to my-bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'my-bucket' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update own files in my-bucket" ON storage.objects;
CREATE POLICY "Users can update own files in my-bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'my-bucket' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own files in my-bucket" ON storage.objects;
CREATE POLICY "Users can delete own files in my-bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'my-bucket' AND auth.uid()::text = (storage.foldername(name))[1]);