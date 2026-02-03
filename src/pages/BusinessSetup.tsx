import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import BusinessSetupForm from "@/components/onboarding/BusinessSetupForm";

const BusinessSetup = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
        return;
      }
      setLoading(false);
    }
  }, [authLoading, user, navigate]);

  const handleComplete = () => {
    navigate("/dashboard");
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return <BusinessSetupForm userId={user.uid} onComplete={handleComplete} />;
};

export default BusinessSetup;
