import { useState } from "react";
import { X, ChevronLeft, Camera, Mail, Phone, User, LogOut } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MobileProfileSheetProps {
  open: boolean;
  onClose: () => void;
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileProfileSheet = ({ open, onClose, profile, userEmail }: MobileProfileSheetProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: profile?.full_name || "",
    email: userEmail || "",
    phone: "+267 71 234 5678",
  });

  const initials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "U";

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved",
    });
    onClose();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              </DrawerClose>
              <DrawerTitle className="text-foreground">Personal Profile</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-24">
          {/* Profile Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground">
                {initials}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-background" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Tap to change photo</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-5 mb-6">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input 
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="bg-muted border-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                placeholder="your@email.com"
                disabled
                className="bg-muted border-0"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input 
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                placeholder="+267 71 234 5678"
                className="bg-muted border-0"
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-muted rounded-2xl p-4 mb-6">
            <h3 className="font-medium text-foreground mb-3">Security</h3>
            <Button variant="outline" className="w-full justify-start mb-2">
              🔒 Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📱 Two-Factor Authentication
            </Button>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 rounded-2xl px-4 py-4 flex items-center gap-3 active:bg-red-500/20 transition-colors"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-medium text-red-500">Log Out</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border">
          <Button 
            onClick={handleSave}
            className="w-full h-12 font-semibold"
          >
            Save Changes
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileProfileSheet;
