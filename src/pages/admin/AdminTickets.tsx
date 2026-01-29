import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  } | null;
}

interface Message {
  id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "in_progress" | "resolved" | "all">("open");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      let query = supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch profiles separately
      const tickets = data || [];
      const userIds = tickets.map(t => t.user_id);
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, email, full_name")
          .in("user_id", userIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
        
        const enrichedData = tickets.map(ticket => ({
          ...ticket,
          profiles: profileMap.get(ticket.user_id) || null
        }));
        
        setTickets(enrichedData as Ticket[]);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDialog(true);
    fetchMessages(ticket.id);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: selectedTicket.id,
          sender_id: user?.id,
          message: newMessage.trim(),
          is_admin_reply: true,
        });

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedTicket.id);
      
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the user",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: "open" | "in_progress" | "resolved" | "closed") => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ 
          status: newStatus,
          resolved_at: newStatus === "resolved" ? new Date().toISOString() : null
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}`,
      });

      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Open</span>;
      case "in_progress":
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</span>;
      case "resolved":
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-500 rounded-full text-xs">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">High</span>;
      case "medium":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">Medium</span>;
      default:
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Low</span>;
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
    ticket.profiles?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Support Tickets</h1>
        <p className="text-white/60">Manage and respond to customer support requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["open", "in_progress", "resolved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f 
                  ? "bg-red-500 text-white" 
                  : "bg-[#1a1a1a] text-white/60 hover:text-white"
              }`}
            >
              {f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No tickets found</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => handleOpenTicket(ticket)}
              className="bg-[#1a1a1a] rounded-2xl p-5 hover:bg-[#222] cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{ticket.subject}</h3>
                  <p className="text-white/40 text-sm">
                    {ticket.profiles?.email} • {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(ticket.priority)}
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
              <p className="text-white/60 text-sm line-clamp-2">{ticket.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Ticket Info */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-white/60 text-sm">From: {selectedTicket.profiles?.email}</p>
                  <p className="text-white/40 text-xs">
                    Created: {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>
                <Select
                  value={selectedTicket.status}
                  onValueChange={(value) => handleStatusChange(selectedTicket.id, value as "open" | "in_progress" | "resolved" | "closed")}
                >
                  <SelectTrigger className="w-40 bg-[#0f0f0f] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    <SelectItem value="open" className="text-white">Open</SelectItem>
                    <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
                    <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                    <SelectItem value="closed" className="text-white">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {/* Original message */}
                <div className="bg-[#0f0f0f] rounded-lg p-4">
                  <p className="text-white/60 text-xs mb-2">Original Message</p>
                  <p className="text-white">{selectedTicket.description}</p>
                </div>

                {/* Thread */}
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`rounded-lg p-4 ${
                      msg.is_admin_reply 
                        ? "bg-red-500/10 ml-8" 
                        : "bg-[#0f0f0f] mr-8"
                    }`}
                  >
                    <p className="text-white/60 text-xs mb-2">
                      {msg.is_admin_reply ? "Admin Reply" : "User"} • {new Date(msg.created_at).toLocaleString()}
                    </p>
                    <p className="text-white">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Textarea
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40 min-h-[80px]"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={processing || !newMessage.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTickets;
