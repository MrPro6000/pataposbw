import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Voucher {
  id: string;
  code: string;
  amount: number;
  status: string;
  recipient_name: string | null;
  recipient_phone: string | null;
  redeemed_at: string | null;
  redeemed_by: string | null;
  expires_at: string | null;
  created_at: string;
}

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PATA-";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export const useVouchers = () => {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = useCallback(async () => {
    if (!user) { setVouchers([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setVouchers(data.map((v: any) => ({ ...v, amount: Number(v.amount) })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  const createVoucher = async (opts: { amount: number; recipient_name?: string; recipient_phone?: string }) => {
    if (!user) return { error: "Not authenticated", data: null };
    const code = generateCode();
    const { data, error } = await supabase.from("vouchers").insert({
      user_id: user.id, code, amount: opts.amount,
      recipient_name: opts.recipient_name || null,
      recipient_phone: opts.recipient_phone || null,
    }).select().single();
    if (!error) await fetchVouchers();
    return { error: error?.message || null, data: data ? { ...data, amount: Number(data.amount) } : null };
  };

  const redeemVoucher = async (code: string) => {
    const { data: voucher, error: fetchErr } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();
    if (fetchErr || !voucher) return { error: "Voucher not found" };
    if (voucher.status !== "active") return { error: "Voucher already redeemed or expired" };
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) return { error: "Voucher has expired" };
    
    const { error } = await supabase.from("vouchers").update({
      status: "redeemed", redeemed_at: new Date().toISOString(),
      redeemed_by: user?.id || "anonymous",
    }).eq("id", voucher.id);
    if (!error) await fetchVouchers();
    return { error: error?.message || null, amount: Number(voucher.amount) };
  };

  return { vouchers, loading, createVoucher, redeemVoucher, refetch: fetchVouchers };
};
