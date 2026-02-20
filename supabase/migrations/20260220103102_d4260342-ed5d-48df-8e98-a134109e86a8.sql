-- Allow anyone (unauthenticated) to read payment_links by id for the public checkout page
CREATE POLICY "Public can view payment links by id"
ON public.payment_links
FOR SELECT
USING (true);

-- Allow anyone to update payment links status (for payment processing via edge function)
-- We'll handle this via a secure edge function instead, so just allow public read for now
