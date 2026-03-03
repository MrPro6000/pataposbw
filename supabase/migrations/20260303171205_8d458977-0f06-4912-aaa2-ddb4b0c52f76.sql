
-- Create table for storing user dashboard preferences
CREATE TABLE public.dashboard_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  show_sell_products boolean NOT NULL DEFAULT true,
  show_transport boolean NOT NULL DEFAULT true,
  show_mobile_money boolean NOT NULL DEFAULT true,
  show_council_payments boolean NOT NULL DEFAULT true,
  show_devices boolean NOT NULL DEFAULT true,
  show_reports boolean NOT NULL DEFAULT true,
  show_staff boolean NOT NULL DEFAULT true,
  show_customers boolean NOT NULL DEFAULT true,
  show_vouchers boolean NOT NULL DEFAULT true,
  show_payment_links boolean NOT NULL DEFAULT true,
  show_invoices boolean NOT NULL DEFAULT true,
  show_capital boolean NOT NULL DEFAULT true,
  show_mukuru boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dashboard_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON public.dashboard_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.dashboard_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.dashboard_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_dashboard_preferences_updated_at
BEFORE UPDATE ON public.dashboard_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
