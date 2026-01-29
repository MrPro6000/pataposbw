import { useState, useRef } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

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
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits except +
    const cleaned = value.replace(/[^\d+]/g, "");
    
    // Ensure it starts with +267 for Botswana
    if (cleaned.startsWith("267")) {
      return "+" + cleaned;
    }
    if (cleaned.startsWith("+267")) {
      return cleaned;
    }
    if (cleaned.startsWith("7")) {
      return "+267" + cleaned;
    }
    return cleaned;
  };

  const validateBotswanaNumber = (phone: string) => {
    // Botswana mobile numbers: +267 followed by 7 or 8 digits (total 8 digits after country code)
    const regex = /^\+267[78]\d{7}$/;
    return regex.test(phone);
  };

  const handleSendOTP = async () => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    if (!validateBotswanaNumber(formattedNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Botswana mobile number (e.g., 71234567)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a 6-digit OTP (in production, this would be sent via SMS)
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      
      // In production, you'd call an edge function to send SMS
      // For now, we'll show the OTP in a toast for testing
      toast({
        title: "OTP Sent",
        description: `Your verification code is: ${newOtp}`,
      });
      
      setStep("otp");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Verify OTP (in production, this would check against backend)
      if (otp === generatedOtp) {
        toast({
          title: "Phone verified",
          description: "Your phone number has been verified successfully",
        });
        onVerified(formatPhoneNumber(phoneNumber));
      } else {
        toast({
          title: "Invalid OTP",
          description: "The code you entered is incorrect",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Verification failed",
        variant: "destructive",
      });
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
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
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
