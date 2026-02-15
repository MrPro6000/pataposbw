
-- Add new team roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cto';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'developer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance';
