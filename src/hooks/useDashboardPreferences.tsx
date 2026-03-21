import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface DashboardPreferences {
  show_sell_products: boolean;
  show_transport: boolean;
  show_mobile_money: boolean;
  show_council_payments: boolean;
  show_devices: boolean;
  show_reports: boolean;
  show_staff: boolean;
  show_customers: boolean;
  show_vouchers: boolean;
  show_payment_links: boolean;
  show_invoices: boolean;
  show_capital: boolean;
  show_mukuru: boolean;
}

const defaultPreferences: DashboardPreferences = {
  show_sell_products: true,
  show_transport: true,
  show_mobile_money: true,
  show_council_payments: true,
  show_devices: true,
  show_reports: true,
  show_staff: true,
  show_customers: true,
  show_vouchers: true,
  show_payment_links: true,
  show_invoices: true,
  show_capital: true,
  show_mukuru: true,
};

export const useDashboardPreferences = () => {
  const { user } = useAuth();
  // Initialize from localStorage cache to prevent flickering
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    try {
      const cached = localStorage.getItem("pata_dashboard_prefs");
      if (cached) return JSON.parse(cached) as DashboardPreferences;
    } catch {}
    return defaultPreferences;
  });
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("dashboard_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        const { id, user_id, created_at, updated_at, ...prefs } = data;
        setPreferences(prefs as DashboardPreferences);
        // Cache to localStorage to prevent flicker on next load
        localStorage.setItem("pata_dashboard_prefs", JSON.stringify(prefs));
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const savePreferences = async (prefs: DashboardPreferences) => {
    if (!user) return;
    const { error } = await supabase
      .from("dashboard_preferences")
      .upsert({ user_id: user.id, ...prefs }, { onConflict: "user_id" });
    if (!error) {
      setPreferences(prefs);
    }
    return { error };
  };

  return { preferences, loading, savePreferences, refetch: fetchPreferences };
};
