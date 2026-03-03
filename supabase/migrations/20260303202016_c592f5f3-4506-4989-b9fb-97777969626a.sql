
-- Add customer_address and notes to invoices
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS customer_address text,
ADD COLUMN IF NOT EXISTS notes text;

-- Create invoice_items table for line items
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total numeric GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Users can manage items on their own invoices
CREATE POLICY "Users can view own invoice items"
ON public.invoice_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
));

CREATE POLICY "Users can create own invoice items"
ON public.invoice_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
));

CREATE POLICY "Users can update own invoice items"
ON public.invoice_items FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
));

CREATE POLICY "Users can delete own invoice items"
ON public.invoice_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
));

-- Admin access
CREATE POLICY "Admins can view all invoice items"
ON public.invoice_items FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
