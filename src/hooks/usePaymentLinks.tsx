import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface PaymentLink {
  id: string;
  amount: number;
  customer_name: string;
  customer_phone: string | null;
  description: string | null;
  status: string;
  link_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export const usePaymentLinks = () => {
  const { user } = useAuth();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentLinks = useCallback(async () => {
    if (!user) { setPaymentLinks([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("payment_links")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) { console.error("Error fetching payment links:", error); }
      else {
        setPaymentLinks((data || []).map((l: any) => ({
          id: l.id, amount: Number(l.amount), customer_name: l.customer_name,
          customer_phone: l.customer_phone, description: l.description,
          status: l.status, link_url: l.link_url, paid_at: l.paid_at,
          created_at: l.created_at, updated_at: l.updated_at,
        })));
      }
    } catch (err) { console.error("Error fetching payment links:", err); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchPaymentLinks(); }, [fetchPaymentLinks]);

  const createPaymentLink = async (link: {
    amount: number; customer_name: string; customer_phone?: string; description?: string;
  }) => {
    if (!user) return { error: "Not authenticated", data: null };
    try {
      const { data, error } = await supabase
        .from("payment_links")
        .insert({
          user_id: user.id, amount: link.amount, customer_name: link.customer_name,
          customer_phone: link.customer_phone || null, description: link.description || null,
          status: "pending",
        })
        .select().single();
      if (error) return { error: error.message, data: null };
      // Generate link URL using the record ID
      const linkUrl = `${window.location.origin}/pay/${data.id}`;
      await supabase.from("payment_links").update({ link_url: linkUrl }).eq("id", data.id);
      const finalData = { ...data, amount: Number(data.amount), link_url: linkUrl };
      setPaymentLinks(prev => [finalData, ...prev]);
      return { error: null, data: finalData };
    } catch (err: any) { return { error: err.message, data: null }; }
  };

  return { paymentLinks, loading, createPaymentLink, refetch: fetchPaymentLinks };
};
