import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileTransportView from "@/components/dashboard/MobileTransportView";
import PaymentFlow from "@/components/dashboard/PaymentFlow";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bus, MapPin, ArrowRight, User } from "lucide-react";
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
import { useTransactions } from "@/hooks/useTransactions";

const transportModes = ["Combi", "Taxi", "Bus", "Yango", "inDrive"];

const Transport = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { transactions, addTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    customerName: "",
    from: "",
    to: "",
    modeOfTransport: "",
    fare: "",
  });
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);

  if (isMobile) {
    return <MobileTransportView />;
  }

  // Filter only transport transactions
  const transportTransactions = transactions.filter((t) => t.type === "transport");

  const handleProceedToPayment = () => {
    if (!formData.from || !formData.to || !formData.fare || !formData.customerName || !formData.modeOfTransport) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setShowPaymentFlow(true);
  };

  const handlePaymentComplete = async () => {
    const fare = parseFloat(formData.fare);
    const description = `${formData.modeOfTransport}: ${formData.customerName} — ${formData.from} → ${formData.to}`;

    const { error } = await addTransaction({
      type: "transport",
      payment_method: "cash",
      amount: fare,
      description,
      status: "completed",
    });

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Transport Fare Saved", description: `P${fare.toFixed(2)} — ${formData.from} → ${formData.to}` });
    }

    setShowPaymentFlow(false);
    setFormData({ customerName: "", from: "", to: "", modeOfTransport: "", fare: "" });
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
          {showPaymentFlow ? (
            <PaymentFlow
              total={parseFloat(formData.fare) || 0}
              itemCount={1}
              onComplete={handlePaymentComplete}
              onBack={() => setShowPaymentFlow(false)}
            />
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

              <Button
                onClick={handleProceedToPayment}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Proceed to Payment — P{formData.fare ? parseFloat(formData.fare).toFixed(2) : "0.00"}
              </Button>
            </div>
          )}
        </div>

        {/* Recent Transport Transactions from DB */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
          {transportTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bus className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No transport transactions yet</p>
              <p className="text-sm">Enter fare details to create a transaction</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transportTransactions.map((tx) => {
                const parts = tx.description?.match(/^(.+?):\s*(.+?)\s*—\s*(.+?)\s*→\s*(.+)$/);
                const mode = parts?.[1] || "Transport";
                const customer = parts?.[2] || "";
                const from = parts?.[3] || "";
                const to = parts?.[4] || "";

                return (
                  <div key={tx.id} className="bg-muted rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground text-sm">{mode}</span>
                      </div>
                      <span className="text-lg font-bold text-foreground">P{tx.amount.toFixed(2)}</span>
                    </div>
                    {from && to && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {from} <ArrowRight className="w-3 h-3" /> {to}
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{customer}</span>
                      <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transport;
