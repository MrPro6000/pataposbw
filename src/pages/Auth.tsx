import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getKYCSubmission } from "@/integrations/supabase/profile";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { ExternalLink, ChevronRight, Eye, EyeOff, Phone, Smartphone, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import pataMacbook from "@/assets/pata-macbook.jpg";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useIsMobile } from "@/hooks/use-mobile";
import OnboardingCarousel from "@/components/onboarding/OnboardingCarousel";
import { lovable } from "@/integrations/lovable/index";

interface AuthProps {
  mode: "login" | "signup";
}

type AuthStep = "credentials" | "phone" | "otp";

const Auth = ({ mode }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [accountBlocked, setAccountBlocked] = useState<{ status: string; reason: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { user, userProfile, isAdmin, signIn: authSignIn, signUp: authSignUp } = useAuth();

  // Check if user has seen onboarding
  useEffect(() => {
    if (isMobile && mode === "login") {
      const hasSeenOnboarding = localStorage.getItem("pata_onboarding_seen");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isMobile, mode]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("pata_onboarding_seen", "true");
    setShowOnboarding(false);
  };

  // Redirect authenticated users
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (user) {
        // Check if admin
        if (isAdmin) {
          navigate("/admin");
          return;
        }

        // Check KYC status
        const { data: kyc } = await getKYCSubmission(user.id);
        
        if (!kyc || kyc.status === "pending") {
          navigate("/kyc");
        } else {
          navigate("/dashboard/sales");
        }
      }
    };

    checkAndRedirect();
  }, [user, isAdmin, navigate]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, "");
    const local = cleaned.replace(/^267/, "");
    if (/^7\d{0,7}$/.test(local)) {
      return "+267" + local;
    }
    return cleaned;
  };

  const validateBotswanaNumber = (phone: string) => {
    const local = phone.replace(/\D/g, "").replace(/^267/, "");
    return /^7\d{7}$/.test(local);
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
        duration: Infinity,
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

    setLoading(true);
    try {
      const { user: newUser, error } = await authSignUp(email, password);

      if (error) {
        if (error.includes("already registered") || error.includes("already been registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please log in instead.",
            variant: "destructive",
          });
        } else {
          throw new Error(error);
        }
      } else if (newUser) {
        // Save the full name to the profile
        if (fullName.trim()) {
          await supabase
            .from("profiles")
            .update({ full_name: fullName.trim(), phone: `+267${phoneNumber}` })
            .eq("user_id", newUser.id);
        }
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then complete KYC verification.",
        });
        navigate("/kyc");
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
      if (!fullName.trim()) {
        toast({ title: "Error", description: "Please enter your full name", variant: "destructive" });
        return;
      }
      setStep("phone");
      return;
    }

    setLoading(true);

    try {
      const { user: loggedInUser, error } = await authSignIn(email, password);

      if (error) {
        if (error.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
        } else if (error.includes("Email not confirmed")) {
          toast({
            title: "Email not verified",
            description: "Please check your email and click the verification link.",
            variant: "destructive",
          });
        } else {
          throw new Error(error);
        }
      } else if (loggedInUser) {
        // Check account status before proceeding
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_status, suspension_reason")
          .eq("user_id", loggedInUser.id)
          .maybeSingle();

        if (profile && (profile.account_status === "suspended" || profile.account_status === "frozen")) {
          // Sign them out and show the warning
          await supabase.auth.signOut();
          setAccountBlocked({
            status: profile.account_status,
            reason: (profile as any).suspension_reason || "No reason provided",
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "Logging you in...",
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
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show onboarding carousel for mobile first-time users
  if (showOnboarding) {
    return <OnboardingCarousel onComplete={handleOnboardingComplete} />;
  }

  // Show account blocked screen
  if (accountBlocked) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            accountBlocked.status === "frozen" ? "bg-red-500/20" : "bg-yellow-500/20"
          }`}>
            <Ban className={`w-10 h-10 ${accountBlocked.status === "frozen" ? "text-red-500" : "text-yellow-500"}`} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Account {accountBlocked.status === "frozen" ? "Frozen" : "Suspended"}
          </h1>
          <p className="text-muted-foreground mb-6">
            Your account has been {accountBlocked.status} by an administrator.
          </p>
          <div className="bg-muted rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-foreground mb-1">Reason:</p>
            <p className="text-sm text-muted-foreground">{accountBlocked.reason}</p>
          </div>
          <div className="space-y-3">
            <a
              href="mailto:support@pata.co.bw?subject=Account Appeal&body=I would like to appeal my account suspension."
              className="block w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Appeal This Decision
            </a>
            <button
              onClick={() => setAccountBlocked(null)}
              className="w-full py-3 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-5 md:px-20 py-4 safe-area-top">
        <Link to="/">
          <PataLogo className="h-6 text-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle className="text-foreground" />
          <Link to={mode === "login" ? "/signup" : "/login"} className="pata-btn-outline-dark hidden sm:inline-flex">
            {mode === "login" ? "Sign up" : "Log in"}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 md:px-20 pb-6 pt-2 md:pt-0 safe-area-bottom">
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
            {/* Mobile only: Brief PATA explanation */}
            {isMobile && mode === "login" && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-3">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">PATA POS</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The all-in-one payment platform for African businesses. Accept cards, mobile money, and manage your business from anywhere.
                </p>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 transition-colors duration-300">
              
              {step === "credentials" && (
                <>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {mode === "login" 
                      ? "Log in to access your business dashboard." 
                      : "Join thousands of African businesses accepting payments with Pata."}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 border border-input bg-muted text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                          placeholder="e.g. Thabo Molefe"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-input bg-muted text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-input bg-muted text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent pr-12 transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {mode === "login" && (
                      <div className="text-right">
                        <a href="#" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50 mb-safe"
                    >
                      {loading ? "Please wait..." : mode === "login" ? "Log in" : "Continue"}
                    </button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-card text-muted-foreground">
                          or continue with
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full py-4 flex items-center justify-center gap-3 border border-input bg-muted text-foreground hover:bg-muted/70 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50"
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
                    className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </button>

                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-primary/20">
                      <Phone className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Verify your phone
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your Botswana mobile number to receive a verification code
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          +267
                        </span>
                        <Input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
                          placeholder="71234567"
                          className="pl-14 bg-muted border-input rounded-xl py-3"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        We'll send you a verification code via SMS
                      </p>
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={loading || phoneNumber.length < 8}
                      className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50"
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
                    className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </button>

                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Enter verification code
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We sent a 6-digit code to +267{phoneNumber}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length !== 6}
                      className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify & Create Account"}
                    </button>

                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                      Didn't receive the code? Resend
                    </button>
                  </div>
                </>
              )}

              {/* Mobile only - Link to alternate auth mode */}
              <div className="sm:hidden mt-6 text-center">
                <Link
                  to={mode === "login" ? "/signup" : "/login"}
                  className="text-sm text-muted-foreground"
                >
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <span className="text-primary font-medium">
                    {mode === "login" ? "Sign up" : "Log in"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
