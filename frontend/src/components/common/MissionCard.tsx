import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { DifficultyBadge, ProgressBar } from "@/components/common/primitives";
import { cn } from "@/lib/utils";
import type { Mission } from "@/types/mission";

export function MissionCard({ mission }: { mission: Mission }) {
  const locked = Boolean(mission.locked);
  const cta = mission.completed ? "Replay" : mission.progress > 0 ? "Continue" : "Start";

  const body = (
    <div
      className={cn(
        "panel group flex h-full flex-col gap-4 p-5 transition-colors",
        locked ? "opacity-55" : "hover:border-border-strong",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono-label">{mission.category}</p>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-foreground">
            {mission.title}
          </h3>
        </div>
        {locked ? (
          <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : mission.completed ? (
          <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
        ) : null}
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{mission.description}</p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <DifficultyBadge difficulty={mission.difficulty} />
          <span className="font-mono text-xs text-foreground">{mission.xpReward} XP</span>
        </div>

        <div className="space-y-1.5">
          <ProgressBar
            value={mission.progress}
            tone={mission.completed ? "success" : "default"}
          />
          <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>{mission.progress}% complete</span>
            <span>~{mission.estimatedMinutes} min</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {locked ? (
            <span className="text-muted-foreground">Reach Level 14 to unlock</span>
          ) : (
            <>
              {cta}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (locked) {
    return (
      <div aria-disabled className="h-full">
        {body}
      </div>
    );
  }

  return (
    <Link
      to="/play/$missionId"
      params={{ missionId: mission.id }}
      className="h-full rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      aria-label={`${cta} mission: ${mission.title}`}
    >
      {body}
    </Link>
  );
}
