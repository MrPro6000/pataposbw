import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHubView from "./MobileHubView";
import MobileSalesView from "./MobileSalesView";

const MobileDashboardHome = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null; business_name: string | null } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/login");
      } else {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, business_name")
      .eq("user_id", userId)
      .maybeSingle();
    
    setProfile(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#00C8E6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Determine which view to show based on route
  const isSalesRoute = location.pathname === "/dashboard/sales";

  if (isSalesRoute) {
    return (
      <MobileSalesView 
        profile={profile} 
        userEmail={user?.email} 
      />
    );
  }

  return (
    <MobileHubView 
      profile={profile} 
      userEmail={user?.email} 
    />
  );
};

export default MobileDashboardHome;
