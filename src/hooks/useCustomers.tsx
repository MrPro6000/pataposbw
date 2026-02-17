import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useCustomers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    if (!user) { setCustomers([]); setLoading(false); return; }
    try {
      const { data, error } = await (supabase as any)
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching customers:", error);
      else setCustomers(data || []);
    } catch (err) { console.error("Error fetching customers:", err); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const createCustomer = async (customer: {
    name: string; email?: string; phone?: string; notes?: string;
  }) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const { data, error } = await (supabase as any)
        .from("customers")
        .insert({
          user_id: user.id,
          name: customer.name,
          email: customer.email || null,
          phone: customer.phone || null,
          notes: customer.notes || null,
        })
        .select().single();
      if (error) return { error: error.message };
      setCustomers(prev => [data, ...prev]);
      return { error: null, data };
    } catch (err: any) { return { error: err.message }; }
  };

  const updateCustomer = async (id: string, updates: Partial<Pick<Customer, "name" | "email" | "phone" | "notes">>) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const { error } = await (supabase as any).from("customers").update(updates).eq("id", id).eq("user_id", user.id);
      if (error) return { error: error.message };
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return { error: null };
    } catch (err: any) { return { error: err.message }; }
  };

  const deleteCustomer = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const { error } = await (supabase as any).from("customers").delete().eq("id", id).eq("user_id", user.id);
      if (error) return { error: error.message };
      setCustomers(prev => prev.filter(c => c.id !== id));
      return { error: null };
    } catch (err: any) { return { error: err.message }; }
  };

  return { customers, loading, createCustomer, updateCustomer, deleteCustomer, refetch: fetchCustomers };
};
