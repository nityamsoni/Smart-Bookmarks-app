-- Migration: create public.bookmarks table, indexes, RLS and policies
-- Run this in the Supabase SQL Editor (or with the service role key via psql).

-- Ensure pgcrypto (for gen_random_uuid) is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: allow authenticated users to SELECT their own bookmarks
CREATE POLICY "Select own bookmarks" ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: allow authenticated users to INSERT bookmarks only for themselves
CREATE POLICY "Insert own bookmarks" ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: allow authenticated users to UPDATE their own bookmarks
CREATE POLICY "Update own bookmarks" ON public.bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: allow authenticated users to DELETE their own bookmarks
CREATE POLICY "Delete own bookmarks" ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: a simple test insert (use a real user UUID or run as service_role)
-- INSERT INTO public.bookmarks (title, url, user_id) VALUES ('Example','https://example.com','<USER_UUID>');

-- Notes:
-- - To run this safely, open your Supabase project > SQL Editor > New Query, paste and run.
-- - If you need to run via psql, use the service_role key or a DB user with CREATE privileges.
-- - After applying, your client (using anon key) can read/write when the user is authenticated.
