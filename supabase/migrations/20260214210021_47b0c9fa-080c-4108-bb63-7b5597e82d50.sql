-- Add suspension_reason column to profiles
ALTER TABLE public.profiles ADD COLUMN suspension_reason text;
