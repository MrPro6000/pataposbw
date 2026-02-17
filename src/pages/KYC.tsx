import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { submitKYC, getKYCSubmission } from "@/integrations/supabase/profile";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight, ArrowLeft, Upload, X, User, AlertTriangle, Loader2 } from "lucide-react";

type KYCStep = "omang" | "photos" | "selfie" | "pending" | "rejected";
type IDType = "omang" | "passport";

const KYC = () => {
  const [idType, setIdType] = useState<IDType>("omang");
  const [omangNumber, setOmangNumber] = useState("");
  const [idFrontUrl, setIdFrontUrl] = useState("");
  const [idBackUrl, setIdBackUrl] = useState("");
  const [selfieUrl, setSelfieUrl] = useState("");
  const [idFrontPreview, setIdFrontPreview] = useState("");
  const [idBackPreview, setIdBackPreview] = useState("");
  const [selfiePreview, setSelfiePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingKyc, setCheckingKyc] = useState(true);
  const [currentStep, setCurrentStep] = useState<KYCStep>("omang");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [verifyingFront, setVerifyingFront] = useState(false);
  const [verifyingBack, setVerifyingBack] = useState(false);
  const [verifyingSelfie, setVerifyingSelfie] = useState(false);
  
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
      toast({ title: "Error", description: "Please enter your Omang Number", variant: "destructive" });
      return;
    }

    if (idType === "omang" && !/^\d{9}$/.test(omangNumber.trim())) {
      toast({ title: "Invalid Omang Number", description: "Omang Number must be 9 digits", variant: "destructive" });
      return;
    }

    if (idType === "passport" && omangNumber.trim().length < 5) {
      toast({ title: "Invalid Passport Number", description: "Please enter a valid passport number", variant: "destructive" });
      return;
    }

    setCurrentStep("photos");
  };

  const verifyImage = async (storagePath: string, type: "front" | "back" | "selfie"): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return true;

      const body: any = { storagePath, type };
      
      // Pass omang number for ID front verification to cross-check
      if (type === "front" && omangNumber.trim()) {
        body.omangNumber = omangNumber.trim();
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) return true;

      const result = await response.json();
      
      // For ID front: also check if Omang number matches
      if (type === "front" && result.id_number_match === false) {
        toast({
          title: "ID Number Mismatch",
          description: `The ID number on your document doesn't match the Omang number you entered (${omangNumber}). Please check and try again.`,
          variant: "destructive",
          duration: 10000,
        });
        return false;
      }

      return result.is_valid !== false;
    } catch (error) {
      console.error("Verification error:", error);
      return true;
    }
  };

  const crossVerifySelfie = async (selfiePath: string): Promise<boolean> => {
    try {
      if (!idFrontUrl) return true; // No ID front to compare against
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return true;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            selfieAction: "cross_verify",
            storagePath: selfiePath,
            idFrontPath: idFrontUrl,
          }),
        }
      );

      if (!response.ok) return true;

      const result = await response.json();
      
      if (result.is_match === false) {
        toast({
          title: "Face Mismatch",
          description: "Your selfie doesn't appear to match the photo on your ID. Please take a clear selfie of yourself.",
          variant: "destructive",
          duration: 10000,
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Cross-verify error:", error);
      return true;
    }
  };

  const handleFileUpload = async (file: File, type: "front" | "back" | "selfie") => {
    if (!user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image smaller than 5MB", variant: "destructive" });
      return;
    }

    const setUploading = type === "front" ? setUploadingFront : type === "back" ? setUploadingBack : setUploadingSelfie;
    const setVerifying = type === "front" ? setVerifyingFront : type === "back" ? setVerifyingBack : setVerifyingSelfie;
    const setPreview = type === "front" ? setIdFrontPreview : type === "back" ? setIdBackPreview : setSelfiePreview;
    const setUrl = type === "front" ? setIdFrontUrl : type === "back" ? setIdBackUrl : setSelfieUrl;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload to private kyc-documents bucket
      const storagePath = `${user.id}/${type}_${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage
        .from("kyc-documents")
        .upload(storagePath, file, { cacheControl: "3600", upsert: true });

      if (error) throw error;

      // AI verification
      setUploading(false);
      setVerifying(true);

      const isValid = await verifyImage(storagePath, type);

      if (!isValid) {
        // Delete the invalid upload
        await supabase.storage.from("kyc-documents").remove([storagePath]);
        setPreview("");
        setUrl("");
        
        const label = type === "selfie" ? "selfie" : `ID ${type}`;
        toast({
          title: `Invalid ${label} photo`,
          description: type === "selfie" 
            ? "Please upload a clear photo of your face. The image doesn't appear to be a valid selfie."
            : "Please upload a photo of your actual government-issued ID card. Screenshots, random images, or non-ID documents are not accepted.",
          variant: "destructive",
          duration: 8000,
        });
        return;
      }

      // For selfie: also cross-verify against ID front photo
      if (type === "selfie" && idFrontUrl) {
        const isFaceMatch = await crossVerifySelfie(storagePath);
        if (!isFaceMatch) {
          await supabase.storage.from("kyc-documents").remove([storagePath]);
          setPreview("");
          setUrl("");
          return;
        }
      }

      setUrl(storagePath);
      toast({ title: "Photo verified ✓", description: `${type === "selfie" ? "Selfie" : `ID ${type}`} uploaded and verified successfully` });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message || "Failed to upload photo", variant: "destructive" });
      setPreview("");
    } finally {
      setUploading(false);
      setVerifying(false);
    }
  };

  const handleFinalSubmit = async () => {
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
        selfieUrl,
      });

      if (error) throw new Error(error);

      toast({
        title: "KYC Submitted",
        description: "Your verification is pending approval. Setting up your business...",
      });
      
      navigate("/business-setup");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to submit KYC", variant: "destructive" });
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

  const renderPhotoUpload = (type: "front" | "back" | "selfie") => {
    const preview = type === "front" ? idFrontPreview : type === "back" ? idBackPreview : selfiePreview;
    const url = type === "front" ? idFrontUrl : type === "back" ? idBackUrl : selfieUrl;
    const uploading = type === "front" ? uploadingFront : type === "back" ? uploadingBack : uploadingSelfie;
    const verifying = type === "front" ? verifyingFront : type === "back" ? verifyingBack : verifyingSelfie;
    const setPreview = type === "front" ? setIdFrontPreview : type === "back" ? setIdBackPreview : setSelfiePreview;
    const setUrl = type === "front" ? setIdFrontUrl : type === "back" ? setIdBackUrl : setSelfieUrl;
    const label = type === "selfie" ? "Selfie Photo" : `ID ${type === "front" ? "Front" : "Back"}`;
    const isRound = type === "selfie";

    return (
      <div className={`rounded-2xl p-4 ${isDark ? "bg-[#2a2a2a] border border-white/10" : "bg-white border border-[#e0e0e0]"}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-medium ${isDark ? "text-white" : "text-[#141414]"}`}>{label}</h3>
          {url && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>

        {preview ? (
          <div className="relative flex justify-center">
            <img
              src={preview}
              alt={label}
              className={`object-cover ${isRound ? "w-32 h-32 rounded-full" : "w-full rounded-xl aspect-[16/10]"}`}
            />
            {!verifying && (
              <button
                onClick={() => { setPreview(""); setUrl(""); }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <label className={`${isRound ? "w-32 h-32 rounded-full mx-auto" : "aspect-[16/10] rounded-xl"} border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer ${
            isDark ? "border-white/20 hover:border-white/40" : "border-[#e0e0e0] hover:border-[#c0c0c0]"
          }`}>
            <div className={`p-3 rounded-full ${isDark ? "bg-white/10" : "bg-[#f5f5f5]"}`}>
              {isRound ? (
                <User className={`w-6 h-6 ${isDark ? "text-white/60" : "text-[#141414]/60"}`} />
              ) : (
                <Upload className={`w-6 h-6 ${isDark ? "text-white/60" : "text-[#141414]/60"}`} />
              )}
            </div>
            {!isRound && (
              <p className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
                {uploading ? "Uploading..." : `Upload ${label}`}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              capture={type === "selfie" ? "user" : "environment"}
              className="hidden"
              disabled={uploading || verifying}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, type);
              }}
            />
          </label>
        )}

        {(uploading || verifying) && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <Loader2 className={`w-4 h-4 animate-spin ${verifying ? "text-blue-500" : "text-primary"}`} />
            <span className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
              {verifying ? "AI verifying photo..." : "Uploading..."}
            </span>
          </div>
        )}
      </div>
    );
  };

  const totalSteps = 3;
  const currentStepNum = currentStep === "omang" ? 1 : currentStep === "photos" ? 2 : 3;

  const renderStepContent = () => {
    switch (currentStep) {
      case "pending":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Verification Pending</h2>
            <p className="text-muted-foreground mb-6">Your KYC submission is being reviewed. You'll be notified once approved.</p>
            <Button onClick={() => navigate("/dashboard")} className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Verification Rejected</h2>
            <p className="text-muted-foreground mb-6">Please contact support for assistance.</p>
            <Button onClick={() => navigate("/dashboard/support")} className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
              Contact Support
            </Button>
          </div>
        );

      case "selfie":
        return (
          <div className="space-y-6">
            <button onClick={() => setCurrentStep("photos")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Take a Selfie</h2>
              <p className="text-sm text-muted-foreground">Upload a clear photo of your face for identity verification</p>
            </div>
            {renderPhotoUpload("selfie")}
            <Button
              onClick={handleFinalSubmit}
              disabled={loading || !selfieUrl}
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </div>
        );

      case "photos":
        return (
          <div className="space-y-6">
            <button onClick={() => setCurrentStep("omang")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Upload ID Photos</h2>
              <p className="text-sm text-muted-foreground">Take a clear photo or scan both sides of your Omang ID</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-400">AI will automatically verify that your uploaded photos are valid government-issued IDs. Non-ID images will be rejected.</p>
            </div>
            <div className="space-y-4">
              {renderPhotoUpload("front")}
              {renderPhotoUpload("back")}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className={`w-4 h-4 ${idFrontUrl ? 'text-green-500' : 'text-muted-foreground/20'}`} />
              <span className="text-sm text-muted-foreground">ID Front uploaded & verified</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className={`w-4 h-4 ${idBackUrl ? 'text-green-500' : 'text-muted-foreground/20'}`} />
              <span className="text-sm text-muted-foreground">ID Back uploaded & verified</span>
            </div>
            <Button
              onClick={() => setCurrentStep("selfie")}
              disabled={!idFrontUrl || !idBackUrl}
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue to Selfie <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return (
          <form onSubmit={handleOmangSubmit} className="space-y-6">
            <div>
              <Label className="text-foreground mb-2 block">ID Type</Label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => { setIdType("omang"); setOmangNumber(""); }}
                  className={`p-3 rounded-xl text-sm border transition-all ${
                    idType === "omang"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  🪪 Omang (National ID)
                </button>
                <button
                  type="button"
                  onClick={() => { setIdType("passport"); setOmangNumber(""); }}
                  className={`p-3 rounded-xl text-sm border transition-all ${
                    idType === "passport"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  🛂 Passport
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="omang" className="text-foreground">
                {idType === "omang" ? "Omang Number (National ID)" : "Passport Number"}
              </Label>
              <Input
                id="omang"
                type="text"
                placeholder={idType === "omang" ? "Enter your 9-digit Omang Number" : "Enter your passport number"}
                value={omangNumber}
                onChange={(e) => {
                  if (idType === "omang") {
                    setOmangNumber(e.target.value.replace(/\D/g, '').slice(0, 9));
                  } else {
                    setOmangNumber(e.target.value.toUpperCase().slice(0, 20));
                  }
                }}
                className="mt-2 bg-muted border-input rounded-xl py-4"
                maxLength={idType === "omang" ? 9 : 20}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {idType === "omang" ? "Your Omang Number will be verified by our team" : "Your passport number will be verified by our team"}
              </p>
            </div>
            <Button type="submit" className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <PataLogo className="h-5 text-foreground" />
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg">
          {(currentStep === "omang" || currentStep === "photos" || currentStep === "selfie") && (
            <>
              {currentStep === "omang" && (
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Identity</h1>
                  <p className="text-muted-foreground">Complete KYC verification to access all features</p>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`w-8 h-1 rounded-full ${step <= currentStepNum ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </>
          )}
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default KYC;
