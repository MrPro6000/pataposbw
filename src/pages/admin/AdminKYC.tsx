import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface KYCSubmission {
  id: string;
  user_id: string;
  omang_number: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  id_front_url: string | null;
  id_back_url: string | null;
  selfie_url: string | null;
  phone_number: string | null;
  profiles: {
    email: string;
    full_name: string | null;
  } | null;
  // Signed URLs for display
  signedFrontUrl?: string;
  signedBackUrl?: string;
  signedSelfieUrl?: string;
}

const AdminKYC = () => {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [selectedKyc, setSelectedKyc] = useState<KYCSubmission | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const getSignedUrl = async (path: string | null): Promise<string | undefined> => {
    if (!path) return undefined;
    try {
      const { data, error } = await supabase.storage
        .from("kyc-documents")
        .createSignedUrl(path, 3600);
      if (error) {
        console.error("Signed URL error:", error);
        return undefined;
      }
      return data.signedUrl;
    } catch {
      return undefined;
    }
  };

  const fetchSubmissions = async () => {
    try {
      let query = supabase
        .from("kyc_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      const submissions = data || [];
      const userIds = submissions.map(s => s.user_id);
      
      let profileMap = new Map<string, { email: string; full_name: string | null }>();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, email, full_name")
          .in("user_id", userIds);
        profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      }

      const enrichedData = submissions.map(sub => ({
        ...sub,
        profiles: profileMap.get(sub.user_id) || null,
      }));

      setSubmissions(enrichedData as KYCSubmission[]);
    } catch (error) {
      console.error("Error fetching KYC submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const openViewDialog = async (kyc: KYCSubmission) => {
    // Generate signed URLs for private photos
    const [signedFrontUrl, signedBackUrl, signedSelfieUrl] = await Promise.all([
      getSignedUrl(kyc.id_front_url),
      getSignedUrl(kyc.id_back_url),
      getSignedUrl(kyc.selfie_url),
    ]);
    
    setSelectedKyc({ ...kyc, signedFrontUrl, signedBackUrl, signedSelfieUrl });
    setShowViewDialog(true);
  };

  const handleApprove = async (kyc: KYCSubmission) => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("kyc_submissions")
        .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: user?.id })
        .eq("id", kyc.id);
      if (error) throw error;
      toast({ title: "KYC Approved", description: "User verification has been approved" });
      fetchSubmissions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to approve KYC", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedKyc) return;
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("kyc_submissions")
        .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user?.id, rejection_reason: rejectionReason })
        .eq("id", selectedKyc.id);
      if (error) throw error;
      toast({ title: "KYC Rejected", description: "User verification has been rejected" });
      setShowRejectDialog(false);
      setSelectedKyc(null);
      setRejectionReason("");
      fetchSubmissions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reject KYC", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.omang_number.includes(search) ||
    sub.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
    sub.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Approved</span>;
      case "rejected": return <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">Rejected</span>;
      default: return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">Pending</span>;
    }
  };

  const PhotoPlaceholder = ({ label }: { label: string }) => (
    <div className="w-full aspect-[16/10] rounded-xl border border-white/10 flex items-center justify-center bg-white/5">
      <span className="text-white/40">{label}</span>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">KYC Approvals</h1>
        <p className="text-white/60">Review and approve user identity verification</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input placeholder="Search by Omang, email, or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-white/40" />
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-red-500 text-white" : "bg-[#1a1a1a] text-white/60 hover:text-white"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">User</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Omang Number</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Submitted</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Status</th>
                <th className="text-right py-4 px-6 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-white/40">Loading...</td></tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-white/40">No submissions found</td></tr>
              ) : (
                filteredSubmissions.map((kyc) => (
                  <tr key={kyc.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{kyc.profiles?.full_name || "No name"}</p>
                      <p className="text-white/40 text-sm">{kyc.profiles?.email}</p>
                    </td>
                    <td className="py-4 px-6 text-white font-mono">{kyc.omang_number}</td>
                    <td className="py-4 px-6 text-white/60 text-sm">{new Date(kyc.submitted_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6">{getStatusBadge(kyc.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openViewDialog(kyc)} className="border-white/20 text-white hover:bg-white/10">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        {kyc.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(kyc)} disabled={processing} className="bg-green-500 hover:bg-green-600 text-white">
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedKyc(kyc); setShowRejectDialog(true); }} disabled={processing}>
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {kyc.status !== "pending" && (
                          <span className="text-white/40 text-sm">Reviewed {kyc.reviewed_at ? new Date(kyc.reviewed_at).toLocaleDateString() : ""}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Reject KYC Submission</DialogTitle>
            <DialogDescription className="text-white/60">Please provide a reason for rejection.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Enter rejection reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40 min-h-[100px]" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing || !rejectionReason.trim()}>{processing ? "Rejecting..." : "Reject Submission"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>KYC Submission Details</DialogTitle>
            <DialogDescription className="text-white/60">Review the submitted ID documents and selfie</DialogDescription>
          </DialogHeader>
          
          {selectedKyc && (
            <div className="space-y-6">
              {/* Selfie at top */}
              {selectedKyc.signedSelfieUrl && (
                <div className="flex justify-center">
                  <img src={selectedKyc.signedSelfieUrl} alt="Selfie" className="w-24 h-24 rounded-full object-cover border-2 border-white/20" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Full Name</p>
                  <p className="text-white font-medium">{selectedKyc.profiles?.full_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Email</p>
                  <p className="text-white font-medium">{selectedKyc.profiles?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Omang Number</p>
                  <p className="text-white font-mono">{selectedKyc.omang_number}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Phone Number</p>
                  <p className="text-white font-mono">{selectedKyc.phone_number || "Not provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/60 mb-2">ID Front</p>
                  {selectedKyc.signedFrontUrl ? (
                    <img src={selectedKyc.signedFrontUrl} alt="ID Front" className="w-full rounded-xl border border-white/10" />
                  ) : (
                    <PhotoPlaceholder label="No image uploaded" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-2">ID Back</p>
                  {selectedKyc.signedBackUrl ? (
                    <img src={selectedKyc.signedBackUrl} alt="ID Back" className="w-full rounded-xl border border-white/10" />
                  ) : (
                    <PhotoPlaceholder label="No image uploaded" />
                  )}
                </div>
              </div>

              {selectedKyc.status === "pending" && (
                <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
                  <Button onClick={() => { handleApprove(selectedKyc); setShowViewDialog(false); }} disabled={processing} className="bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={() => { setShowViewDialog(false); setShowRejectDialog(true); }} disabled={processing}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminKYC;
