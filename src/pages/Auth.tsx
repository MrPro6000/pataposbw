import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import PataLogo from "@/components/PataLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { ExternalLink, ChevronRight, Eye, EyeOff, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import pataMacbook from "@/assets/pata-macbook.jpg";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface AuthProps {
  mode: "login" | "signup";
}

type AuthStep = "credentials" | "phone" | "otp";

const Auth = ({ mode }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const isDark = theme === "dark";

  useEffect(() => {
    const checkAdminAndRedirect = async (userId: string) => {
      // Check if user is an admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin");

      if (roles && roles.length > 0) {
        // User is admin, redirect to admin dashboard
        navigate("/admin");
        return true;
      }
      return false;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Check if user is admin first
          const isAdmin = await checkAdminAndRedirect(session.user.id);
          if (isAdmin) return;

          // Check if user has completed KYC
          if (event === "SIGNED_IN") {
            const { data: kyc } = await supabase
              .from("kyc_submissions")
              .select("status")
              .eq("user_id", session.user.id)
              .maybeSingle();

            if (!kyc) {
              // No KYC submission, redirect to KYC page
              navigate("/kyc");
            } else {
              navigate("/dashboard");
            }
          } else {
            navigate("/dashboard");
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Check if user is admin first
        const isAdmin = await checkAdminAndRedirect(session.user.id);
        if (isAdmin) return;

        // Check if user has completed KYC
        const { data: kyc } = await supabase
          .from("kyc_submissions")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!kyc) {
          navigate("/kyc");
        } else {
          navigate("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.startsWith("267")) {
      return "+" + cleaned;
    }
    if (cleaned.startsWith("7") || cleaned.startsWith("8")) {
      return "+267" + cleaned;
    }
    return cleaned;
  };

  const validateBotswanaNumber = (phone: string) => {
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
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      
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

    if (otp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: "The code you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    // OTP verified, proceed with signup
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: formatPhoneNumber(phoneNumber),
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please log in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Account created!",
          description: "Please complete your KYC verification.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (mode === "signup") {
      setStep("phone");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-[#F6F6F6]'} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className="flex items-center justify-between px-10 md:px-20 py-6">
        <Link to="/">
          <PataLogo className={`h-6 ${isDark ? 'text-white' : 'text-[#141414]'}`} />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle className={isDark ? 'text-white' : 'text-[#141414]'} />
          <Link to={mode === "login" ? "/signup" : "/login"} className={isDark ? 'pata-btn-outline-dark' : 'pata-btn-outline-light'}>
            {mode === "login" ? "Sign up" : "Log in"}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-20 pb-24 pt-4 md:pt-0">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16 max-w-7xl mx-auto">
          {/* Left side - MacBook Image (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 w-full lg:w-auto order-2 lg:order-1 items-center justify-center">
            <div className="relative w-full max-w-2xl mx-auto">
              <img 
                src={pataMacbook} 
                alt="Pata Dashboard Preview" 
                className="w-full rounded-xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full lg:w-[400px] order-1 lg:order-2">
            <div className={`${isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'} rounded-2xl p-8 transition-colors duration-300`}>
              
              {step === "credentials" && (
                <>
                  <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className={`${isDark ? 'text-white/60' : 'text-[#141414]/60'} mb-6`}>
                    {mode === "login" 
                      ? "Log in to access your business dashboard." 
                      : "Sign up to start accepting payments."}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-[#141414]'} mb-1.5`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 border ${isDark ? 'border-white/20 bg-[#2a2a2a] text-white placeholder:text-white/40' : 'border-[#e0e0e0] bg-white text-[#141414]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-colors`}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-[#141414]'} mb-1.5`}>
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-4 py-3 border ${isDark ? 'border-white/20 bg-[#2a2a2a] text-white placeholder:text-white/40' : 'border-[#e0e0e0] bg-white text-[#141414]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent pr-12 transition-colors`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40 hover:text-white' : 'text-[#141414]/40 hover:text-[#141414]'}`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {mode === "login" && (
                      <div className="text-right">
                        <a href="#" className="text-sm text-[#0066FF] hover:underline">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 ${isDark ? 'bg-[#0066FF] text-white hover:bg-[#0052CC]' : 'bg-[#141414] text-white hover:bg-[#2a2a2a]'} rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
                    >
                      {loading ? "Please wait..." : mode === "login" ? "Log in" : "Continue"}
                    </button>

                    <div className="relative my-6">
                      <div className={`absolute inset-0 flex items-center`}>
                        <div className={`w-full border-t ${isDark ? 'border-white/20' : 'border-[#e0e0e0]'}`}></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className={`px-4 ${isDark ? 'bg-[#1a1a1a] text-white/60' : 'bg-white text-[#141414]/60'}`}>
                          or continue with
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className={`w-full py-4 flex items-center justify-center gap-3 border ${isDark ? 'border-white/20 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]' : 'border-[#e0e0e0] bg-white text-[#141414] hover:bg-[#f5f5f5]'} rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </button>
                  </form>
                </>
              )}

              {step === "phone" && (
                <>
                  <button
                    onClick={() => setStep("credentials")}
                    className={`flex items-center gap-2 text-sm mb-6 ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}
                  >
                    ← Back
                  </button>

                    <div className="text-center mb-6">
                      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#0066FF]/20' : 'bg-[#0066FF]/10'}`}>
                        <Phone className="w-7 h-7 text-[#0066FF]" />
                    </div>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
                      Verify your phone
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#141414]/60'}`}>
                      Enter your Botswana mobile number to receive a verification code
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-[#141414]'} mb-1.5`}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDark ? 'text-white/60' : 'text-[#141414]/60'}`}>
                          +267
                        </span>
                        <Input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
                          placeholder="71234567"
                          className={`pl-14 ${isDark ? 'bg-[#2a2a2a] border-white/20 text-white placeholder:text-white/40' : 'bg-white border-[#e0e0e0]'} rounded-xl py-3`}
                        />
                      </div>
                      <p className={`mt-2 text-xs ${isDark ? 'text-white/40' : 'text-[#141414]/40'}`}>
                        We'll send you a 6-digit verification code
                      </p>
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={loading || phoneNumber.length < 8}
                      className={`w-full py-4 ${isDark ? 'bg-[#0066FF] text-white hover:bg-[#0052CC]' : 'bg-[#141414] text-white hover:bg-[#2a2a2a]'} rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
                    >
                      {loading ? "Sending..." : "Send verification code"}
                    </button>
                  </div>
                </>
              )}

              {step === "otp" && (
                <>
                  <button
                    onClick={() => setStep("phone")}
                    className={`flex items-center gap-2 text-sm mb-6 ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}
                  >
                    ← Back
                  </button>

                  <div className="text-center mb-6">
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
                      Enter verification code
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#141414]/60'}`}>
                      We sent a code to +267{phoneNumber}
                    </p>
                  </div>

                  <div className="flex justify-center mb-6">
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
                            className={`w-11 h-14 text-xl rounded-xl ${isDark ? 'bg-[#2a2a2a] border-white/20 text-white' : 'bg-white border-[#e0e0e0]'}`}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className={`w-full py-4 ${isDark ? 'bg-[#0066FF] text-white hover:bg-[#0052CC]' : 'bg-[#141414] text-white hover:bg-[#2a2a2a]'} rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
                  >
                    {loading ? "Verifying..." : "Create account"}
                  </button>

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className={`w-full mt-4 text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}
                  >
                    Didn't receive the code? <span className="text-[#0066FF]">Resend</span>
                  </button>
                </>
              )}

              {step === "credentials" && (
                <p className={`text-center text-sm ${isDark ? 'text-white/60' : 'text-[#141414]/60'} mt-6`}>
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <Link 
                    to={mode === "login" ? "/signup" : "/login"} 
                    className="text-[#0066FF] hover:underline font-medium"
                  >
                    {mode === "login" ? "Sign up" : "Log in"}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Cookie Banner - Hidden on mobile */}
      {showCookieBanner && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-lg mx-auto px-4 z-50 hidden md:block">
          <div className={`${isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-[#e0e0e0]'} rounded-2xl p-6 shadow-lg transition-colors duration-300`}>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-[#141414]'} mb-3`}>Cookie notice</h3>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#141414]/60'} mb-4 leading-relaxed`}>
              We use cookies to recognise visitors and remember their preferences. We also use them to measure ad campaign effectiveness, analyze site traffic and improve your experience.
            </p>
            <div className="flex items-center justify-between">
              <button className={`flex items-center text-sm ${isDark ? 'text-white' : 'text-[#141414]'} font-medium hover:opacity-70 transition-opacity`}>
                Cookie policy
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
              <button 
                onClick={() => setShowCookieBanner(false)}
                className={`${isDark ? 'bg-[#0066FF] text-white' : 'bg-[#141414] text-white'} px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-colors`}
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-[#141414]' : 'bg-[#F6F6F6]'} px-10 md:px-20 py-4 hidden md:flex items-center justify-between transition-colors duration-300`}>
        <a href="#" className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}>
          System status
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <div className="flex items-center gap-6">
          <a href="#" className={`text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}>Help</a>
          <a href="#" className={`text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}>Privacy</a>
          <a href="#" className={`text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-[#141414]/60 hover:text-[#141414]'}`}>Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
