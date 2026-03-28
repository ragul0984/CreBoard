-- Supabase SQL Migration: Expand Profiles & Add Secure Deletion RPC

-- 1. Add new identity and onboarding columns to the public.profiles table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='gender') THEN
    ALTER TABLE public.profiles ADD COLUMN gender TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='dob') THEN
    ALTER TABLE public.profiles ADD COLUMN dob DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_onboarded') THEN
    ALTER TABLE public.profiles ADD COLUMN is_onboarded BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. Create the Secure Account Deletion RPC function
-- This allows an authenticated user to delete their own account from auth.users.
-- Since the public.profiles table has `ON DELETE CASCADE`, deleting the auth.user will automatically wipe their profile.
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the ID of the user executing the function
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- IMPORTANT: Delete from child/app tables FIRST to avoid FK constraint violations
  DELETE FROM public.content_tasks WHERE user_id = v_user_id;
  DELETE FROM public.revenue WHERE user_id = v_user_id;
  DELETE FROM public.payments WHERE user_id = v_user_id;
  DELETE FROM public.deals WHERE user_id = v_user_id;
  DELETE FROM public.brands WHERE user_id = v_user_id;
  DELETE FROM public.profiles WHERE id = v_user_id;

  -- Finally, delete the auth identity (no more FK references blocking this)
  DELETE FROM auth.users WHERE id = v_user_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
