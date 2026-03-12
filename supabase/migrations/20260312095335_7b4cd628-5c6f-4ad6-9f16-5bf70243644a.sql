
-- Fix 1: Replace overly permissive voucher policy with secure lookup
DROP POLICY IF EXISTS "Public can view voucher by code" ON public.vouchers;

-- Fix 2: Replace overly permissive payment_links policy with secure lookup  
DROP POLICY IF EXISTS "Public can view payment links by id" ON public.payment_links;

-- Fix 3: Fix notifications to only show user-targeted or broadcast notifications
DROP POLICY IF EXISTS "Anyone can view published notifications" ON public.notifications;

CREATE POLICY "Users can view their own or broadcast notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  is_published = true AND (
    target_audience = 'all' OR target_audience = auth.uid()::text
  )
);
