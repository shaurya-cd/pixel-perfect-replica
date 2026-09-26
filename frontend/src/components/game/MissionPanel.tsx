import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, HelpCircle, Lightbulb, ShieldAlert, Sparkles, Target } from "lucide-react";
import type { Mission, MissionObjective } from "@/types/mission";
import { DifficultyBadge, ProgressBar } from "@/components/common/primitives";

export function MissionPanel({
  mission,
  objectives,
  onToggleObjective,
  onOpenHints,
  onOpenSubmit,
  unlockedHintsCount,
}: {
  mission: Mission;
  objectives: MissionObjective[];
  onToggleObjective: (id: string) => void;
  onOpenHints: () => void;
  onOpenSubmit: () => void;
  unlockedHintsCount: number;
}) {
  const [briefingOpen, setBriefingOpen] = useState(true);
  const doneCount = objectives.filter((o) => o.done).length;
  const progressPercent = Math.round((doneCount / objectives.length) * 100);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface font-sans">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <span className="mono-label">{mission.code}</span>
          <DifficultyBadge difficulty={mission.difficulty} />
        </div>
        <h2 className="mt-1 text-base font-bold tracking-tight text-foreground">
          {mission.title}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{mission.objectiveSummary}</p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {/* Briefing Accordion */}
        <div className="rounded-lg border border-border bg-background">
          <button
            type="button"
            onClick={() => setBriefingOpen((v) => !v)}
            className="flex w-full items-center justify-between p-3 text-left font-mono text-xs font-semibold text-foreground hover:bg-elevated/40"
          >
            <span className="flex items-center gap-2">
              <Target className="size-3.5 text-info" />
              BRIEFING & CONTEXT
            </span>
            {briefingOpen ? (
              <ChevronDown className="size-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-3.5 text-muted-foreground" />
            )}
          </button>
          {briefingOpen && (
            <div className="border-t border-border p-3 text-xs leading-relaxed text-muted-foreground">
              {mission.briefing}
            </div>
          )}
        </div>

        {/* Objectives Section */}
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between">
            <span className="mono-label flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="size-3.5 text-success" />
              OBJECTIVES ({doneCount}/{objectives.length})
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{progressPercent}%</span>
          </div>

          <div className="mt-2">
            <ProgressBar value={progressPercent} tone="success" />
          </div>

          <ul className="mt-3 space-y-2">
            {objectives.map((obj) => (
              <li key={obj.id}>
                <button
                  type="button"
                  onClick={() => onToggleObjective(obj.id)}
                  className={`flex w-full items-start gap-2.5 rounded-md p-2 text-left font-mono text-xs transition-colors ${obj.done
                      ? "bg-elevated/30 text-muted-foreground"
                      : "bg-surface hover:bg-elevated hover:text-foreground"
                    }`}
                >
                  <span
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${obj.done
                        ? "border-success bg-success/20 text-success"
                        : "border-border-strong bg-background"
                      }`}
                  >
                    {obj.done ? "✓" : ""}
                  </span>
                  <span className={obj.done ? "line-through opacity-75" : "text-foreground"}>
                    {obj.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Hints Card */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-warning" />
            <div>
              <p className="font-mono text-xs font-semibold text-foreground">Investigation Hints</p>
              <p className="text-[11px] text-muted-foreground">
                {unlockedHintsCount} / {mission.hintsAvailable} unlocked
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenHints}
            className="rounded border border-border bg-elevated px-2.5 py-1 font-mono text-xs text-foreground transition-colors hover:bg-muted"
          >
            View Hints
          </button>
        </div>

        {/* Rewards Card */}
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between">
            <span className="mono-label text-xs">Mission Bounty</span>
            <span className="font-mono text-xs font-semibold text-success">+{mission.xpReward} XP</span>
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>Speed Bonus available</span>
            <span>+45 XP</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={onOpenSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-mono text-xs font-semibold text-background transition-opacity hover:opacity-90 active:scale-[0.99]"
        >
          <ShieldAlert className="size-4" />
          Submit Finding
        </button>
      </div>
    </div>
  );
}
