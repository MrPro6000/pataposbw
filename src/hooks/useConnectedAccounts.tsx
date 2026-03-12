import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface ConnectedAccount {
  id: string;
  type: "bank" | "mobile_money" | "card";
  name: string;
  details: string;
  bankName?: string;
  branchCode?: string;
  accountHolder?: string;
  provider?: string;
  providerImg?: string;
  isDefault: boolean;
}

export const useConnectedAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    if (!user) { setAccounts([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("connected_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) { console.error("Error fetching accounts:", error); }
      else {
        setAccounts((data || []).map(a => ({
          id: a.id,
          type: a.type as ConnectedAccount["type"],
          name: a.name,
          details: a.details,
          bankName: a.bank_name || undefined,
          branchCode: a.branch_code || undefined,
          accountHolder: a.account_holder || undefined,
          provider: a.provider || undefined,
          isDefault: a.is_default,
        })));
      }
    } catch (err) { console.error("Error fetching accounts:", err); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const addAccount = async (account: Omit<ConnectedAccount, "id">) => {
    if (!user) return;
    // If first account, make it default
    const isDefault = accounts.length === 0 ? true : account.isDefault;

    const { data, error } = await supabase
      .from("connected_accounts")
      .insert({
        user_id: user.id,
        type: account.type,
        name: account.name,
        details: account.details,
        bank_name: account.bankName || null,
        branch_code: account.branchCode || null,
        account_holder: account.accountHolder || null,
        provider: account.provider || null,
        is_default: isDefault,
      })
      .select()
      .single();

    if (error) { toast.error("Failed to save account"); return; }
    
    const newAccount: ConnectedAccount = {
      id: data.id,
      type: data.type as ConnectedAccount["type"],
      name: data.name,
      details: data.details,
      bankName: data.bank_name || undefined,
      branchCode: data.branch_code || undefined,
      accountHolder: data.account_holder || undefined,
      provider: data.provider || undefined,
      isDefault: data.is_default,
    };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const removeAccount = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("connected_accounts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) { toast.error("Failed to remove account"); return; }

    setAccounts(prev => {
      const updated = prev.filter(a => a.id !== id);
      // If we removed the default, set first remaining as default
      if (updated.length > 0 && !updated.some(a => a.isDefault)) {
        updated[0].isDefault = true;
        supabase.from("connected_accounts").update({ is_default: true }).eq("id", updated[0].id).then();
      }
      return updated;
    });
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    // Unset all defaults, then set the new one
    await supabase.from("connected_accounts").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("connected_accounts").update({ is_default: true }).eq("id", id);
    setAccounts(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return { accounts, loading, addAccount, removeAccount, setDefault, refetch: fetchAccounts };
};
