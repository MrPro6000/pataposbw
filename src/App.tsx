import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "./pages/Home";
import CardMachines from "./pages/CardMachines";
import OnlinePayments from "./pages/OnlinePayments";
import Capital from "./pages/Capital";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Sales from "./pages/dashboard/Sales";
import Products from "./pages/dashboard/Products";
import Customers from "./pages/dashboard/Customers";
import Payouts from "./pages/dashboard/Payouts";
import Reports from "./pages/dashboard/Reports";
import Devices from "./pages/dashboard/Devices";
import Staff from "./pages/dashboard/Staff";
import Settings from "./pages/dashboard/Settings";
import Support from "./pages/dashboard/Support";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
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
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/sales" element={<Sales />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/customers" element={<Customers />} />
          <Route path="/dashboard/payouts" element={<Payouts />} />
          <Route path="/dashboard/reports" element={<Reports />} />
          <Route path="/dashboard/devices" element={<Devices />} />
          <Route path="/dashboard/staff" element={<Staff />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/support" element={<Support />} />
          
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
