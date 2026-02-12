import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, Camera, Mail, Phone, User, LogOut, Loader2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MobileProfileSheetProps {
  open: boolean;
  onClose: () => void;
  profile: { full_name: string | null; business_name: string | null; avatar_url?: string | null; phone?: string | null } | null;
  userEmail?: string;
  userId?: string;
  onProfileUpdated?: () => void;
}

const MobileProfileSheet = ({ open, onClose, profile, userEmail, userId, onProfileUpdated }: MobileProfileSheetProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Change password state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // 2FA state
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false);
  const [totpUri, setTotpUri] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [enrolling2FA, setEnrolling2FA] = useState(false);
  const [verifying2FA, setVerifying2FA] = useState(false);

  useEffect(() => {
    if (open) {
      setFullName(profile?.full_name || "");
      setPhone(profile?.phone || "");
      setAvatarUrl(profile?.avatar_url || "");
    }
  }, [open, profile]);

  const initials = profile?.full_name?.slice(0, 2).toUpperCase() ||
    userEmail?.slice(0, 2).toUpperCase() || "U";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", userId);

      toast({ title: "Photo uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("user_id", userId);

      if (error) throw error;

      toast({ title: "Profile Updated", description: "Your information has been saved" });
      onProfileUpdated?.();
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password changed successfully" });
      setPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEnroll2FA = async () => {
    setEnrolling2FA(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (error) throw error;
      setTotpUri(data.totp.uri);
      setTotpSecret(data.totp.secret);
      setFactorId(data.id);
      setTwoFADialogOpen(true);
    } catch (err: any) {
      toast({ title: "2FA Setup Failed", description: err.message, variant: "destructive" });
    } finally {
      setEnrolling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verifyCode || !factorId) return;
    setVerifying2FA(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });
      if (verifyError) throw verifyError;

      toast({ title: "2FA Enabled", description: "Two-factor authentication is now active" });
      setTwoFADialogOpen(false);
      setVerifyCode("");
    } catch (err: any) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    } finally {
      setVerifying2FA(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Logged out" });
      navigate("/login");
    } catch {
      toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
    }
  };

  return (
    <>
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
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-2xl object-cover" />
                ) : (
                  <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground">
                    {initials}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-foreground rounded-full flex items-center justify-center"
                >
                  {uploading ? <Loader2 className="w-4 h-4 text-background animate-spin" /> : <Camera className="w-4 h-4 text-background" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <p className="text-sm text-muted-foreground">Tap to change photo</p>
            </div>

            {/* Personal Information */}
            <div className="space-y-5 mb-6">
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input type="email" value={userEmail || ""} disabled className="bg-muted border-0" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+267 71 234 5678" className="bg-muted border-0" />
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-muted rounded-2xl p-4 mb-6">
              <h3 className="font-medium text-foreground mb-3">Security</h3>
              <Button variant="outline" className="w-full justify-start mb-2" onClick={() => setPasswordDialogOpen(true)}>
                🔒 Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleEnroll2FA} disabled={enrolling2FA}>
                {enrolling2FA ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                📱 Two-Factor Authentication
              </Button>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="w-full bg-red-500/10 rounded-2xl px-4 py-4 flex items-center gap-3 active:bg-red-500/20 transition-colors">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-medium text-red-500">Log Out</span>
            </button>
          </div>

          {/* Save Button */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="w-full h-12 font-semibold">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={twoFADialogOpen} onOpenChange={setTwoFADialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Open your authenticator app (Google Authenticator, Authy, etc.) and add this account using the secret below:
            </p>
            <div className="bg-muted p-3 rounded-xl break-all text-xs font-mono">{totpSecret}</div>
            <div className="space-y-2">
              <Label>Enter the 6-digit code from your app</Label>
              <Input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} placeholder="123456" maxLength={6} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleVerify2FA} disabled={verifying2FA || verifyCode.length !== 6}>
              {verifying2FA ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Verify & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileProfileSheet;
