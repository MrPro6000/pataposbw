import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2,
  Send,
  Bell
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Notification {
  id: string;
  title: string;
  message: string;
  target_audience: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingNotif, setEditingNotif] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_audience: "all",
  });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (notif?: Notification) => {
    if (notif) {
      setEditingNotif(notif);
      setFormData({
        title: notif.title,
        message: notif.message,
        target_audience: notif.target_audience,
      });
    } else {
      setEditingNotif(null);
      setFormData({
        title: "",
        message: "",
        target_audience: "all",
      });
    }
    setShowDialog(true);
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Title and message are required",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const payload = {
        ...formData,
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null,
        created_by: user?.id,
      };

      if (editingNotif) {
        const { error } = await supabase
          .from("notifications")
          .update(payload)
          .eq("id", editingNotif.id);

        if (error) throw error;

        toast({
          title: publish ? "Notification Sent" : "Notification Updated",
          description: publish ? "Notification has been published" : "Draft saved",
        });
      } else {
        const { error } = await supabase
          .from("notifications")
          .insert(payload);

        if (error) throw error;

        toast({
          title: publish ? "Notification Sent" : "Draft Created",
          description: publish ? "Notification has been published" : "Draft saved",
        });
      }

      setShowDialog(false);
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save notification",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Notification Deleted",
        description: "Notification has been deleted",
      });

      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const audiences = [
    { value: "all", label: "All Users" },
    { value: "merchants", label: "Merchants Only" },
    { value: "verified", label: "Verified Users" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-white/60">Send announcements and updates to users</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Notification
        </Button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">No notifications created yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`bg-[#1a1a1a] rounded-2xl p-5 ${!notif.is_published ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-xs">
                      {audiences.find(a => a.value === notif.target_audience)?.label || notif.target_audience}
                    </span>
                    {notif.is_published ? (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded text-xs">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-xs">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium mb-2">{notif.title}</h3>
                  <p className="text-white/60 text-sm line-clamp-2">{notif.message}</p>
                  <p className="text-white/40 text-xs mt-2">
                    {notif.is_published && notif.published_at
                      ? `Published: ${new Date(notif.published_at).toLocaleString()}`
                      : `Created: ${new Date(notif.created_at).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notif.is_published && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingNotif(notif);
                        setFormData({
                          title: notif.title,
                          message: notif.message,
                          target_audience: notif.target_audience,
                        });
                        handleSave(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(notif)}
                    className="text-white/60 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(notif.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingNotif ? "Edit Notification" : "Create Notification"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Target Audience</label>
              <Select
                value={formData.target_audience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value }))}
              >
                <SelectTrigger className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {audiences.map((aud) => (
                    <SelectItem key={aud.value} value={aud.value} className="text-white">
                      {aud.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Title</label>
              <Input
                placeholder="Enter notification title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Message</label>
              <Textarea
                placeholder="Enter notification message..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40 min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={processing}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={processing}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {processing ? "Publishing..." : "Publish Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotifications;
