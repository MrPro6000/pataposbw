import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import CardMachines from "./pages/CardMachines";
import OnlinePayments from "./pages/OnlinePayments";
import Capital from "./pages/Capital";
import Pricing from "./pages/Pricing";
import Products from "./pages/Products";
import BusinessType from "./pages/BusinessType";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import KYC from "./pages/KYC";
import NotFound from "./pages/NotFound";
import BusinessSetup from "./pages/BusinessSetup";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Sales from "./pages/dashboard/Sales";
import DashboardProducts from "./pages/dashboard/Products";
import Customers from "./pages/dashboard/Customers";
import Payouts from "./pages/dashboard/Payouts";
import Reports from "./pages/dashboard/Reports";
import Devices from "./pages/dashboard/Devices";
import Staff from "./pages/dashboard/Staff";
import Settings from "./pages/dashboard/Settings";
import Support from "./pages/dashboard/Support";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminKYC from "./pages/admin/AdminKYC";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAML from "./pages/admin/AdminAML";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminFAQs from "./pages/admin/AdminFAQs";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card-machines" element={<CardMachines />} />
            <Route path="/online-payments" element={<OnlinePayments />} />
            <Route path="/capital" element={<Capital />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/business-type" element={<BusinessType />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/business-setup" element={<BusinessSetup />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/sales" element={<Sales />} />
            <Route path="/dashboard/products" element={<DashboardProducts />} />
            <Route path="/dashboard/customers" element={<Customers />} />
            <Route path="/dashboard/payouts" element={<Payouts />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/devices" element={<Devices />} />
            <Route path="/dashboard/staff" element={<Staff />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/support" element={<Support />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/aml" element={<AdminAML />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/faqs" element={<AdminFAQs />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
