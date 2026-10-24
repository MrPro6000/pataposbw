import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SoftwareProductsList from "@/components/dashboard/SoftwareProductsList";

const SoftwareProducts = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Software Products</h1>
        <p className="text-muted-foreground">Everything included in your Pata system</p>
      </div>
      <SoftwareProductsList />
    </DashboardLayout>
  );
};

export default SoftwareProducts;
