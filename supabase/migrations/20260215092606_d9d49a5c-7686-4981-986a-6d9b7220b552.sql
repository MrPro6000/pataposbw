
-- Create live chat tables
CREATE TABLE public.live_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assigned_to UUID,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.live_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS for live_chats
CREATE POLICY "Users can view own chats" ON public.live_chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chats" ON public.live_chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and support can view all chats" ON public.live_chats
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'support'::app_role)
  );

CREATE POLICY "Admins and support can update chats" ON public.live_chats
  FOR UPDATE USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'support'::app_role)
  );

-- RLS for chat_messages
CREATE POLICY "Users can view messages in their chats" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.live_chats WHERE live_chats.id = chat_messages.chat_id AND live_chats.user_id = auth.uid())
  );

CREATE POLICY "Users can send messages in their chats" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM public.live_chats WHERE live_chats.id = chat_messages.chat_id AND live_chats.user_id = auth.uid())
  );

CREATE POLICY "Admins and support can view all messages" ON public.chat_messages
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'support'::app_role)
  );

CREATE POLICY "Admins and support can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'support'::app_role))
  );

-- Enable realtime for live chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chats;

-- Update timestamp trigger for live_chats
CREATE TRIGGER update_live_chats_updated_at
  BEFORE UPDATE ON public.live_chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
