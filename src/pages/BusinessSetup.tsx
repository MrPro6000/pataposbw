import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import BusinessSetupForm from "@/components/onboarding/BusinessSetupForm";

const BusinessSetup = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if business setup is already done — if so skip back to dashboard
    const check = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name")
        .eq("user_id", user.id)
        .single();

      if (profile?.business_name) {
        // Already completed — go straight to dashboard
        navigate("/dashboard", { replace: true });
        return;
      }

      setLoading(false);
    };

    check();
  }, [authLoading, user, navigate]);

  const handleComplete = () => {
    navigate("/dashboard", { replace: true });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return <BusinessSetupForm userId={user.id} onComplete={handleComplete} />;
};

export default BusinessSetup;
