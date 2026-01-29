import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  HelpCircle, 
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { 
    question: "How long do payouts take?", 
    answer: "Payouts are processed every weekday and typically arrive in your bank account within 1-2 business days. Weekend transactions are included in Monday's payout." 
  },
  { 
    question: "What are the transaction fees?", 
    answer: "Our standard rate is 2.95% per transaction with no monthly fees. Volume discounts are available for businesses processing over P50,000 per month." 
  },
  { 
    question: "How do I connect a new device?", 
    answer: "Go to Devices in your dashboard, click 'Add Device', and enter the 6-digit pairing code shown on your Pata terminal. The device will connect automatically." 
  },
  { 
    question: "Can I issue refunds?", 
    answer: "Yes, you can issue full or partial refunds from the Sales page. Click on any successful transaction to view details and use the 'Issue Refund' button. Refunds are processed within 5-10 business days." 
  },
  { 
    question: "How do I add staff members?", 
    answer: "Navigate to Staff in your dashboard and click 'Invite Staff'. Enter their email and select their role. They'll receive an invitation email to set up their account." 
  },
  { 
    question: "What payment methods are supported?", 
    answer: "We accept Visa, Mastercard, American Express, and Diners Club. Contactless payments including Apple Pay and Google Pay are also supported." 
  },
];

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    message: "",
  });
  const isMobile = useIsMobile();

  // Show mobile view on mobile devices
  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.message) return;
    alert("Support ticket submitted! We'll get back to you within 24 hours.");
    setTicketForm({ subject: "", category: "", message: "" });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#141414]">Help & Support</h1>
        <p className="text-[#141414]/60">Get help with your Pata account</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <a 
          href="tel:0800123456"
          className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-[#00C8E6]/20 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-[#00C8E6]" />
          </div>
          <div>
            <p className="font-semibold text-[#141414]">Call Us</p>
            <p className="text-sm text-[#141414]/60">0800 123 456</p>
          </div>
        </a>
        <a 
          href="mailto:support@pata.com"
          className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-[#141414]">Email Support</p>
            <p className="text-sm text-[#141414]/60">support@pata.com</p>
          </div>
        </a>
        <button className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-[#141414]">Live Chat</p>
            <p className="text-sm text-[#141414]/60">Available 24/7</p>
          </div>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#141414]">Frequently Asked Questions</h2>
            <a href="#" className="text-[#00C8E6] text-sm font-medium flex items-center gap-1 hover:underline">
              View all <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Search FAQs */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/40" />
            <Input 
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ List */}
          <div className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-[#f0f0f0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#fafafa]"
                >
                  <span className="font-medium text-[#141414] pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-[#141414]/60 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#141414]/60 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-[#141414]/70 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Ticket */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#141414] mb-4">Submit a Ticket</h2>
          <p className="text-[#141414]/60 mb-6">
            Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={ticketForm.category} onValueChange={(v) => setTicketForm({ ...ticketForm, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="payments">Payments & Transactions</SelectItem>
                  <SelectItem value="devices">Devices & Hardware</SelectItem>
                  <SelectItem value="payouts">Payouts & Banking</SelectItem>
                  <SelectItem value="account">Account & Settings</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={5}
              />
            </div>

            <Button 
              onClick={handleSubmitTicket}
              className="w-full bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Ticket
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
