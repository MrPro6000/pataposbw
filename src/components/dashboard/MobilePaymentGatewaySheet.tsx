import { useState } from "react";
import { X, ChevronLeft, Globe, Code, Copy, CheckCircle, MessageSquare } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface MobilePaymentGatewaySheetProps {
  open: boolean;
  onClose: () => void;
}

const MobilePaymentGatewaySheet = ({ open, onClose }: MobilePaymentGatewaySheetProps) => {
  const { toast } = useToast();
  const [view, setView] = useState<"info" | "setup" | "contact">("info");
  const [contactForm, setContactForm] = useState({ name: "", email: "", website: "", message: "" });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`<script src="https://pay.pata.co.bw/widget.js"></script>
<div id="pata-checkout" data-merchant="your-merchant-id"></div>`);
    toast({ title: "Copied", description: "Integration code copied to clipboard" });
  };

  const handleSubmitContact = () => {
    if (!contactForm.name || !contactForm.email) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Request Submitted", description: "Our team will contact you within 24 hours" });
    setContactForm({ name: "", email: "", website: "", message: "" });
    setView("info");
  };

  const features = [
    { title: "Accept All Cards", description: "Visa, Mastercard, and local cards" },
    { title: "Mobile Money", description: "Orange Money, Smega, MyZaka" },
    { title: "Easy Integration", description: "Simple copy-paste setup" },
    { title: "Real-time Dashboard", description: "Track all transactions" },
    { title: "Secure Payments", description: "PCI DSS compliant" },
    { title: "Low Fees", description: "Competitive transaction rates" },
  ];

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view !== "info" ? (
                <button 
                  onClick={() => setView("info")}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              ) : (
                <DrawerClose asChild>
                  <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                </DrawerClose>
              )}
              <DrawerTitle className="text-foreground">
                {view === "setup" ? "Integration Guide" : view === "contact" ? "Contact Sales" : "Payment Gateway"}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {view === "info" && (
            <>
              {/* Hero */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 mb-5 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Pata Payment Gateway</h2>
                <p className="text-white/80 text-sm">Accept payments on your website or online store</p>
              </div>

              {/* Features */}
              <h3 className="font-semibold text-foreground mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature) => (
                  <div key={feature.title} className="bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <p className="font-medium text-foreground text-sm">{feature.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setView("setup")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                >
                  <Code className="w-4 h-4 mr-2" />
                  View Integration Guide
                </Button>
                <Button
                  onClick={() => setView("contact")}
                  variant="outline"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Talk to Sales
                </Button>
              </div>
            </>
          )}

          {view === "setup" && (
            <>
              {/* Integration Steps */}
              <div className="space-y-5">
                <div className="bg-muted rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Step 1: Copy the code</h4>
                  <p className="text-sm text-muted-foreground mb-3">Add this code to your website's checkout page</p>
                  <div className="bg-card dark:bg-background rounded-lg p-3 mb-3 border border-border">
                    <code className="text-xs text-emerald-600 dark:text-emerald-400 break-all">
                      {`<script src="https://pay.pata.co.bw/widget.js"></script>`}
                      <br />
                      {`<div id="pata-checkout" data-merchant="your-id"></div>`}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Copy Code
                  </Button>
                </div>

                <div className="bg-muted rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Step 2: Configure settings</h4>
                  <p className="text-sm text-muted-foreground">Replace "your-id" with your merchant ID from the dashboard settings</p>
                </div>

                <div className="bg-muted rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Step 3: Test & Go Live</h4>
                  <p className="text-sm text-muted-foreground">Use test mode to verify everything works, then switch to live</p>
                </div>

                <div className="bg-emerald-500/10 rounded-xl p-4">
                  <p className="text-sm text-foreground">
                    <strong>Need help?</strong> Our team can help you integrate the payment gateway with any platform.
                  </p>
                  <Button
                    onClick={() => setView("contact")}
                    className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Contact Integration Team
                  </Button>
                </div>
              </div>
            </>
          )}

          {view === "contact" && (
            <>
              <div className="bg-emerald-500/10 rounded-xl p-4 mb-5">
                <p className="text-sm text-foreground">
                  Fill out the form below and our team will reach out to help you set up the payment gateway for your online store.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Your Name *</Label>
                  <Input
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Email *</Label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Website URL</Label>
                  <Input
                    placeholder="https://yourstore.com"
                    value={contactForm.website}
                    onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Message (optional)</Label>
                  <Input
                    placeholder="Tell us about your integration needs"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <Button
                  onClick={handleSubmitContact}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  Submit Request
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePaymentGatewaySheet;
