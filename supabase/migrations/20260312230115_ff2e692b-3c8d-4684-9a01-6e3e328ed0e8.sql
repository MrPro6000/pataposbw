
-- Drop the existing unrestricted user update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a restricted policy that only allows users to update safe fields
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a security definer function to protect sensitive columns
CREATE OR REPLACE FUNCTION public.update_own_profile(
  _full_name text DEFAULT NULL,
  _phone text DEFAULT NULL,
  _business_name text DEFAULT NULL,
  _avatar_url text DEFAULT NULL,
  _email text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    full_name = COALESCE(_full_name, full_name),
    phone = COALESCE(_phone, phone),
    business_name = COALESCE(_business_name, business_name),
    avatar_url = COALESCE(_avatar_url, avatar_url),
    email = COALESCE(_email, email),
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;

-- Revoke direct column updates on sensitive fields from authenticated users
-- by using a trigger to prevent changes to admin-only columns
CREATE OR REPLACE FUNCTION public.protect_sensitive_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the caller is not an admin, prevent changes to sensitive fields
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.account_status := OLD.account_status;
    NEW.transaction_limit := OLD.transaction_limit;
    NEW.suspension_reason := OLD.suspension_reason;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_sensitive_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_sensitive_profile_fields();
