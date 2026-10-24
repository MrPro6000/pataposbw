import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";
import SoftwareProductsList from "./SoftwareProductsList";

const MobileSoftwareProductsView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted pb-24">
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <PataLogo className="h-5" />
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-foreground">Software Products</h1>
        <p className="text-sm text-muted-foreground">Everything included in your Pata system</p>
      </div>

      <div className="px-5">
        <SoftwareProductsList />
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileSoftwareProductsView;
