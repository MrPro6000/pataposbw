/**
 * Offline-friendly cache layer.
 * - Caches last-known data in localStorage for offline viewing
 * - Queues write actions when offline, auto-syncs when back online
 * - Read operations always return cached data instantly, then refresh from network
 */

const CACHE_PREFIX = "pata_cache_";
const QUEUE_KEY = "pata_offline_queue";

export interface QueuedAction {
  id: string;
  table: string;
  type: "insert" | "update" | "delete";
  payload: Record<string, any>;
  createdAt: string;
}

// ── Cache Read/Write ──

export function getCachedData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    return data as T;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch (e) {
    // Storage full — silently fail
    console.warn("Cache write failed:", e);
  }
}

export function getCacheTimestamp(key: string): number | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw).timestamp;
  } catch {
    return null;
  }
}

// ── Offline Action Queue ──

export function getOfflineQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(action: Omit<QueuedAction, "id" | "createdAt">): void {
  const queue = getOfflineQueue();
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function removeFromQueue(id: string): void {
  const queue = getOfflineQueue().filter((a) => a.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

// ── Online Status ──

export function isOnline(): boolean {
  return navigator.onLine;
}

// ── Auto-sync listener ──
let syncInProgress = false;
let syncCallback: (() => Promise<void>) | null = null;

export function registerSyncCallback(cb: () => Promise<void>): () => void {
  syncCallback = cb;

  const handleOnline = async () => {
    if (syncInProgress || !syncCallback) return;
    syncInProgress = true;
    try {
      await syncCallback();
    } catch (e) {
      console.error("Auto-sync failed:", e);
    } finally {
      syncInProgress = false;
    }
  };

  window.addEventListener("online", handleOnline);
  return () => window.removeEventListener("online", handleOnline);
}
