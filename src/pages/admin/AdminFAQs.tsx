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
  Eye,
  EyeOff
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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  display_order: number;
}

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    is_published: true,
  });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        is_published: faq.is_published,
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: "",
        answer: "",
        category: "general",
        is_published: true,
      });
    }
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Error",
        description: "Question and answer are required",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      if (editingFaq) {
        const { error } = await supabase
          .from("faqs")
          .update(formData)
          .eq("id", editingFaq.id);

        if (error) throw error;

        toast({
          title: "FAQ Updated",
          description: "FAQ has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("faqs")
          .insert({
            ...formData,
            display_order: faqs.length,
          });

        if (error) throw error;

        toast({
          title: "FAQ Created",
          description: "New FAQ has been created",
        });
      }

      setShowDialog(false);
      fetchFAQs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save FAQ",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "FAQ Deleted",
        description: "FAQ has been deleted",
      });

      fetchFAQs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (faq: FAQ) => {
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ is_published: !faq.is_published })
        .eq("id", faq.id);

      if (error) throw error;

      toast({
        title: faq.is_published ? "FAQ Unpublished" : "FAQ Published",
        description: `FAQ is now ${faq.is_published ? "hidden" : "visible"} to users`,
      });

      fetchFAQs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  const categories = ["general", "payments", "account", "security", "billing"];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">FAQ Management</h1>
          <p className="text-white/60">Create and manage help articles</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center">
          <p className="text-white/60">No FAQs created yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className={`bg-[#1a1a1a] rounded-2xl p-5 ${!faq.is_published ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-xs">
                      {faq.category}
                    </span>
                    {!faq.is_published && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-xs">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                  <p className="text-white/60 text-sm line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => togglePublished(faq)}
                    className="text-white/60 hover:text-white"
                  >
                    {faq.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(faq)}
                    className="text-white/60 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(faq.id)}
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
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Question</label>
              <Input
                placeholder="Enter the question..."
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Answer</label>
              <Textarea
                placeholder="Enter the answer..."
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40 min-h-[120px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-white/60 text-sm">
                Publish immediately
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={processing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {processing ? "Saving..." : editingFaq ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFAQs;
