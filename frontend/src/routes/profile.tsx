import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  KeyRound,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LevelBadge, ProgressBar, SeverityTag, StatCard, XPBar } from "@/components/common/primitives";
import { AchievementCard } from "@/components/common/AchievementCard";
import { currentPlayer, missionHistory, weeklyActivity } from "@/mock/users";
import { achievements } from "@/mock/achievements";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const SKILL_AREAS = [
  { name: "Secrets & Credentials", score: 95, color: "text-warning" },
  { name: "Filesystem & Hierarchy", score: 90, color: "text-info" },
  { name: "Permissions & Chmod", score: 85, color: "text-success" },
  { name: "Log Forensics", score: 78, color: "text-foreground" },
  { name: "Privilege Escalation", score: 70, color: "text-destructive" },
];

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "history" | "statistics">("overview");

  return (
    <AppShell
      title="Investigator Profile"
      description="Review career statistics, unlocked badges, and historical security investigation logs."
    >
      <div className="space-y-8">
        {/* Profile Identity Hero */}
        <div className="panel p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-border-strong bg-elevated font-mono text-2xl font-bold text-foreground">
                {currentPlayer.username.slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {currentPlayer.username}
                  </h1>
                  <LevelBadge level={currentPlayer.level} />
                </div>
                <p className="text-xs text-muted-foreground">{currentPlayer.title}</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    Member since {currentPlayer.joinedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-warning">
                    <Flame className="size-3" />
                    {currentPlayer.stats.streakDays} Day Active Streak
                  </span>
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="w-full md:w-80">
              <XPBar xp={currentPlayer.xp} xpToNextLevel={currentPlayer.xpToNextLevel} />
            </div>
          </div>

          {/* Quick Stats Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-6 font-mono text-xs">
            <div className="p-2 text-center">
              <span className="mono-label block text-[10px]">Missions Completed</span>
              <span className="mt-1 text-2xl font-bold text-foreground">
                {currentPlayer.stats.missionsCompleted}
              </span>
            </div>
            <div className="p-2 text-center">
              <span className="mono-label block text-[10px]">Vulnerabilities Found</span>
              <span className="mt-1 text-2xl font-bold text-warning">
                {currentPlayer.stats.vulnerabilitiesFound}
              </span>
            </div>
            <div className="p-2 text-center">
              <span className="mono-label block text-[10px]">Audit Accuracy</span>
              <span className="mt-1 text-2xl font-bold text-success">
                {currentPlayer.stats.accuracy}%
              </span>
            </div>
            <div className="p-2 text-center">
              <span className="mono-label block text-[10px]">Global Rank</span>
              <span className="mt-1 text-2xl font-bold text-foreground">#4</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border font-mono text-xs">
          {[
            { id: "overview", label: "Overview" },
            { id: "achievements", label: `Achievements (${achievements.filter((a) => a.unlocked).length})` },
            { id: "history", label: `Mission History (${missionHistory.length})` },
            { id: "statistics", label: "Statistics & Radar" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Skill Proficiency */}
            <div className="panel space-y-4 p-6 lg:col-span-7">
              <div>
                <span className="mono-label">DOMAIN MASTERY</span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  Security Specialization Matrix
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Proficiency derived from completed missions and evidence accuracy.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {SKILL_AREAS.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-foreground">{skill.name}</span>
                      <span className={skill.color}>{skill.score}%</span>
                    </div>
                    <ProgressBar value={skill.score} tone="default" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Recent Badges */}
            <div className="panel space-y-4 p-6 lg:col-span-5">
              <div>
                <span className="mono-label">BADGE HIGHLIGHTS</span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">Top Accolades</h3>
              </div>

              <div className="space-y-3">
                {achievements
                  .filter((a) => a.unlocked)
                  .slice(0, 3)
                  .map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-elevated text-success">
                        <Award className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs font-semibold text-foreground truncate">
                          {badge.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {badge.description}
                        </p>
                      </div>
                      <span className="mono-label text-[10px] text-success">Unlocked</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Achievements Gallery */}
        {activeTab === "achievements" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {achievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        )}

        {/* Tab 3: Mission History */}
        {activeTab === "history" && (
          <div className="panel overflow-hidden">
            <div className="border-b border-border p-4">
              <h3 className="text-sm font-semibold text-foreground">Completed Operations</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Historical log of all verified findings</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-border bg-surface text-[11px] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Mission Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Accuracy</th>
                    <th className="px-4 py-3 text-right">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {missionHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-elevated/40">
                      <td className="px-4 py-3 text-muted-foreground">{item.completedAt}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{item.missionTitle}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3 text-success">{item.accuracy}%</td>
                      <td className="px-4 py-3 text-right text-success">+{item.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Detailed Statistics */}
        {activeTab === "statistics" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="panel p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Vulnerability Types Discovered</h3>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: "Exposed Credentials / .env", count: 48, pct: 39 },
                  { name: "Insecure Permissions (777)", count: 34, pct: 28 },
                  { name: "Privilege Escalation Rules", count: 21, pct: 17 },
                  { name: "Stale Database Backups", count: 20, pct: 16 },
                ].map((v) => (
                  <div key={v.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-foreground">{v.name}</span>
                      <span className="text-muted-foreground">{v.count} ({v.pct}%)</span>
                    </div>
                    <ProgressBar value={v.pct} tone="default" />
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Performance Benchmarks</h3>
              <div className="space-y-3 font-mono text-xs text-muted-foreground">
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Average Mission Completion Time:</span>
                  <strong className="text-foreground">08m 14s</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Average Files Inspected per Finding:</span>
                  <strong className="text-foreground">14.2 files</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>First-Attempt Finding Accuracy:</span>
                  <strong className="text-success">91.4%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hints Utilized per Mission:</span>
                  <strong className="text-foreground">0.4 / 3.0</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
