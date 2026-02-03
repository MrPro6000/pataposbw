import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";

// Types
export interface UserProfile {
  email: string | null;
  phone?: string;
  fullName?: string;
  createdAt: string;
  kycStatus: "pending" | "submitted" | "approved" | "rejected";
  businessSetupComplete: boolean;
}

export interface KYCSubmission {
  userId: string;
  omangNumber: string;
  phoneNumber: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface BusinessProfile {
  userId: string;
  businessName: string;
  businessType: string;
  registrationNumber?: string;
  address: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  currency: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
    accountHolder: string;
  };
  termsAccepted: boolean;
  termsAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
}

// User Profile Functions
export const createUserProfile = async (userId: string, data: UserProfile) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    console.error("Error creating user profile:", error);
    return { error: error.message };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data() as UserProfile, error: null };
    }
    return { data: null, error: "User profile not found" };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// KYC Functions
export const submitKYC = async (userId: string, data: Omit<KYCSubmission, "userId" | "status" | "submittedAt">) => {
  try {
    const kycData: KYCSubmission = {
      ...data,
      userId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, "kyc_submissions", userId), kycData);
    
    // Update user profile KYC status
    await updateUserProfile(userId, { kycStatus: "submitted" });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getKYCSubmission = async (userId: string) => {
  try {
    const docRef = doc(db, "kyc_submissions", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data() as KYCSubmission, error: null };
    }
    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const getAllKYCSubmissions = async (status?: string) => {
  try {
    const kycRef = collection(db, "kyc_submissions");
    let q = query(kycRef, orderBy("submittedAt", "desc"));
    
    if (status) {
      q = query(kycRef, where("status", "==", status), orderBy("submittedAt", "desc"));
    }
    
    const querySnapshot = await getDocs(q);
    const submissions: KYCSubmission[] = [];
    querySnapshot.forEach((doc) => {
      submissions.push(doc.data() as KYCSubmission);
    });
    
    return { data: submissions, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

export const updateKYCStatus = async (
  userId: string, 
  status: "approved" | "rejected", 
  reviewerId: string,
  rejectionReason?: string
) => {
  try {
    const docRef = doc(db, "kyc_submissions", userId);
    await updateDoc(docRef, {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerId,
      ...(rejectionReason && { rejectionReason }),
    });
    
    // Update user profile
    await updateUserProfile(userId, { kycStatus: status });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Business Profile Functions
export const createBusinessProfile = async (userId: string, data: Omit<BusinessProfile, "userId" | "createdAt" | "updatedAt">) => {
  try {
    const businessData: BusinessProfile = {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, "businesses", userId), businessData);
    
    // Update user profile
    await updateUserProfile(userId, { businessSetupComplete: true });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getBusinessProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "businesses", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data() as BusinessProfile, error: null };
    }
    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const updateBusinessProfile = async (userId: string, data: Partial<BusinessProfile>) => {
  try {
    const docRef = doc(db, "businesses", userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
