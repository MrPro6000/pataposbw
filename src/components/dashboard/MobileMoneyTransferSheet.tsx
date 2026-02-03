import { useState } from "react";
import { X, Send, Globe, User, Phone, DollarSign, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MobileMoneyTransferSheetProps {
  open: boolean;
  onClose: () => void;
}

type Step = "details" | "review" | "processing" | "success";

const countries = [
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", currency: "USD" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", currency: "MZN" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", currency: "ZMW" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", currency: "MWK" },
  { code: "NA", name: "Namibia", flag: "🇳🇦", currency: "NAD" },
];

// Mock exchange rates (BWP to other currencies)
const exchangeRates: Record<string, number> = {
  ZAR: 1.35,
  USD: 0.074,
  MZN: 4.72,
  ZMW: 1.67,
  MWK: 127.5,
  NAD: 1.35,
};

const MobileMoneyTransferSheet = ({ open, onClose }: MobileMoneyTransferSheetProps) => {
  const [step, setStep] = useState<Step>("details");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferReference, setTransferReference] = useState("");
  const { toast } = useToast();

  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const transferFee = 25; // Fixed fee in Pula
  const exchangeRate = selectedCountryData ? exchangeRates[selectedCountryData.currency] || 1 : 1;
  const amountNum = parseFloat(amount) || 0;
  const recipientAmount = amountNum * exchangeRate;
  const totalAmount = amountNum + transferFee;

  const resetForm = () => {
    setStep("details");
    setRecipientName("");
    setRecipientPhone("");
    setSelectedCountry("");
    setAmount("");
    setTransferReference("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateDetails = () => {
    if (!recipientName.trim()) {
      toast({ title: "Error", description: "Please enter recipient name", variant: "destructive" });
      return false;
    }
    if (!recipientPhone.trim()) {
      toast({ title: "Error", description: "Please enter recipient phone", variant: "destructive" });
      return false;
    }
    if (!selectedCountry) {
      toast({ title: "Error", description: "Please select destination country", variant: "destructive" });
      return false;
    }
    if (!amount || amountNum <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return false;
    }
    if (amountNum > 50000) {
      toast({ title: "Error", description: "Maximum transfer amount is P50,000", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateDetails()) {
      setStep("review");
    }
  };

  const handleConfirmTransfer = async () => {
    setStep("processing");
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "Error", description: "Please log in to send money", variant: "destructive" });
        setStep("details");
        return;
      }

      const reference = `MKR${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase.from("money_transfers").insert({
        user_id: user.id,
        provider: "mukuru",
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        recipient_country: selectedCountry,
        amount: amountNum,
        currency: "BWP",
        fees: transferFee,
        exchange_rate: exchangeRate,
        recipient_amount: recipientAmount,
        reference_number: reference,
        status: "processing",
      });

      if (error) throw error;

      setTransferReference(reference);
      setStep("success");
    } catch (error) {
      console.error("Transfer error:", error);
      toast({ title: "Error", description: "Failed to process transfer. Please try again.", variant: "destructive" });
      setStep("review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-foreground">
                  {step === "details" && "Send Money"}
                  {step === "review" && "Review Transfer"}
                  {step === "processing" && "Processing..."}
                  {step === "success" && "Transfer Sent!"}
                </DrawerTitle>
                <p className="text-xs text-muted-foreground">Powered by Mukuru</p>
              </div>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {/* DETAILS STEP */}
          {step === "details" && (
            <div className="space-y-5">
              {/* Recipient Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Recipient Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="recipientName" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="recipientName"
                      placeholder="Enter recipient's full name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="pl-10 h-12 bg-muted border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientPhone" className="text-foreground">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="recipientPhone"
                      type="tel"
                      placeholder="+27 71 234 5678"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="pl-10 h-12 bg-muted border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Destination Country</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="h-12 bg-muted border-0">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <SelectValue placeholder="Select country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Transfer Amount</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">You Send (BWP)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">P</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 h-14 text-2xl font-bold bg-muted border-0"
                    />
                  </div>
                </div>

                {selectedCountryData && amountNum > 0 && (
                  <div className="bg-muted rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transfer fee</span>
                      <span className="text-foreground">P{transferFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exchange rate</span>
                      <span className="text-foreground">1 BWP = {exchangeRate.toFixed(4)} {selectedCountryData.currency}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-muted-foreground">They receive</span>
                      <span className="font-bold text-foreground text-lg">
                        {selectedCountryData.currency} {recipientAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-14 font-semibold text-lg"
                disabled={!recipientName || !recipientPhone || !selectedCountry || !amount}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* REVIEW STEP */}
          {step === "review" && selectedCountryData && (
            <div className="space-y-5">
              <div className="bg-muted rounded-2xl p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Sending</p>
                <p className="text-4xl font-bold text-foreground">P{amountNum.toFixed(2)}</p>
                <p className="text-muted-foreground mt-1">
                  to {selectedCountryData.flag} {selectedCountryData.name}
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border divide-y divide-border">
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium text-foreground">{recipientName}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium text-foreground">{recipientPhone}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">They receive</span>
                  <span className="font-medium text-foreground">
                    {selectedCountryData.currency} {recipientAmount.toFixed(2)}
                  </span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Transfer fee</span>
                  <span className="font-medium text-foreground">P{transferFee.toFixed(2)}</span>
                </div>
                <div className="p-4 flex justify-between bg-muted/50">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-foreground text-lg">P{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("details")}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmTransfer}
                  className="flex-1 h-12 font-semibold"
                >
                  Confirm & Send
                </Button>
              </div>
            </div>
          )}

          {/* PROCESSING STEP */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-xl font-semibold text-foreground">Processing Transfer...</p>
              <p className="text-muted-foreground mt-2">Please wait</p>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && selectedCountryData && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Transfer Sent!</p>
              <p className="text-muted-foreground text-center mb-4">
                {recipientName} will receive {selectedCountryData.currency} {recipientAmount.toFixed(2)}
              </p>
              
              <div className="w-full bg-muted rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground text-center">Reference Number</p>
                <p className="text-lg font-mono font-bold text-foreground text-center">{transferReference}</p>
              </div>

              <Button onClick={handleClose} className="w-full h-12">
                Done
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMoneyTransferSheet;
