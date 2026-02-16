import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import MobileHubView from "./MobileHubView";
import MobileSalesView from "./MobileSalesView";
import MobileMoneyView from "./MobileMoneyView";
import MobileManageView from "./MobileManageView";
import MobileSettingsView from "./MobileSettingsView";
import MobileReportsView from "./MobileReportsView";
import MobileDevicesView from "./MobileDevicesView";
import MobileStaffView from "./MobileStaffView";
import MobileProductsView from "./MobileProductsView";
import MobileCustomersView from "./MobileCustomersView";
import MobileSupportView from "./MobileSupportView";
import MobileTransportView from "./MobileTransportView";
import MobilePayoutsView from "./MobilePayoutsView";

const MobileDashboardHome = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null; business_name: string | null; avatar_url: string | null; phone: string | null } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let initialCheckDone = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (initialCheckDone && !session?.user) {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      initialCheckDone = true;
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
      .select("full_name, business_name, avatar_url, phone")
      .eq("user_id", userId)
      .maybeSingle();
    
    setProfile(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-pata-cream dark:from-background dark:to-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const profileProps = { profile, userEmail: user?.email, userId: user?.id, onProfileUpdated: () => user && fetchProfile(user.id) };
  const pathname = location.pathname;

  // Route to appropriate mobile view based on current path
  // Sales tab routes
  if (pathname === "/dashboard/sales") {
    return <MobileSalesView {...profileProps} />;
  }
  
  // Money tab routes
  if (pathname === "/dashboard/payouts") {
    return <MobileMoneyView {...profileProps} />;
  }

  // Payout history detail view
  if (pathname === "/dashboard/payout-history") {
    return <MobilePayoutsView />;
  }
  
  // Reports route
  if (pathname === "/dashboard/reports") {
    return <MobileReportsView {...profileProps} />;
  }
  
  // Settings route
  if (pathname === "/dashboard/settings") {
    return <MobileSettingsView {...profileProps} />;
  }
  
  // Devices route
  if (pathname === "/dashboard/devices") {
    return <MobileDevicesView {...profileProps} />;
  }
  
  // Staff route
  if (pathname === "/dashboard/staff") {
    return <MobileStaffView {...profileProps} />;
  }
  
  // Products route
  if (pathname === "/dashboard/products") {
    return <MobileProductsView {...profileProps} />;
  }
  
  // Customers route
  if (pathname === "/dashboard/customers") {
    return <MobileCustomersView {...profileProps} />;
  }
  
  // Support route
  if (pathname === "/dashboard/support") {
    return <MobileSupportView {...profileProps} />;
  }

  // Transport route
  if (pathname === "/dashboard/transport") {
    return <MobileTransportView />;
  }

  // Default: Sales view for /dashboard and other routes
  return <MobileSalesView {...profileProps} />;
};

export default MobileDashboardHome;
