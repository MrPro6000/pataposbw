import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, User, Clock, CheckCircle } from "lucide-react";

interface Chat {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
  last_message?: string;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const AdminLiveChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchChats();

    // Subscribe to new chats
    const chatChannel = supabase
      .channel("admin-live-chats")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_chats" }, () => {
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages(selectedChat.id);

    const msgChannel = supabase
      .channel(`admin-chat-messages-${selectedChat.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `chat_id=eq.${selectedChat.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
    };
  }, [selectedChat?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const { data: chatData, error } = await supabase
        .from("live_chats")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Get user profiles
      const userIds = (chatData || []).map((c: any) => c.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const enriched: Chat[] = (chatData || []).map((c: any) => ({
        ...c,
        user_email: profileMap.get(c.user_id)?.email || "Unknown",
        user_name: profileMap.get(c.user_id)?.full_name || null,
      }));

      setChats(enriched);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (!error) setMessages((data || []) as ChatMessage[]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat || sending) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("chat_messages")
        .insert({
          chat_id: selectedChat.id,
          sender_id: user.id,
          message: input.trim(),
          is_admin: true,
        } as any);

      if (error) throw error;
      setInput("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const closeChat = async (chatId: string) => {
    await supabase
      .from("live_chats")
      .update({ status: "closed" } as any)
      .eq("id", chatId);
    
    if (selectedChat?.id === chatId) setSelectedChat(null);
    fetchChats();
  };

  const activeChats = chats.filter((c) => c.status === "active");
  const closedChats = chats.filter((c) => c.status === "closed");

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Live Chat</h1>
        <p className="text-white/60">Real-time support conversations with customers</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Chat List */}
        <div className="w-80 bg-[#1a1a1a] rounded-2xl flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-medium text-sm">
              Active ({activeChats.length}) • Closed ({closedChats.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-white/40">Loading...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-white/40">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No chats yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedChat?.id === chat.id ? "bg-white/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-sm font-medium truncate">{chat.user_name || chat.user_email}</p>
                    <span className={`w-2 h-2 rounded-full ${chat.status === "active" ? "bg-green-500" : "bg-white/20"}`} />
                  </div>
                  <p className="text-white/40 text-xs truncate">{chat.user_email}</p>
                  <p className="text-white/30 text-xs mt-1">
                    {new Date(chat.updated_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#1a1a1a] rounded-2xl flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{selectedChat.user_name || selectedChat.user_email}</p>
                  <p className="text-white/40 text-sm">{selectedChat.user_email}</p>
                </div>
                <div className="flex gap-2">
                  {selectedChat.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => closeChat(selectedChat.id)}
                      className="border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Close Chat
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                    {!msg.is_admin && (
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                    <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                      msg.is_admin
                        ? "bg-red-500 text-white rounded-br-md"
                        : "bg-white/10 text-white rounded-bl-md"
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              {selectedChat.status === "active" && (
                <div className="p-3 border-t border-white/10">
                  <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a reply..."
                      className="flex-1 bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40 rounded-full"
                      disabled={sending}
                    />
                    <Button type="submit" size="icon" className="rounded-full bg-red-500 hover:bg-red-600" disabled={sending || !input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/30">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Select a chat to start responding</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLiveChat;
