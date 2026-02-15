import { useState } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhoneOTPInputProps {
  isDark: boolean;
  onVerified: (phoneNumber: string) => void;
  onBack: () => void;
}

const PhoneOTPInput = ({ isDark, onVerified, onBack }: PhoneOTPInputProps) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getFormattedNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return "+267" + cleaned;
  };

  const validateNumber = () => /^\+267[78]\d{7}$/.test(getFormattedNumber());

  const handleSendOTP = async () => {
    if (!validateNumber()) {
      toast({ title: "Invalid phone number", description: "Enter a valid Botswana mobile number (e.g., 71234567)", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Not authenticated", description: "Please log in first", variant: "destructive" });
        return;
      }

      const res = await supabase.functions.invoke("send-otp", {
        body: { phone_number: getFormattedNumber() },
      });

      if (res.error || res.data?.error) {
        throw new Error(res.data?.error || res.error?.message || "Failed to send OTP");
      }

      toast({ title: "OTP Sent", description: "Check your phone for the verification code" });

      // For testing: show debug OTP if returned
      if (res.data?.debug_otp) {
        toast({ title: "Test OTP", description: `Your code: ${res.data.debug_otp}` });
      }

      setStep("otp");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter the 6-digit code", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await supabase.functions.invoke("verify-otp", {
        body: { phone_number: getFormattedNumber(), otp_code: otp },
      });

      if (res.error || res.data?.error) {
        throw new Error(res.data?.error || res.error?.message || "Verification failed");
      }

      toast({ title: "Phone verified", description: "Your phone number has been verified successfully" });
      onVerified(getFormattedNumber());
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Verification failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    handleSendOTP();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 text-sm ${isDark ? "text-white/60 hover:text-white" : "text-[#141414]/60 hover:text-[#141414]"}`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {step === "phone" ? (
        <>
          <div className="text-center">
            <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? "bg-[#00C8E6]/20" : "bg-[#00C8E6]/10"}`}>
              <Phone className="w-7 h-7 text-[#00C8E6]" />
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-[#141414]"} mb-2`}>
              Verify your phone
            </h2>
            <p className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
              Enter your Botswana mobile number to receive a verification code
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? "text-white" : "text-[#141414]"} mb-1.5`}>
              Phone Number
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
                +267
              </span>
              <Input
                type="tel"
                value={phoneNumber.replace(/^\+?267/, "")}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="71234567"
                className={`pl-14 ${isDark ? "bg-[#2a2a2a] border-white/20 text-white placeholder:text-white/40" : "bg-white border-[#e0e0e0]"} rounded-xl py-4`}
              />
            </div>
            <p className={`mt-2 text-xs ${isDark ? "text-white/40" : "text-[#141414]/40"}`}>
              We'll send you a 6-digit verification code
            </p>
          </div>

          <Button
            onClick={handleSendOTP}
            disabled={loading || phoneNumber.length < 8}
            className={`w-full py-4 ${isDark ? "bg-[#00C8E6] text-[#141414] hover:bg-[#00b8d4]" : "bg-[#141414] text-white hover:bg-[#2a2a2a]"} rounded-xl`}
          >
            {loading ? "Sending..." : "Send verification code"}
          </Button>
        </>
      ) : (
        <>
          <div className="text-center">
            <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-[#141414]"} mb-2`}>
              Enter verification code
            </h2>
            <p className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
              We sent a code to +267{phoneNumber.replace(/^\+?267/, "")}
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={`w-12 h-14 text-xl rounded-xl ${isDark ? "bg-[#2a2a2a] border-white/20 text-white" : "bg-white border-[#e0e0e0]"}`}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className={`w-full py-4 ${isDark ? "bg-[#00C8E6] text-[#141414] hover:bg-[#00b8d4]" : "bg-[#141414] text-white hover:bg-[#2a2a2a]"} rounded-xl`}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <button
            onClick={handleResendOTP}
            disabled={loading}
            className={`w-full text-sm ${isDark ? "text-white/60 hover:text-white" : "text-[#141414]/60 hover:text-[#141414]"}`}
          >
            Didn't receive the code? <span className="text-[#00C8E6]">Resend</span>
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneOTPInput;
