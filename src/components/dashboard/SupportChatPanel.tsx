import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant" | "admin"; content: string; id?: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface SupportChatPanelProps {
  onClose?: () => void;
  className?: string;
}

const SupportChatPanel = ({ onClose, className = "" }: SupportChatPanelProps) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 👋 I'm Pata Support. Chat with our AI or a live agent will join if available." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Subscribe to live chat messages if we have a chat
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`user-chat-${chatId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        const msg = payload.new as any;
        if (msg.is_admin) {
          setIsLive(true);
          setMessages((prev) => [...prev, { role: "admin", content: msg.message, id: msg.id }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const ensureLiveChat = async () => {
    if (chatId) return chatId;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Check for existing active chat
      const { data: existing } = await supabase
        .from("live_chats")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1);

      if (existing && existing.length > 0) {
        setChatId(existing[0].id);
        return existing[0].id;
      }

      // Create new chat
      const { data: newChat, error } = await supabase
        .from("live_chats")
        .insert({ user_id: user.id } as any)
        .select("id")
        .single();

      if (error || !newChat) return null;

      setChatId(newChat.id);
      return newChat.id;
    } catch {
      return null;
    }
  };

  const sendLiveMessage = async (text: string, currentChatId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("chat_messages")
        .insert({
          chat_id: currentChatId,
          sender_id: user.id,
          message: text,
          is_admin: false,
        } as any);
    } catch (error) {
      console.error("Error sending live message:", error);
    }
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // Always try to create/find a live chat and persist the message
    const currentChatId = await ensureLiveChat();
    if (currentChatId) {
      await sendLiveMessage(text, currentChatId);
    }

    // If a live agent is responding, don't use AI
    if (isLive) return;

    // Use AI for response
    setIsLoading(true);
    let assistantSoFar = "";

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Please sign in to use the chat");
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: newMessages.filter(m => m.role !== "admin").map(m => ({ role: m.role === "admin" ? "assistant" : m.role, content: m.content })) }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to connect");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > newMessages.length) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or contact us at support@pata.co.bw." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isLive, chatId]);

  return (
    <div className={`flex flex-col bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Pata Live Support</p>
            <p className="text-xs opacity-80">
              {isLive ? "🟢 Live agent connected" : "AI-powered • Available 24/7"}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {(msg.role === "assistant" || msg.role === "admin") && (
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === "admin" ? "bg-green-500/20" : "bg-primary/10"
              }`}>
                {msg.role === "admin" ? (
                  <User className="w-4 h-4 text-green-500" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : msg.role === "admin"
                  ? "bg-green-500/10 text-foreground rounded-bl-md border border-green-500/20"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <>
                  {msg.role === "admin" && <p className="text-green-500 text-xs font-medium mb-1">Live Agent</p>}
                  {msg.content}
                </>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-full text-sm"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SupportChatPanel;
