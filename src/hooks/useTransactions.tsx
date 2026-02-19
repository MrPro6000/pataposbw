import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import {
  getCachedData,
  setCachedData,
  addToOfflineQueue,
  isOnline,
} from "@/lib/offlineCache";

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

export const useTransactions = () => {
  const { user } = useAuth();
  const cacheKey = user ? `transactions_${user.id}` : "";
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>(
    () => (cacheKey ? getCachedData<Transaction[]>(cacheKey) : null) || []
  );
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setDbTransactions([]);
      setLoading(false);
      return;
    }

    // If offline, just use cached data
    if (!isOnline()) {
      const cached = getCachedData<Transaction[]>(cacheKey);
      if (cached) setDbTransactions(cached);
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
        const mapped = (data || []).map((t) => ({
          id: t.id,
          type: t.type,
          payment_method: t.payment_method,
          amount: Number(t.amount),
          status: t.status || "completed",
          description: t.description,
          created_at: t.created_at || new Date().toISOString(),
          is_dummy: false,
        }));
        setDbTransactions(mapped);
        setCachedData(cacheKey, mapped);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      // Fallback to cache
      const cached = getCachedData<Transaction[]>(cacheKey);
      if (cached) setDbTransactions(cached);
    } finally {
      setLoading(false);
    }
  }, [user, cacheKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Real-time subscription — balance updates instantly when a payment link is paid
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`transactions_realtime_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const t = payload.new as any;
          const newTx: Transaction = {
            id: t.id,
            type: t.type,
            payment_method: t.payment_method,
            amount: Number(t.amount),
            status: t.status || "completed",
            description: t.description,
            created_at: t.created_at || new Date().toISOString(),
            is_dummy: false,
          };
          setDbTransactions((prev) => {
            // Avoid duplicates (optimistic entry may already exist)
            if (prev.some((tx) => tx.id === newTx.id)) return prev;
            const updated = [newTx, ...prev];
            setCachedData(cacheKey, updated);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, cacheKey]);

  const allTransactions = [...dbTransactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalIncome = allTransactions
    .filter((t) => t.amount > 0 && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.amount < 0 && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Processing payouts should also reduce available balance
  const processingPayouts = allTransactions
    .filter((t) => t.amount < 0 && t.status === "processing")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses - processingPayouts;

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

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type: tx.type,
      payment_method: tx.payment_method,
      amount: tx.amount,
      status: tx.status || "completed",
      description: tx.description || null,
      created_at: new Date().toISOString(),
      is_dummy: false,
    };

    // Optimistically add to local state
    setDbTransactions((prev) => {
      const updated = [newTx, ...prev];
      setCachedData(cacheKey, updated);
      return updated;
    });

    if (!isOnline()) {
      // Queue for later sync
      addToOfflineQueue({
        table: "transactions",
        type: "insert",
        payload: {
          user_id: user.id,
          type: tx.type,
          payment_method: tx.payment_method,
          amount: tx.amount,
          description: tx.description || null,
          status: tx.status || "completed",
        },
      });
      return { error: null, data: newTx };
    }

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

      // Replace optimistic entry with real one
      setDbTransactions((prev) => {
        const updated = prev.map((t) =>
          t.id === newTx.id
            ? {
                id: data.id,
                type: data.type,
                payment_method: data.payment_method,
                amount: Number(data.amount),
                status: data.status || "completed",
                description: data.description,
                created_at: data.created_at || new Date().toISOString(),
                is_dummy: false,
              }
            : t
        );
        setCachedData(cacheKey, updated);
        return updated;
      });

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