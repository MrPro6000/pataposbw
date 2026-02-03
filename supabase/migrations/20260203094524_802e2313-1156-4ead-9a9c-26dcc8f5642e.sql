-- Create loan_applications table for business loans
CREATE TABLE public.loan_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  monthly_revenue NUMERIC,
  years_in_business INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own loan applications"
ON public.loan_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create loan applications"
ON public.loan_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all loan applications"
ON public.loan_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update loan applications"
ON public.loan_applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create money_transfers table for international transfers
CREATE TABLE public.money_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL DEFAULT 'mukuru',
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_country TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BWP',
  fees NUMERIC DEFAULT 0,
  exchange_rate NUMERIC DEFAULT 1,
  recipient_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  reference_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.money_transfers ENABLE ROW LEVEL SECURITY;

-- Users can view their own transfers
CREATE POLICY "Users can view own transfers"
ON public.money_transfers
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own transfers
CREATE POLICY "Users can create transfers"
ON public.money_transfers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all transfers
CREATE POLICY "Admins can view all transfers"
ON public.money_transfers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on loan_applications
CREATE TRIGGER update_loan_applications_updated_at
BEFORE UPDATE ON public.loan_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();