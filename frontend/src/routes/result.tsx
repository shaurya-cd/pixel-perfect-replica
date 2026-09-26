import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileCode,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Terminal,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/common/primitives";
import { currentPlayer } from "@/mock/users";

export const Route = createFileRoute("/result")({
  component: MissionResultPage,
});

function MissionResultPage() {
  const result = {
    missionCode: "MISSION 14",
    missionTitle: "The Exposed Database",
    vulnerability: "Exposed Database Credentials",
    affectedPath: "/Finance/config/database.env",
    baseXp: 250,
    timeBonus: 45,
    evidenceBonus: 50,
    totalXp: 345,
    accuracy: 94,
    timeSeconds: 402, // 06:42
    filesInspected: 12,
    commandsRun: 24,
  };

  const minutes = Math.floor(result.timeSeconds / 60);
  const seconds = result.timeSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-6">
        {/* Main Result Card */}
        <div className="panel border-border-strong bg-surface p-8 shadow-2xl">
          {/* Top trophy header */}
          <div className="text-center">
            <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
              <Trophy className="size-8" />
            </div>
            <p className="mono-label mt-4 text-success">INVESTIGATION DEBRIEF</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Mission Complete
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Security finding verified and submitted to ACME Corp incident log.
            </p>
          </div>

          {/* Finding summary box */}
          <div className="mt-8 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <ShieldAlert className="size-4 text-destructive" />
              <span>CONFIRMED VULNERABILITY</span>
            </div>
            <h2 className="mt-1 text-base font-bold text-foreground">
              {result.vulnerability}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground break-all">
              {result.affectedPath}
            </p>
          </div>

          {/* XP Breakdown Grid */}
          <div className="mt-6 rounded-lg border border-border bg-background p-5 font-mono text-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Base Objective XP</span>
                <span className="text-foreground">+{result.baseXp} XP</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Speed / Time Bonus (&lt; 10 min)</span>
                <span className="text-success">+{result.timeBonus} XP</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Evidence Quality Assessment</span>
                <span className="text-info">+{result.evidenceBonus} XP</span>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-foreground">Total XP Earned</span>
                  <span className="text-lg text-success">+{result.totalXp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
            <div className="rounded-lg border border-border bg-elevated/40 p-3 text-center">
              <span className="mono-label block text-[10px]">Accuracy</span>
              <span className="mt-1 block text-lg font-bold text-success">{result.accuracy}%</span>
            </div>
            <div className="rounded-lg border border-border bg-elevated/40 p-3 text-center">
              <span className="mono-label block text-[10px]">Duration</span>
              <span className="mt-1 block text-lg font-bold text-foreground">{timeFormatted}</span>
            </div>
            <div className="rounded-lg border border-border bg-elevated/40 p-3 text-center">
              <span className="mono-label block text-[10px]">Files Viewed</span>
              <span className="mt-1 block text-lg font-bold text-foreground">{result.filesInspected}</span>
            </div>
            <div className="rounded-lg border border-border bg-elevated/40 p-3 text-center">
              <span className="mono-label block text-[10px]">Shell Cmds</span>
              <span className="mt-1 block text-lg font-bold text-foreground">{result.commandsRun}</span>
            </div>
          </div>

          {/* Player Progress Level Up */}
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">Level 12 Investigator Rank</span>
              <span className="text-foreground">
                8,795 <span className="text-muted-foreground">/ 10,000 XP (87%)</span>
              </span>
            </div>
            <ProgressBar value={87.95} tone="success" />
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface py-3 text-xs font-semibold text-foreground transition-colors hover:bg-elevated"
            >
              <LayoutDashboard className="size-4" />
              Return to Dashboard
            </Link>

            <Link
              to="/play/$missionId"
              params={{ missionId: "m15" }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-foreground py-3 font-mono text-xs font-bold text-background uppercase transition-opacity hover:opacity-90"
            >
              Next Mission (M15)
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
