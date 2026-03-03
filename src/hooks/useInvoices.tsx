import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  amount: number;
  status: string;
  description: string | null;
  notes: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    if (!user) { setInvoices([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching invoices:", error);
      else {
        setInvoices((data || []).map((i: any) => ({
          id: i.id, invoice_number: i.invoice_number, customer_name: i.customer_name,
          customer_email: i.customer_email, customer_phone: i.customer_phone,
          customer_address: i.customer_address, amount: Number(i.amount),
          status: i.status, description: i.description, notes: i.notes,
          due_date: i.due_date, paid_at: i.paid_at, created_at: i.created_at, updated_at: i.updated_at,
        })));
      }
    } catch (err) { console.error("Error fetching invoices:", err); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const createInvoice = async (
    invoice: {
      customer_name: string; customer_email?: string; customer_phone?: string;
      customer_address?: string; amount: number; description?: string;
      due_date?: string; notes?: string;
    },
    items?: { description: string; quantity: number; unit_price: number }[]
  ) => {
    if (!user) return { error: "Not authenticated" };
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id, invoice_number: invoiceNumber,
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email || null,
          customer_phone: invoice.customer_phone || null,
          customer_address: (invoice as any).customer_address || null,
          amount: invoice.amount,
          description: invoice.description || null,
          due_date: invoice.due_date || null,
          notes: (invoice as any).notes || null,
          status: "draft",
        })
        .select().single();
      if (error) return { error: error.message };

      // Insert line items
      if (items && items.length > 0 && data) {
        await supabase.from("invoice_items").insert(
          items.map(it => ({ invoice_id: data.id, description: it.description, quantity: it.quantity, unit_price: it.unit_price }))
        );
      }

      setInvoices(prev => [{ ...data, amount: Number(data.amount), customer_address: data.customer_address, notes: data.notes } as Invoice, ...prev]);
      return { error: null, data };
    } catch (err: any) { return { error: err.message }; }
  };

  const updateInvoice = async (id: string, updates: Partial<Pick<Invoice, "status" | "paid_at">>) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const { error } = await supabase.from("invoices").update(updates).eq("id", id).eq("user_id", user.id);
      if (error) return { error: error.message };
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
      return { error: null };
    } catch (err: any) { return { error: err.message }; }
  };

  const deleteInvoice = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id).eq("user_id", user.id);
      if (error) return { error: error.message };
      setInvoices(prev => prev.filter(i => i.id !== id));
      return { error: null };
    } catch (err: any) { return { error: err.message }; }
  };

  return { invoices, loading, createInvoice, updateInvoice, deleteInvoice, refetch: fetchInvoices };
};
