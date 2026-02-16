import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Transaction {
  id: string;
  type: string;
  payment_method: string;
  amount: number;
  status: string;
  description: string | null;
  created_at: string;
  is_dummy?: boolean;
}

// No dummy transactions - all data comes from DB

export const useTransactions = () => {
  const { user } = useAuth();
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setDbTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setDbTransactions(
          (data || []).map((t) => ({
            id: t.id,
            type: t.type,
            payment_method: t.payment_method,
            amount: Number(t.amount),
            status: t.status || "completed",
            description: t.description,
            created_at: t.created_at || new Date().toISOString(),
            is_dummy: false,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // All transactions from DB only
  const allTransactions = [...dbTransactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Balance calculations
  const totalIncome = allTransactions
    .filter((t) => t.amount > 0 && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.amount < 0 && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Last 7 days income
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7DaysIncome = allTransactions
    .filter(
      (t) =>
        t.amount > 0 &&
        t.status === "completed" &&
        new Date(t.created_at) >= sevenDaysAgo
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const addTransaction = async (tx: {
    type: string;
    payment_method: string;
    amount: number;
    description?: string;
    status?: string;
  }) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: tx.type,
          payment_method: tx.payment_method,
          amount: tx.amount,
          description: tx.description || null,
          status: tx.status || "completed",
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding transaction:", error);
        return { error: error.message };
      }

      // Add to local state immediately
      setDbTransactions((prev) => [
        {
          id: data.id,
          type: data.type,
          payment_method: data.payment_method,
          amount: Number(data.amount),
          status: data.status || "completed",
          description: data.description,
          created_at: data.created_at || new Date().toISOString(),
          is_dummy: false,
        },
        ...prev,
      ]);

      return { error: null, data };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    transactions: allTransactions,
    dbTransactions,
    loading,
    balance,
    totalIncome,
    totalExpenses,
    last7DaysIncome,
    addTransaction,
    refetch: fetchTransactions,
  };
};
