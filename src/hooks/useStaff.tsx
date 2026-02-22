import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  salary: number;
  pay_frequency: string;
  status: string;
  last_paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useStaff = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = useCallback(async () => {
    if (!user) { setStaff([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("staff_members")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setStaff(data.map((s: any) => ({ ...s, salary: Number(s.salary) })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const addStaff = async (member: { name: string; email?: string; phone?: string; role: string; salary: number; pay_frequency: string }) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase.from("staff_members").insert({
      user_id: user.id, name: member.name, email: member.email || null,
      phone: member.phone || null, role: member.role, salary: member.salary,
      pay_frequency: member.pay_frequency,
    });
    if (!error) await fetchStaff();
    return { error: error?.message || null };
  };

  const updateStaff = async (id: string, updates: Partial<{ name: string; email: string; phone: string; role: string; salary: number; pay_frequency: string; status: string }>) => {
    const { error } = await supabase.from("staff_members").update(updates).eq("id", id);
    if (!error) await fetchStaff();
    return { error: error?.message || null };
  };

  const removeStaff = async (id: string) => {
    const { error } = await supabase.from("staff_members").delete().eq("id", id);
    if (!error) await fetchStaff();
    return { error: error?.message || null };
  };

  const payStaff = async (memberId: string, amount: number) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase.from("staff_payments").insert({
      user_id: user.id, staff_member_id: memberId, amount, payment_method: "wallet",
    });
    if (!error) {
      await supabase.from("staff_members").update({ last_paid_at: new Date().toISOString() }).eq("id", memberId);
      await fetchStaff();
    }
    return { error: error?.message || null };
  };

  const payAllStaff = async () => {
    if (!user) return { error: "Not authenticated" };
    const active = staff.filter(s => s.status === "active");
    for (const member of active) {
      await payStaff(member.id, member.salary);
    }
    return { error: null };
  };

  return { staff, loading, addStaff, updateStaff, removeStaff, payStaff, payAllStaff, refetch: fetchStaff };
};
