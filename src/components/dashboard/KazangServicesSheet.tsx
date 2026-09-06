import { useState } from "react";
import {
  Smartphone,
  Wifi,
  Zap,
  Receipt,
  Ticket,
  Send,
  Tv,
  Bus,
  Gift,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/useTransactions";

export const kazangServices = [
  { id: "airtime", label: "Airtime", icon: Smartphone, refLabel: "Customer mobile number", refPlaceholder: "7X XXX XXX" },
  { id: "data", label: "Data Bundles", icon: Wifi, refLabel: "Customer mobile number", refPlaceholder: "7X XXX XXX" },
  { id: "electricity", label: "Prepaid Electricity", icon: Zap, refLabel: "Meter number", refPlaceholder: "01234567890" },
  { id: "bills", label: "Bill Payments", icon: Receipt, refLabel: "Account number", refPlaceholder: "Account / reference" },
  { id: "dstv", label: "TV Subscriptions", icon: Tv, refLabel: "Smartcard number", refPlaceholder: "Smartcard number" },
  { id: "lotto", label: "Lotto & Gaming", icon: Ticket, refLabel: "Customer mobile number", refPlaceholder: "7X XXX XXX" },
  { id: "transfer", label: "Money Transfer", icon: Send, refLabel: "Recipient mobile number", refPlaceholder: "7X XXX XXX" },
  { id: "bus", label: "Bus Tickets", icon: Bus, refLabel: "Passenger name", refPlaceholder: "Full name" },
  { id: "voucher", label: "Voucher Cash-out", icon: Gift, refLabel: "Voucher code", refPlaceholder: "Voucher code" },
];

const payMethods = [
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card" },
  { id: "mobile_money", label: "Mobile Money" },
  { id: "wallet", label: "Pata Wallet" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const KazangServicesSheet = ({ open, onClose }: Props) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { addTransaction, balance } = useTransactions();

  const [serviceId, setServiceId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const service = kazangServices.find((s) => s.id === serviceId);

  const reset = () => {
    setServiceId(null);
    setAmount("");
    setReference("");
    setMethod("");
    setProcessing(false);
    setSuccess(false);
    setToken(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast({ title: "Enter an amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (!reference.trim()) {
      toast({ title: "Missing details", description: service?.refLabel || "Reference required", variant: "destructive" });
      return;
    }
    if (!method) {
      toast({ title: "Select payment method", description: "Choose how the customer is paying", variant: "destructive" });
      return;
    }
    if (method === "wallet" && balance < value) {
      toast({ title: "Insufficient balance", description: `Wallet balance is P${balance.toFixed(2)}`, variant: "destructive" });
      return;
    }

    setProcessing(true);
    const { error } = await addTransaction({
      type: "sale",
      payment_method: method,
      amount: value,
      description: `Kazang • ${service?.label} • ${reference.trim()}`,
      status: "completed",
    });
    setProcessing(false);

    if (error) {
      toast({ title: "Failed", description: "Could not complete the transaction", variant: "destructive" });
      return;
    }

    if (serviceId === "electricity") {
      setToken(
        Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000)).join(" ")
      );
    }
    setSuccess(true);
    toast({ title: "Kazang sale complete", description: `P${value.toFixed(2)} • ${service?.label}` });
  };

  const body = (
    <div className="space-y-4">
      {!serviceId && (
        <div className="grid grid-cols-3 gap-3">
          {kazangServices.map((s) => (
            <button
              key={s.id}
              onClick={() => setServiceId(s.id)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-border text-foreground hover:bg-muted active:scale-95 transition-all aspect-square"
            >
              <s.icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-center leading-tight">{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {serviceId && !success && (
        <div className="space-y-4">
          <button
            onClick={() => setServiceId(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> All Kazang services
          </button>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
            {service && <service.icon className="w-5 h-5 text-primary" />}
            <p className="font-semibold text-foreground">{service?.label}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kazang-ref">{service?.refLabel}</Label>
            <Input
              id="kazang-ref"
              className="text-base"
              placeholder={service?.refPlaceholder}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kazang-amount">Amount (BWP)</Label>
            <Input
              id="kazang-amount"
              type="number"
              inputMode="decimal"
              className="text-base"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Pay with</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {payMethods.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                    {m.id === "wallet" ? ` (P${balance.toFixed(2)})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={close} disabled={processing}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={processing}>
              {processing ? "Processing..." : "Confirm sale"}
            </Button>
          </div>
        </div>
      )}

      {success && (
        <div className="text-center py-6 space-y-3">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
          <p className="text-lg font-semibold text-foreground">{service?.label} successful</p>
          <p className="text-sm text-muted-foreground">
            P{parseFloat(amount || "0").toFixed(2)} • {reference}
          </p>
          {token && (
            <div className="p-3 rounded-xl bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Prepaid token</p>
              <p className="font-mono font-semibold text-foreground">{token}</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={reset}>
              New Kazang sale
            </Button>
            <Button className="flex-1" onClick={close}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const title = "Kazang Services";

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && close()}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl pb-safe">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          {body}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
};

export default KazangServicesSheet;
