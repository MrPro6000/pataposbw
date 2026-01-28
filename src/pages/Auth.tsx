import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import PataLogo from "@/components/PataLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { ExternalLink, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import hubPreview from "@/assets/hub-preview.png";

interface AuthProps {
  mode: "login" | "signup";
}

const Auth = ({ mode }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const isDark = theme === "dark";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
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
            description: "You can now log in to your account.",
          });
          navigate("/login");
        }
      } else {
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
      <main className="flex-1 px-6 md:px-20 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Left side - Device Preview */}
          <div className="flex-1 w-full lg:w-auto order-2 lg:order-1">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="relative">
                <div className="bg-[#141414] rounded-t-lg overflow-hidden shadow-2xl">
                  <div className="relative pt-6 px-4 pb-0">
                    <div className="absolute top-2 left-4 flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    </div>
                    <img 
                      src={hubPreview} 
                      alt="Pata Dashboard Preview" 
                      className="w-full rounded-t-md"
                    />
                  </div>
                </div>
                <div className="bg-[#141414] h-4 rounded-b-lg"></div>
                <div className="bg-[#141414]/20 h-1 mx-auto w-1/3 rounded-b-full"></div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full lg:w-[400px] order-1 lg:order-2">
            <div className={`${isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'} rounded-2xl p-8 transition-colors duration-300`}>
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
                    className={`w-full px-4 py-3 border ${isDark ? 'border-white/20 bg-[#2a2a2a] text-white placeholder:text-white/40' : 'border-[#e0e0e0] bg-white text-[#141414]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C8E6] focus:border-transparent transition-colors`}
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
                      className={`w-full px-4 py-3 border ${isDark ? 'border-white/20 bg-[#2a2a2a] text-white placeholder:text-white/40' : 'border-[#e0e0e0] bg-white text-[#141414]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C8E6] focus:border-transparent pr-12 transition-colors`}
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
                    <a href="#" className="text-sm text-[#00C8E6] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 ${isDark ? 'bg-[#00C8E6] text-[#141414] hover:bg-[#00b8d4]' : 'bg-[#141414] text-white hover:bg-[#2a2a2a]'} rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
                >
                  {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
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
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </form>

              <p className={`text-center text-sm ${isDark ? 'text-white/60' : 'text-[#141414]/60'} mt-6`}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  to={mode === "login" ? "/signup" : "/login"} 
                  className="text-[#00C8E6] hover:underline font-medium"
                >
                  {mode === "login" ? "Sign up" : "Log in"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-lg mx-auto px-4 z-50">
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
                className={`${isDark ? 'bg-[#00C8E6] text-[#141414]' : 'bg-[#141414] text-white'} px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-colors`}
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-[#141414]' : 'bg-[#F6F6F6]'} px-10 md:px-20 py-4 flex items-center justify-between transition-colors duration-300`}>
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
