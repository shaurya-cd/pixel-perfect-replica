import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, HelpCircle, Lightbulb, Pause, Play, ShieldAlert, ShieldHalf, Trophy } from "lucide-react";
import type { Mission } from "@/types/mission";
import { DifficultyBadge, LevelBadge } from "@/components/common/primitives";
import { currentPlayer } from "@/mock/users";

export function GameHeader({
  mission,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onOpenHints,
  onOpenSubmit,
  unlockedHintsCount,
  hintsAvailable,
}: {
  mission: Mission;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onOpenHints: () => void;
  onOpenSubmit: () => void;
  unlockedHintsCount: number;
  hintsAvailable: number;
}) {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/90 px-3 backdrop-blur sm:px-4">
      {/* Left section: Back to missions, branding & mission info */}
      <div className="flex items-center gap-3">
        <Link
          to="/missions"
          aria-label="Back to missions list"
          className="flex items-center gap-1.5 rounded-md border border-border bg-elevated/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">Missions</span>
        </Link>

        <div className="hidden h-4 w-px bg-border md:block" />

        <div className="flex items-center gap-2">
          <ShieldHalf className="size-4 text-success" />
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs font-semibold text-foreground">
              {mission.code}
            </span>
            <span className="hidden text-xs text-muted-foreground md:inline">
              — {mission.title}
            </span>
          </div>
        </div>

        <DifficultyBadge difficulty={mission.difficulty} className="hidden lg:inline-flex" />
      </div>

      {/* Right section: Timer, XP, Hints, Submit finding CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Timer */}
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground">
          <Clock className="size-3.5 text-muted-foreground" />
          <span className="tabular-nums">{timeFormatted}</span>
          <button
            type="button"
            onClick={onToggleTimer}
            aria-label={isTimerRunning ? "Pause timer" : "Resume timer"}
            className="text-muted-foreground hover:text-foreground"
          >
            {isTimerRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
          </button>
        </div>

        {/* User stats */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="font-mono text-xs text-muted-foreground">
            {currentPlayer.xp.toLocaleString()} XP
          </span>
          <LevelBadge level={currentPlayer.level} />
        </div>

        {/* Hints button */}
        <button
          type="button"
          onClick={onOpenHints}
          className="relative inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
        >
          <Lightbulb className="size-3.5 text-warning" />
          <span className="hidden sm:inline">Hints</span>
          <span className="rounded bg-elevated px-1 text-[10px] text-foreground">
            {unlockedHintsCount}/{hintsAvailable}
          </span>
        </button>

        {/* Submit Finding CTA */}
        <button
          type="button"
          onClick={onOpenSubmit}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1 font-mono text-xs font-semibold text-background transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <ShieldAlert className="size-3.5" />
          <span>Submit Finding</span>
        </button>
      </div>
    </header>
  );
}
