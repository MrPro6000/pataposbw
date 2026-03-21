import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
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
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-pata-cream dark:from-background dark:to-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  const profile = userProfile ? {
    full_name: userProfile.full_name,
    business_name: userProfile.business_name,
    avatar_url: userProfile.avatar_url ?? null,
    phone: userProfile.phone ?? null,
    email: userProfile.email ?? null,
  } : null;

  const profileProps = {
    profile,
    userEmail: user.email,
    userId: user.id,
    onProfileUpdated: refreshProfile,
  };

  const pathname = location.pathname;

  const renderView = () => {
    if (pathname === "/dashboard/hub") return <MobileHubView profile={profile} userEmail={user.email} />;
    if (pathname === "/dashboard/payouts") return <MobileMoneyView {...profileProps} />;
    if (pathname === "/dashboard/payout-history") return <MobilePayoutsView />;
    if (pathname === "/dashboard/reports") return <MobileReportsView {...profileProps} />;
    if (pathname === "/dashboard/settings") return <MobileSettingsView {...profileProps} />;
    if (pathname === "/dashboard/devices") return <MobileDevicesView {...profileProps} />;
    if (pathname === "/dashboard/staff") return <MobileStaffView {...profileProps} />;
    if (pathname === "/dashboard/products") return <MobileProductsView {...profileProps} />;
    if (pathname === "/dashboard/customers") return <MobileCustomersView {...profileProps} />;
    if (pathname === "/dashboard/support") return <MobileSupportView {...profileProps} />;
    if (pathname === "/dashboard/transport") return <MobileTransportView />;
    // Default: Sales view
    return <MobileSalesView {...profileProps} />;
  };

  return (
    <div className="animate-fade-in-soft">
      {renderView()}
    </div>
  );
};

export default MobileDashboardHome;
