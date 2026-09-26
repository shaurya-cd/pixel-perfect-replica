import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  FolderSearch,
  KeyRound,
  Play,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DifficultyBadge, LevelBadge, ProgressBar, StatCard, XPBar } from "@/components/common/primitives";
import { MissionCard } from "@/components/common/MissionCard";
import { AchievementCard } from "@/components/common/AchievementCard";
import { currentPlayer, weeklyActivity } from "@/mock/users";
import { missions } from "@/mock/missions";
import { achievements } from "@/mock/achievements";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const activeMission = missions.find((m) => m.id === "m14") ?? missions[0]!;
  const recommendedMissions = missions.filter((m) => m.id !== "m14" && !m.locked).slice(0, 3);
  const recentAchievements = achievements.filter((a) => a.unlocked).slice(0, 3);

  const maxWeeklyXp = Math.max(...weeklyActivity.map((w) => w.xp));

  return (
    <AppShell
      title={`Welcome back, ${currentPlayer.username}`}
      description="Track your investigation progress, continue active security audits, and earn XP bounties."
      actions={
        <Link
          to="/play/$missionId"
          params={{ missionId: activeMission.id }}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-mono text-xs font-semibold text-background uppercase transition-opacity hover:opacity-90"
        >
          <Play className="size-3.5 fill-current" />
          Resume Investigation
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Player Level & Overview Banner */}
        <div className="panel relative overflow-hidden p-6">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            {/* Player details */}
            <div className="space-y-3 md:col-span-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-border-strong bg-elevated font-mono text-lg font-bold text-foreground">
                  {currentPlayer.username.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {currentPlayer.username}
                    </h2>
                    <LevelBadge level={currentPlayer.level} />
                  </div>
                  <p className="text-xs text-muted-foreground">{currentPlayer.title}</p>
                </div>
              </div>

              <div className="pt-2">
                <XPBar xp={currentPlayer.xp} xpToNextLevel={currentPlayer.xpToNextLevel} />
              </div>
            </div>

            {/* Quick stats mini-row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-6">
              <div className="rounded-lg border border-border bg-background/60 p-3 text-center">
                <span className="mono-label block text-[10px]">Missions</span>
                <span className="font-mono text-xl font-bold text-foreground">
                  {currentPlayer.stats.missionsCompleted}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3 text-center">
                <span className="mono-label block text-[10px]">Vulns Found</span>
                <span className="font-mono text-xl font-bold text-warning">
                  {currentPlayer.stats.vulnerabilitiesFound}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3 text-center">
                <span className="mono-label block text-[10px]">Accuracy</span>
                <span className="font-mono text-xl font-bold text-success">
                  {currentPlayer.stats.accuracy}%
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3 text-center">
                <span className="mono-label block text-[10px]">Streak</span>
                <span className="font-mono text-xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Flame className="size-4 text-warning" />
                  {currentPlayer.stats.streakDays}d
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Card: Continue Active Investigation */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="panel border-border-strong bg-elevated/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <span className="mono-label text-success">ACTIVE INVESTIGATION</span>
                  <h3 className="mt-1 text-lg font-bold text-foreground">
                    {activeMission.code} — {activeMission.title}
                  </h3>
                </div>
                <DifficultyBadge difficulty={activeMission.difficulty} />
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {activeMission.briefing}
              </p>

              {/* Progress bar and metrics */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Investigation Progress</span>
                  <span className="font-semibold text-foreground">{activeMission.progress}%</span>
                </div>
                <ProgressBar value={activeMission.progress} tone="default" />
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                  <span>Bounty: <strong className="text-foreground">{activeMission.xpReward} XP</strong></span>
                  <span>•</span>
                  <span>Est: <strong className="text-foreground">{activeMission.estimatedMinutes} mins</strong></span>
                </div>

                <Link
                  to="/play/$missionId"
                  params={{ missionId: activeMission.id }}
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 font-mono text-xs font-semibold text-background uppercase transition-opacity hover:opacity-90"
                >
                  Continue Investigation
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Weekly XP Activity Chart */}
          <div className="lg:col-span-4">
            <div className="panel flex h-full flex-col justify-between p-6">
              <div>
                <span className="mono-label">WEEKLY ACTIVITY</span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  XP Earned This Week
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  3,030 XP accumulated across 9 investigations
                </p>
              </div>

              {/* Bar chart */}
              <div className="mt-6 flex items-end justify-between gap-2 pt-4">
                {weeklyActivity.map((item) => {
                  const heightPercent = Math.max(15, (item.xp / maxWeeklyXp) * 100);
                  return (
                    <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t bg-foreground/80 hover:bg-success transition-colors"
                        style={{ height: `${heightPercent}px` }}
                        title={`${item.day}: ${item.xp} XP`}
                      />
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-xs text-muted-foreground">
                <span>Total weekly rank:</span>
                <span className="font-bold text-success">#1 in Weekly Division</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Missions Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Recommended Missions</h3>
              <p className="text-xs text-muted-foreground">Tailored to your current Level 12 investigator rank</p>
            </div>
            <Link to="/missions" className="text-xs text-muted-foreground hover:text-foreground">
              View all ({missions.length}) →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Recent Achievements</h3>
              <p className="text-xs text-muted-foreground">Milestones unlocked during recent operations</p>
            </div>
            <Link to="/achievements" className="text-xs text-muted-foreground hover:text-foreground">
              View all ({achievements.length}) →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {recentAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
