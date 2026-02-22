
-- 1. Add expires_at to payment_links with 24h default
ALTER TABLE public.payment_links ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours');

-- Update existing rows
UPDATE public.payment_links SET expires_at = created_at + interval '24 hours' WHERE expires_at IS NULL;

-- 2. Create staff_members table
CREATE TABLE public.staff_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'cashier',
  salary NUMERIC NOT NULL DEFAULT 0,
  pay_frequency TEXT NOT NULL DEFAULT 'monthly',
  status TEXT NOT NULL DEFAULT 'active',
  last_paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own staff" ON public.staff_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own staff" ON public.staff_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own staff" ON public.staff_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own staff" ON public.staff_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all staff" ON public.staff_members FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON public.staff_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Create vouchers table
CREATE TABLE public.vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  recipient_name TEXT,
  recipient_phone TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vouchers" ON public.vouchers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own vouchers" ON public.vouchers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vouchers" ON public.vouchers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public can view voucher by code" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Admins can view all vouchers" ON public.vouchers FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON public.vouchers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Create staff_payments table for payroll history
CREATE TABLE public.staff_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  staff_member_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'wallet',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own staff payments" ON public.staff_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own staff payments" ON public.staff_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all staff payments" ON public.staff_payments FOR SELECT USING (has_role(auth.uid(), 'admin'));
