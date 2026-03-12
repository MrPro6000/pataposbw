
CREATE TABLE public.connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('bank', 'mobile_money', 'card')),
  name text NOT NULL,
  details text NOT NULL,
  bank_name text,
  branch_code text,
  account_holder text,
  provider text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts"
ON public.connected_accounts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own accounts"
ON public.connected_accounts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
ON public.connected_accounts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
ON public.connected_accounts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all accounts"
ON public.connected_accounts FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
