import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getKYCSubmission } from "@/integrations/supabase/profile";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Enforces that a user:
 * 1. Is authenticated
 * 2. Has completed KYC (status = "approved")
 * 3. Has completed business setup (business_name set on profile)
 *
 * No loopholes — all three checks must pass before rendering the dashboard.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const runChecks = async () => {
      try {
        // 1. Check KYC status
        const { data: kyc } = await getKYCSubmission(user.id);

        if (!kyc) {
          // No KYC submission at all — send to KYC
          navigate("/kyc", { replace: true });
          return;
        }

        if (kyc.status === "pending") {
          // KYC submitted but not yet approved — show KYC pending screen
          navigate("/kyc", { replace: true });
          return;
        }

        if (kyc.status === "rejected") {
          // KYC rejected — let them try again via KYC page
          navigate("/kyc", { replace: true });
          return;
        }

        // 2. KYC is approved — check business setup
        const { data: profile } = await supabase
          .from("profiles")
          .select("business_name")
          .eq("user_id", user.id)
          .single();

        if (!profile?.business_name) {
          // Business setup not done
          navigate("/business-setup", { replace: true });
          return;
        }

        // All checks pass
        setAllowed(true);
      } catch (err) {
        console.error("ProtectedRoute check error:", err);
        navigate("/login", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    runChecks();
  }, [user, authLoading, navigate]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
