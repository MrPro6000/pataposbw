import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getOfflineQueue,
  removeFromQueue,
  registerSyncCallback,
  isOnline,
  QueuedAction,
} from "@/lib/offlineCache";
import { useToast } from "@/hooks/use-toast";

/**
 * Global hook that processes the offline queue when coming back online.
 * Mount once at app root level.
 */
export const useOfflineSync = () => {
  const { toast } = useToast();
  const [online, setOnline] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(getOfflineQueue().length);

  const processQueue = useCallback(async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    toast({
      title: "Syncing offline actions…",
      description: `${queue.length} action(s) queued while offline.`,
    });

    let synced = 0;
    for (const action of queue) {
      try {
        await processAction(action);
        removeFromQueue(action.id);
        synced++;
      } catch (e) {
        console.error("Failed to sync action:", action, e);
        // Leave in queue to retry later
      }
    }

    setPendingCount(getOfflineQueue().length);

    if (synced > 0) {
      toast({
        title: "Sync complete",
        description: `${synced} action(s) synced successfully.`,
      });
    }
  }, [toast]);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      processQueue();
    };
    const handleOffline = () => {
      setOnline(false);
      toast({
        title: "You're offline",
        description: "Viewing cached data. Actions will sync when you're back online.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [processQueue, toast]);

  // Sync on mount if online and queue is not empty
  useEffect(() => {
    if (isOnline() && getOfflineQueue().length > 0) {
      processQueue();
    }
  }, [processQueue]);

  return { online, pendingCount };
};

async function processAction(action: QueuedAction) {
  const { table, type, payload } = action;

  switch (type) {
    case "insert": {
      const { error } = await supabase.from(table as any).insert(payload);
      if (error) throw error;
      break;
    }
    case "update": {
      const { id, ...rest } = payload;
      const { error } = await supabase
        .from(table as any)
        .update(rest)
        .eq("id", id);
      if (error) throw error;
      break;
    }
    case "delete": {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq("id", payload.id);
      if (error) throw error;
      break;
    }
  }
}
