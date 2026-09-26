import { CheckCircle2, Info, Sparkles, TriangleAlert, X } from "lucide-react";
import type { GameNotification } from "@/types/game";

export function NotificationToast({
  notifications,
  onDismiss,
}: {
  notifications: GameNotification[];
  onDismiss: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="panel flex items-start gap-3 border-border-strong bg-elevated/95 p-3 shadow-xl backdrop-blur animate-in slide-in-from-bottom-2 fade-in"
        >
          {n.type === "xp" ? (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
              <Sparkles className="size-4" />
            </div>
          ) : n.type === "objective" ? (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-info/15 text-info">
              <CheckCircle2 className="size-4" />
            </div>
          ) : n.type === "warning" ? (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-warning/15 text-warning">
              <TriangleAlert className="size-4" />
            </div>
          ) : (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface text-muted-foreground">
              <Info className="size-4" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">{n.title}</p>
              {n.xpAmount && (
                <span className="font-mono text-[10px] font-bold text-success">
                  +{n.xpAmount} XP
                </span>
              )}
            </div>
            {n.description && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">{n.description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDismiss(n.id)}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
