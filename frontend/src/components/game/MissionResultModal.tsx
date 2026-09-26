import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, LayoutDashboard, RotateCcw, Sparkles, Trophy } from "lucide-react";
import type { MissionResult } from "@/types/mission";
import { ProgressBar } from "@/components/common/primitives";

export function MissionResultModal({
  isOpen,
  result,
  onClose,
  onNextMission,
}: {
  isOpen: boolean;
  result: MissionResult | null;
  onClose: () => void;
  onNextMission?: () => void;
}) {
  if (!isOpen || !result) return null;

  const minutes = Math.floor(result.timeSeconds / 60);
  const seconds = result.timeSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
    >
      <div className="panel w-full max-w-lg border-border-strong bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top badge */}
        <div className="text-center">
          <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
            <Trophy className="size-7" />
          </div>
          <p className="mono-label mt-3 text-success">Mission Complete</p>
          <h2 id="result-modal-title" className="mt-1 text-xl font-bold tracking-tight text-foreground">
            Security Finding Identified
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{result.findingTitle}</p>
        </div>

        {/* XP Breakdown Box */}
        <div className="mt-6 rounded-lg border border-border bg-background p-4">
          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Base Objective XP</span>
              <span className="text-foreground">+{result.baseXp} XP</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Time Bonus (Speed)</span>
              <span className="text-success">+{result.timeBonus} XP</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Evidence Quality Bonus</span>
              <span className="text-info">+{result.evidenceBonus} XP</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-foreground">Total XP Awarded</span>
                <span className="text-base text-success">+{result.totalXp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="rounded-lg border border-border bg-elevated/40 p-3">
            <span className="mono-label block text-[10px]">Investigation Accuracy</span>
            <span className="mt-1 text-base font-bold text-foreground">{result.accuracy}%</span>
          </div>
          <div className="rounded-lg border border-border bg-elevated/40 p-3">
            <span className="mono-label block text-[10px]">Elapsed Time</span>
            <span className="mt-1 text-base font-bold text-foreground">{timeFormatted}</span>
          </div>
        </div>

        {/* Player Level Progression Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">Level 12 Progress</span>
            <span className="text-foreground">
              8,795 <span className="text-muted-foreground">/ 10,000 XP</span>
            </span>
          </div>
          <ProgressBar value={87.95} tone="success" />
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
          >
            Review Workspace
          </button>
          <Link
            to="/dashboard"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-elevated"
          >
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </Link>
          <Link
            to="/missions"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground px-4 py-2.5 font-mono text-xs font-semibold text-background transition-opacity hover:opacity-90"
          >
            Next Mission
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
