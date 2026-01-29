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
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === "dark";

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (roles && roles.length > 0) {
        navigate("/admin");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin");

      if (roleError) throw roleError;

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome Admin",
        description: "You have successfully logged in",
      });

      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <div className={`w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#141414]'} mb-2`}>
              Admin Portal
            </h1>
            <p className={`${isDark ? 'text-white/60' : 'text-[#141414]/60'}`}>
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className={`${isDark ? 'text-white' : 'text-[#141414]'}`}>
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@pata.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 ${isDark ? 'bg-[#2a2a2a] border-white/20 text-white placeholder:text-white/40' : 'bg-white border-[#e0e0e0]'} rounded-xl py-4`}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className={`${isDark ? 'text-white' : 'text-[#141414]'}`}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-2 ${isDark ? 'bg-[#2a2a2a] border-white/20 text-white placeholder:text-white/40' : 'bg-white border-[#e0e0e0]'} rounded-xl py-4`}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-red-500 text-white hover:bg-red-600 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50`}
            >
              {loading ? "Signing in..." : "Sign in as Admin"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
