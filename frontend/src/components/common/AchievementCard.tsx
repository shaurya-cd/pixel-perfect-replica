import * as Icons from "lucide-react";
import { ProgressBar } from "@/components/common/primitives";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types/user";

const rarityClass: Record<Achievement["rarity"], string> = {
  common: "text-muted-foreground",
  rare: "text-info",
  epic: "text-warning",
  legendary: "text-success",
};

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[achievement.icon] ?? Icons.Award;

  return (
    <div
      className={cn(
        "panel flex flex-col items-center gap-3 p-5 text-center transition-colors",
        achievement.unlocked ? "hover:border-border-strong" : "opacity-60",
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-lg border",
          achievement.unlocked
            ? "border-border-strong bg-elevated"
            : "border-dashed border-border bg-transparent",
        )}
      >
        {achievement.unlocked ? (
          <Icon className={cn("size-5", rarityClass[achievement.rarity])} aria-hidden />
        ) : (
          <Icons.Lock className="size-5 text-muted-foreground" aria-hidden />
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">{achievement.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
      </div>

      {achievement.unlocked ? (
        <span className="mono-label text-success">Unlocked</span>
      ) : (
        <div className="w-full space-y-1.5">
          <ProgressBar value={((achievement.progress ?? 0) / (achievement.goal ?? 1)) * 100} />
          <span className="mono-label">
            {achievement.progress ?? 0} / {achievement.goal ?? 1}
          </span>
        </div>
      )}
    </div>
  );
}
