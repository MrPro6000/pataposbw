import { supabase } from "./client";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type Profile = Tables<"profiles">;
export type KYCSubmission = Tables<"kyc_submissions">;

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: TablesUpdate<"profiles">) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get KYC submission
export const getKYCSubmission = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("kyc_submissions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Submit KYC
export const submitKYC = async (
  userId: string,
  data: {
    omangNumber: string;
    phoneNumber?: string;
    idFrontUrl?: string;
    idBackUrl?: string;
  }
) => {
  try {
    const { error } = await supabase.from("kyc_submissions").insert({
      user_id: userId,
      omang_number: data.omangNumber,
      phone_number: data.phoneNumber,
      id_front_url: data.idFrontUrl,
      id_back_url: data.idBackUrl,
      status: "pending",
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get all KYC submissions (admin)
export const getAllKYCSubmissions = async (status?: "pending" | "approved" | "rejected") => {
  try {
    let query = supabase
      .from("kyc_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Update KYC status (admin)
export const updateKYCStatus = async (
  kycId: string,
  status: "approved" | "rejected",
  reviewerId: string,
  rejectionReason?: string
) => {
  try {
    const updateData: {
      status: "approved" | "rejected";
      reviewed_at: string;
      reviewed_by: string;
      rejection_reason?: string;
    } = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    };

    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { error } = await supabase
      .from("kyc_submissions")
      .update(updateData)
      .eq("id", kycId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Check if user has admin role
export const checkUserRole = async (userId: string, role: "admin" | "moderator" | "user") => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", role)
      .single();

    if (error && error.code !== "PGRST116") {
      return { hasRole: false, error: error.message };
    }

    return { hasRole: !!data, error: null };
  } catch (error: any) {
    return { hasRole: false, error: error.message };
  }
};
