import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

const KYC = () => {
  const [omangNumber, setOmangNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingKyc, setCheckingKyc] = useState(true);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === "dark";

  useEffect(() => {
    checkExistingKyc();
  }, []);

  const checkExistingKyc = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: kyc } = await supabase
        .from("kyc_submissions")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (kyc) {
        setKycStatus(kyc.status);
        if (kyc.status === "approved") {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error checking KYC:", error);
    } finally {
      setCheckingKyc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!omangNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Omang Number",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for Omang number (Botswana ID - typically 9 digits)
    if (!/^\d{9}$/.test(omangNumber.trim())) {
      toast({
        title: "Invalid Omang Number",
        description: "Omang Number must be 9 digits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("kyc_submissions")
        .insert({
          user_id: user.id,
          omang_number: omangNumber.trim(),
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Submitted",
            description: "You have already submitted your KYC. Please wait for approval.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "KYC Submitted",
        description: "Your verification is pending approval. You'll be notified once approved.",
      });
      
      setKycStatus("pending");
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

  if (checkingKyc) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-[#F6F6F6]'} flex items-center justify-center`}>
        <div className="animate-spin w-8 h-8 border-4 border-[#00C8E6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-[#F6F6F6]'} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-6 py-4 ${isDark ? 'border-white/10' : 'border-[#e0e0e0]'} border-b`}>
        <PataLogo className={`h-5 ${isDark ? 'text-white' : 'text-[#141414]'}`} />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full max-w-md ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 shadow-lg`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${isDark ? 'bg-[#00C8E6]/20' : 'bg-[#00C8E6]/10'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Shield className="w-8 h-8 text-[#00C8E6]" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
              Verify Your Identity
            </h1>
            <p className={`${isDark ? 'text-white/60' : 'text-[#141414]/60'}`}>
              Complete KYC verification to access all features
            </p>
          </div>

          {kycStatus === "pending" ? (
            <div className="text-center">
              <div className={`w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
                Verification Pending
              </h2>
              <p className={`${isDark ? 'text-white/60' : 'text-[#141414]/60'} mb-6`}>
                Your KYC submission is being reviewed. You'll be notified once approved.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full py-4 bg-[#00C8E6] text-white hover:bg-[#00b8d4] rounded-xl"
              >
                Continue to Dashboard
              </Button>
            </div>
          ) : kycStatus === "rejected" ? (
            <div className="text-center">
              <div className={`w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
                Verification Rejected
              </h2>
              <p className={`${isDark ? 'text-white/60' : 'text-[#141414]/60'} mb-6`}>
                Please contact support for assistance.
              </p>
              <Button
                onClick={() => navigate("/dashboard/support")}
                className="w-full py-4 bg-[#00C8E6] text-white hover:bg-[#00b8d4] rounded-xl"
              >
                Contact Support
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="omang" className={`${isDark ? 'text-white' : 'text-[#141414]'}`}>
                  Omang Number (National ID)
                </Label>
                <Input
                  id="omang"
                  type="text"
                  placeholder="Enter your 9-digit Omang Number"
                  value={omangNumber}
                  onChange={(e) => setOmangNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className={`mt-2 ${isDark ? 'bg-[#2a2a2a] border-white/20 text-white placeholder:text-white/40' : 'bg-white border-[#e0e0e0]'} rounded-xl py-4`}
                  maxLength={9}
                />
                <p className={`mt-2 text-sm ${isDark ? 'text-white/40' : 'text-[#141414]/40'}`}>
                  Your Omang Number will be verified by our team
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-4 ${isDark ? 'bg-[#00C8E6] text-[#141414] hover:bg-[#00b8d4]' : 'bg-[#141414] text-white hover:bg-[#2a2a2a]'} rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className={`w-full py-4 ${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-[#141414]/60 hover:text-[#141414] hover:bg-[#141414]/5'} rounded-xl`}
              >
                Skip for now
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default KYC;
