import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { submitKYC, getKYCSubmission } from "@/integrations/supabase/profile";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [rejectionReason, setRejectionReason] = useState("");
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === "dark";
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  const handleLogoBack = () => {
    if (!isMobile) return;
    if (currentStep === "selfie") { setCurrentStep("photos"); return; }
    if (currentStep === "photos") { setCurrentStep("omang"); return; }
    navigate(-1);
  };

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
          setRejectionReason(kyc.rejection_reason || "");
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
      
      // Pass omang number for ID front verification to cross-check number
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
      
      // For ID front: check it's the correct side first
      if (type === "front") {
        if (result.is_valid === false) {
          toast({
            title: "Invalid ID Photo",
            description: "This doesn't appear to be a valid government-issued ID. Please upload a clear photo of your ID front.",
            variant: "destructive",
            duration: 10000,
          });
          return false;
        }

        if (result.is_front === false) {
          toast({
            title: "Wrong side of ID",
            description: "This looks like the back of your ID. Please flip your ID card and upload the front side (the side showing your photo and name).",
            variant: "destructive",
            duration: 10000,
          });
          return false;
        }

        // Check ID number match — reject if mismatch OR if AI couldn't read it at all
        if (result.id_number_match === false) {
          toast({
            title: "ID Number Mismatch",
            description: `The ID number on your document doesn't match "${omangNumber}". Please check the number you entered and try again.`,
            variant: "destructive",
            duration: 10000,
          });
          return false;
        }

        if (result.id_number_match === null) {
          toast({
            title: "ID Number Not Readable",
            description: "AI could not clearly read the ID number on your document. Please take a clearer photo with better lighting.",
            variant: "destructive",
            duration: 10000,
          });
          return false;
        }
      }

      // For ID back: AI must confirm it's the back side specifically
      if (type === "back") {
        if (result.is_valid === false || result.is_back === false) {
          toast({
            title: result.is_back === false ? "Wrong side of ID" : "Invalid ID Back Photo",
            description: result.is_back === false
              ? "This looks like the front of your ID. Please flip your ID card and upload the reverse/back side."
              : "AI could not confirm this is the back of a valid government-issued ID. Please flip your ID and take a clear photo of the reverse side.",
            variant: "destructive",
            duration: 10000,
          });
          return false;
        }
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
      // Show preview of the original image
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload original image to private kyc-documents bucket
      const ext = file.name.split(".").pop() || "jpg";
      const storagePath = `${user.id}/${type}_${Date.now()}.${ext}`;
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
        
        const label = type === "selfie" ? "selfie" : `ID ${type === "front" ? "Front" : "Back"}`;
        toast({
          title: `Invalid ${label} photo`,
          description: type === "selfie"
            ? "Please upload a clear photo of your face. The image doesn't appear to be a valid selfie."
            : type === "front"
            ? "The front of your ID card was not recognized. Please ensure the photo shows the side with your name, photo, and ID number clearly."
            : "The back of your ID card was not recognized. Please ensure the photo shows the reverse side of your government-issued ID clearly.",
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
      toast({ title: "Photo verified ✓", description: `${type === "selfie" ? "Selfie" : `ID ${type === "front" ? "Front" : "Back"}`} uploaded and verified successfully` });
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
      // 1. Insert KYC record as pending first to get an ID
      const { data: kycRecord, error: insertError } = await supabase
        .from("kyc_submissions")
        .insert({
          user_id: user.id,
          omang_number: omangNumber.trim(),
          phone_number: user.email || "",
          id_front_url: idFrontUrl,
          id_back_url: idBackUrl,
          selfie_url: selfieUrl,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      // Show spinner-like message while AI reviews
      toast({
        title: "AI is reviewing your documents...",
        description: "This takes a few seconds. Please wait.",
      });

      // 2. Call AI auto-approve edge function
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-approve-kyc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            kycId: kycRecord.id,
            idFrontPath: idFrontUrl,
            idBackPath: idBackUrl,
            selfiePath: selfieUrl,
            omangNumber: omangNumber.trim(),
          }),
        }
      );

      const result = await response.json();

      if (result.approved) {
        // KYC approved — go to business setup
        toast({
          title: "✅ KYC Approved!",
          description: "Your identity has been verified. Let's set up your business!",
          duration: 6000,
        });
        navigate("/business-setup");
      } else {
        // KYC rejected by AI — show reason, let them retry
        setCurrentStep("rejected");
        // Store reason to display on rejected screen
        setRejectionReason(result.reason || "Your documents could not be verified. Please try again.");
      }
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
    const isRound = type === "selfie";

    const labelMap = {
      front: "ID Front Side",
      back: "ID Back Side",
      selfie: "Selfie Photo",
    };
    const hintMap = {
      front: "The side showing your photo, name & ID number",
      back: "The reverse side of your ID card",
      selfie: "Look straight at the camera",
    };
    const label = labelMap[type];
    const hint = hintMap[type];

    return (
      <div className={`rounded-2xl p-4 ${isDark ? "bg-[#2a2a2a] border border-white/10" : "bg-white border border-[#e0e0e0]"}`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-medium ${isDark ? "text-white" : "text-[#141414]"}`}>{label}</h3>
          {url && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>
        <p className={`text-xs mb-3 ${isDark ? "text-white/50" : "text-[#141414]/50"}`}>{hint}</p>

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
                {uploading ? "Uploading..." : `Tap to scan ${label}`}
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
              {verifying ? (isRound ? "AI verifying selfie..." : `AI verifying ${type === "front" ? "front" : "back"} side of ID...`) : "Uploading..."}
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Under Review</h2>
            <p className="text-muted-foreground mb-2">Your documents are being reviewed by our team.</p>
            <p className="text-sm text-muted-foreground">You'll receive a notification once the review is complete. You cannot access the dashboard until your KYC is approved.</p>
          </div>
        );

      case "rejected":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-destructive text-2xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Verification Failed</h2>
            {rejectionReason ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-left">
                <p className="text-sm font-medium text-destructive mb-1">Reason:</p>
                <p className="text-sm text-muted-foreground">{rejectionReason}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Your documents could not be verified. Please check the details and try again.</p>
            )}
            <Button
              onClick={() => {
                setCurrentStep("omang");
                setIdFrontUrl(""); setIdBackUrl(""); setSelfieUrl("");
                setIdFrontPreview(""); setIdBackPreview(""); setSelfiePreview("");
                setOmangNumber(""); setRejectionReason("");
              }}
              className="w-full py-4 rounded-xl text-base font-medium"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/support")} className="w-full py-3 rounded-xl">
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
        <button
          onClick={handleLogoBack}
          className={isMobile ? "cursor-pointer active:opacity-70 transition-opacity" : "cursor-default"}
          aria-label="Go back"
        >
          <PataLogo className="h-5 text-foreground" />
        </button>
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
