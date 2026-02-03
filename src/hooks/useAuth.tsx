import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthChange, signIn, signUp, signOut, resetPassword } from "@/integrations/firebase/auth";
import { getUserProfile, getBusinessProfile, UserProfile, BusinessProfile } from "@/integrations/firebase/firestore";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  businessProfile: BusinessProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfiles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async (userId: string) => {
    const [userProfileResult, businessProfileResult] = await Promise.all([
      getUserProfile(userId),
      getBusinessProfile(userId),
    ]);

    if (userProfileResult.data) {
      setUserProfile(userProfileResult.data);
    }
    if (businessProfileResult.data) {
      setBusinessProfile(businessProfileResult.data);
    }
  };

  const refreshProfiles = async () => {
    if (user) {
      await fetchProfiles(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchProfiles(firebaseUser.uid);
      } else {
        setUserProfile(null);
        setBusinessProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    businessProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfiles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
