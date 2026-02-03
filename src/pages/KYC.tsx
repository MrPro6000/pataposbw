import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { submitKYC, getKYCSubmission } from "@/integrations/supabase/profile";
import { uploadKYCDocument } from "@/integrations/supabase/storage";
import PataLogo from "@/components/PataLogo";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight, ArrowLeft, Camera, Upload, X } from "lucide-react";

type KYCStep = "omang" | "photos" | "pending" | "rejected";

const KYC = () => {
  const [omangNumber, setOmangNumber] = useState("");
  const [idFrontUrl, setIdFrontUrl] = useState("");
  const [idBackUrl, setIdBackUrl] = useState("");
  const [idFrontPreview, setIdFrontPreview] = useState("");
  const [idBackPreview, setIdBackPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingKyc, setCheckingKyc] = useState(true);
  const [currentStep, setCurrentStep] = useState<KYCStep>("omang");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === "dark";
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      checkExistingKyc();
    }
  }, [authLoading, user]);

  const checkExistingKyc = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: kyc } = await getKYCSubmission(user.id);

      if (kyc) {
        if (kyc.status === "approved") {
          navigate("/dashboard");
        } else if (kyc.status === "pending") {
          setCurrentStep("pending");
        } else if (kyc.status === "rejected") {
          setCurrentStep("rejected");
        }
      }
    } catch (error) {
      console.error("Error checking KYC:", error);
    } finally {
      setCheckingKyc(false);
    }
  };

  const handleOmangSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!omangNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Omang Number",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{9}$/.test(omangNumber.trim())) {
      toast({
        title: "Invalid Omang Number",
        description: "Omang Number must be 9 digits",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep("photos");
  };

  const handleFileUpload = async (file: File, type: "front" | "back") => {
    if (!user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const setUploading = type === "front" ? setUploadingFront : setUploadingBack;
    const setPreview = type === "front" ? setIdFrontPreview : setIdBackPreview;
    const setUrl = type === "front" ? setIdFrontUrl : setIdBackUrl;

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const { url, error } = await uploadKYCDocument(user.id, type === "front" ? "id_front" : "id_back", file);

      if (error) throw new Error(error);

      setUrl(url || "");
      toast({
        title: "Photo uploaded",
        description: `ID ${type} photo uploaded successfully`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!idFrontUrl || !idBackUrl) {
      toast({
        title: "Missing photos",
        description: "Please upload both front and back photos of your ID",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const { error } = await submitKYC(user.id, {
        omangNumber: omangNumber.trim(),
        phoneNumber: user.email || "",
        idFrontUrl,
        idBackUrl,
      });

      if (error) throw new Error(error);

      toast({
        title: "KYC Submitted",
        description: "Your verification is pending approval. Setting up your business...",
      });
      
      // Redirect to business setup
      navigate("/business-setup");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit KYC",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checkingKyc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const renderPhotoUpload = (type: "front" | "back") => {
    const preview = type === "front" ? idFrontPreview : idBackPreview;
    const url = type === "front" ? idFrontUrl : idBackUrl;
    const uploading = type === "front" ? uploadingFront : uploadingBack;
    const setPreview = type === "front" ? setIdFrontPreview : setIdBackPreview;
    const setUrl = type === "front" ? setIdFrontUrl : setIdBackUrl;

    return (
      <div className={`rounded-2xl p-4 ${isDark ? "bg-[#2a2a2a] border border-white/10" : "bg-white border border-[#e0e0e0]"}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-medium ${isDark ? "text-white" : "text-[#141414]"}`}>
            ID {type === "front" ? "Front" : "Back"}
          </h3>
          {url && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>

        {preview || url ? (
          <div className="relative">
            <img
              src={preview || url}
              alt={`ID ${type}`}
              className="w-full rounded-xl aspect-[16/10] object-cover"
            />
            <button
              onClick={() => {
                setPreview("");
                setUrl("");
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className={`aspect-[16/10] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer ${
            isDark ? "border-white/20 hover:border-white/40" : "border-[#e0e0e0] hover:border-[#c0c0c0]"
          }`}>
            <div className={`p-3 rounded-full ${isDark ? "bg-white/10" : "bg-[#f5f5f5]"}`}>
              <Upload className={`w-6 h-6 ${isDark ? "text-white/60" : "text-[#141414]/60"}`} />
            </div>
            <p className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
              {uploading ? "Uploading..." : `Upload ID ${type}`}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, type);
              }}
            />
          </label>
        )}

        {uploading && (
          <div className="mt-3 flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
              Uploading...
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "pending":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Verification Pending
            </h2>
            <p className="text-muted-foreground mb-6">
              Your KYC submission is being reviewed. You'll be notified once approved.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              Continue to Dashboard
            </Button>
          </div>
        );

      case "rejected":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Verification Rejected
            </h2>
            <p className="text-muted-foreground mb-6">
              Please contact support for assistance.
            </p>
            <Button
              onClick={() => navigate("/dashboard/support")}
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              Contact Support
            </Button>
          </div>
        );

      case "photos":
        return (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentStep("omang")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Upload ID Photos
              </h2>
              <p className="text-sm text-muted-foreground">
                Take a clear photo or scan both sides of your Omang ID
              </p>
            </div>

            <div className="space-y-4">
              {renderPhotoUpload("front")}
              {renderPhotoUpload("back")}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className={`w-4 h-4 ${idFrontUrl ? 'text-green-500' : 'text-muted-foreground/20'}`} />
              <span className="text-sm text-muted-foreground">ID Front uploaded</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className={`w-4 h-4 ${idBackUrl ? 'text-green-500' : 'text-muted-foreground/20'}`} />
              <span className="text-sm text-muted-foreground">ID Back uploaded</span>
            </div>

            <Button
              onClick={handleFinalSubmit}
              disabled={loading || !idFrontUrl || !idBackUrl}
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 text-muted-foreground hover:text-foreground rounded-xl"
            >
              Skip for now
            </Button>
          </div>
        );

      default:
        return (
          <form onSubmit={handleOmangSubmit} className="space-y-6">
            <div>
              <Label htmlFor="omang" className="text-foreground">
                Omang Number (National ID)
              </Label>
              <Input
                id="omang"
                type="text"
                placeholder="Enter your 9-digit Omang Number"
                value={omangNumber}
                onChange={(e) => setOmangNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                className="mt-2 bg-muted border-input rounded-xl py-4"
                maxLength={9}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Your Omang Number will be verified by our team
              </p>
            </div>

            <Button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 text-muted-foreground hover:text-foreground rounded-xl"
            >
              Skip for now
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <PataLogo className="h-5 text-foreground" />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg">
          {currentStep === "omang" && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verify Your Identity
              </h1>
              <p className="text-muted-foreground">
                Complete KYC verification to access all features
              </p>

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-8 h-1 rounded-full bg-primary"></div>
                <div className="w-8 h-1 rounded-full bg-muted"></div>
              </div>
            </div>
          )}

          {currentStep === "photos" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-1 rounded-full bg-primary"></div>
              <div className="w-8 h-1 rounded-full bg-primary"></div>
            </div>
          )}

          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default KYC;
