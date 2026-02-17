import { WifiOff } from "lucide-react";

interface OfflineIndicatorProps {
  online: boolean;
  pendingCount: number;
}

const OfflineIndicator = ({ online, pendingCount }: OfflineIndicatorProps) => {
  if (online && pendingCount === 0) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-1.5 text-xs font-medium safe-area-top ${
      online
        ? "bg-yellow-500 text-yellow-950"
        : "bg-destructive text-destructive-foreground"
    }`}>
      {!online && <WifiOff className="w-3.5 h-3.5" />}
      {!online
        ? "You're offline — viewing cached data"
        : `Syncing ${pendingCount} queued action(s)…`}
    </div>
  );
};

export default OfflineIndicator;
