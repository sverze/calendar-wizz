-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select only their own events
CREATE POLICY select_own_events ON public.events
  FOR SELECT USING (user_id::text = auth.uid()::text);

-- Policy to allow users to insert only their own events
CREATE POLICY insert_own_events ON public.events
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Policy to allow users to update only their own events
CREATE POLICY update_own_events ON public.events
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Policy to allow users to delete only their own events
CREATE POLICY delete_own_events ON public.events
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Grant access to authenticated users
GRANT ALL ON public.events TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.events TO anon, authenticated;
