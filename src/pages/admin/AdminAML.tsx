import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AMLFlag {
  id: string;
  user_id: string;
  flag_type: string;
  description: string | null;
  severity: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}

const AdminAML = () => {
  const [flags, setFlags] = useState<AMLFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | "resolved" | "all">("active");
  const [search, setSearch] = useState("");
  const [selectedFlag, setSelectedFlag] = useState<AMLFlag | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlags();
  }, [filter]);

  const fetchFlags = async () => {
    try {
      let query = supabase
        .from("aml_flags")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter === "active") {
        query = query.eq("is_resolved", false);
      } else if (filter === "resolved") {
        query = query.eq("is_resolved", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      console.error("Error fetching AML flags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (flag: AMLFlag) => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("aml_flags")
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id,
        })
        .eq("id", flag.id);

      if (error) throw error;

      toast({
        title: "Flag Resolved",
        description: "AML flag has been marked as resolved",
      });

      setShowDetailsDialog(false);
      fetchFlags();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resolve flag",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">High</span>;
      case "medium":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">Medium</span>;
      default:
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">Low</span>;
    }
  };

  const filteredFlags = flags.filter(flag =>
    flag.flag_type.toLowerCase().includes(search.toLowerCase()) ||
    flag.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">AML Monitoring</h1>
        <p className="text-white/60">Monitor and manage anti-money laundering flags</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search flags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <div className="flex gap-2">
          {(["active", "resolved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f 
                  ? "bg-red-500 text-white" 
                  : "bg-[#1a1a1a] text-white/60 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Flags Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">No AML flags found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlags.map((flag) => (
            <div 
              key={flag.id} 
              className={`bg-[#1a1a1a] rounded-2xl p-5 border-l-4 ${
                flag.severity === "high" ? "border-red-500" :
                flag.severity === "medium" ? "border-yellow-500" :
                "border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    flag.severity === "high" ? "text-red-500" :
                    flag.severity === "medium" ? "text-yellow-500" :
                    "text-blue-500"
                  }`} />
                  <span className="text-white font-medium">{flag.flag_type}</span>
                </div>
                {getSeverityBadge(flag.severity)}
              </div>
              
              <p className="text-white/60 text-sm mb-4 line-clamp-2">
                {flag.description || "No description provided"}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs">
                  {new Date(flag.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedFlag(flag);
                      setShowDetailsDialog(true);
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {!flag.is_resolved && (
                    <Button
                      size="sm"
                      onClick={() => handleResolve(flag)}
                      disabled={processing}
                      className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>AML Flag Details</DialogTitle>
          </DialogHeader>
          {selectedFlag && (
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-sm">Flag Type</label>
                <p className="text-white font-medium">{selectedFlag.flag_type}</p>
              </div>
              <div>
                <label className="text-white/40 text-sm">Severity</label>
                <div className="mt-1">{getSeverityBadge(selectedFlag.severity)}</div>
              </div>
              <div>
                <label className="text-white/40 text-sm">Description</label>
                <p className="text-white">{selectedFlag.description || "No description"}</p>
              </div>
              <div>
                <label className="text-white/40 text-sm">Created</label>
                <p className="text-white">{new Date(selectedFlag.created_at).toLocaleString()}</p>
              </div>
              {selectedFlag.is_resolved && (
                <div>
                  <label className="text-white/40 text-sm">Resolved</label>
                  <p className="text-green-500">
                    {selectedFlag.resolved_at ? new Date(selectedFlag.resolved_at).toLocaleString() : "Yes"}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Close
            </Button>
            {selectedFlag && !selectedFlag.is_resolved && (
              <Button
                onClick={() => handleResolve(selectedFlag)}
                disabled={processing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {processing ? "Resolving..." : "Mark as Resolved"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAML;
