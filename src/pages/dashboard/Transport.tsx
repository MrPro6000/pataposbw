import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileTransportView from "@/components/dashboard/MobileTransportView";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bus, MapPin, ArrowRight, User, CreditCard, Banknote, Smartphone, QrCode, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TransportTransaction {
  id: string;
  customerName: string;
  from: string;
  to: string;
  modeOfTransport: string;
  fare: number;
  paymentMethod: string;
  date: string;
}

const transportModes = ["Combi", "Taxi", "Bus", "Yango", "inDrive"];

const paymentMethods = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "qr", label: "QR Payment", icon: QrCode },
];

const Transport = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    from: "",
    to: "",
    modeOfTransport: "",
    fare: "",
    paymentMethod: "",
  });
  const [transactions, setTransactions] = useState<TransportTransaction[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isMobile) {
    return <MobileTransportView />;
  }

  const handleSubmit = () => {
    if (!formData.from || !formData.to || !formData.fare || !formData.customerName || !formData.modeOfTransport || !formData.paymentMethod) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const newTx: TransportTransaction = {
      id: `TR${String(transactions.length + 1).padStart(3, "0")}`,
      customerName: formData.customerName,
      from: formData.from,
      to: formData.to,
      modeOfTransport: formData.modeOfTransport,
      fare: parseFloat(formData.fare),
      paymentMethod: formData.paymentMethod,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTx, ...transactions]);
    setIsSuccess(true);
    toast({ title: "Transport Fare Saved", description: `P${newTx.fare.toFixed(2)} — ${newTx.from} → ${newTx.to}` });
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ customerName: "", from: "", to: "", modeOfTransport: "", fare: "", paymentMethod: "" });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Transport</h1>
        <p className="text-muted-foreground">Enter fare details</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fare Entry Form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground">Fare Saved!</p>
              <p className="text-muted-foreground mt-1">Transaction recorded successfully</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter passenger name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="e.g. Gaborone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="e.g. Francistown"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mode of Transport</Label>
                <Select value={formData.modeOfTransport} onValueChange={(val) => setFormData({ ...formData, modeOfTransport: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fare (P)</Label>
                <Input
                  type="number"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                  placeholder="0.00"
                  className="text-xl font-bold h-12 text-center"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                        formData.paymentMethod === pm.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      <pm.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Save Fare — P{formData.fare ? parseFloat(formData.fare).toFixed(2) : "0.00"}
              </Button>
            </div>
          )}
        </div>

        {/* Recent Transport Transactions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bus className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No transport transactions yet</p>
              <p className="text-sm">Enter fare details to create a transaction</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-muted rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">{tx.modeOfTransport}</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">P{tx.fare.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {tx.from} <ArrowRight className="w-3 h-3" /> {tx.to}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{tx.customerName}</span>
                    <span>{tx.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transport;
