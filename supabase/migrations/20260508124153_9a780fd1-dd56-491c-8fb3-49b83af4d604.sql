-- Fix 1: Public avatars bucket allows listing
-- Drop the broad SELECT policy and replace with public GET via bucket public flag only
-- (Public buckets serve files via public URL without needing a SELECT policy on storage.objects)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;

-- Fix 2: Realtime channel authorization
-- Enable RLS on realtime.messages and restrict subscriptions to authenticated users
-- receiving postgres_changes (which is already row-filtered by underlying table RLS).
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can receive postgres_changes" ON realtime.messages;
CREATE POLICY "Authenticated can receive postgres_changes"
ON realtime.messages
FOR SELECT
TO authenticated
USING (extension = 'postgres_changes');