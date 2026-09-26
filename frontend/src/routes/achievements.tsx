import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Award, Lock, Sparkles, Trophy, Unlock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AchievementCard } from "@/components/common/AchievementCard";
import { ProgressBar } from "@/components/common/primitives";
import { achievements } from "@/mock/achievements";
import type { Achievement } from "@/types/user";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [rarityFilter, setRarityFilter] = useState<string>("all");

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (filter === "unlocked" && !a.unlocked) return false;
      if (filter === "locked" && a.unlocked) return false;
      if (rarityFilter !== "all" && a.rarity !== rarityFilter) return false;
      return true;
    });
  }, [filter, rarityFilter]);

  return (
    <AppShell
      title="Achievement Hall"
      description="Unlock cybersecurity credentials and operational badges by solving specialized investigation challenges."
    >
      <div className="space-y-8">
        {/* Progress Summary Banner */}
        <div className="panel p-6">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            <div className="space-y-2 md:col-span-8">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Trophy className="size-4 text-warning" />
                <span>CAREER MILESTONES</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {unlockedCount} of {totalCount} Badges Unlocked ({progressPercent}%)
              </h2>
              <p className="text-xs text-muted-foreground">
                You have earned +1,250 XP bonus from completed achievement challenges.
              </p>
              <div className="pt-2">
                <ProgressBar value={progressPercent} tone="success" />
              </div>
            </div>

            <div className="flex justify-start md:justify-end md:col-span-4">
              <div className="rounded-lg border border-border bg-background p-4 text-center font-mono text-xs">
                <span className="mono-label block text-[10px]">Rarest Badge Unlocked</span>
                <span className="mt-1 block text-sm font-bold text-success">
                  Detective (Top 5%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1 font-mono text-xs">
            {[
              { id: "all", label: `All (${totalCount})` },
              { id: "unlocked", label: `Unlocked (${unlockedCount})` },
              { id: "locked", label: `In Progress / Locked (${totalCount - unlockedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id as typeof filter)}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  filter === f.id
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Rarity selector */}
          <div className="flex items-center gap-2">
            <span className="mono-label text-[11px]">Rarity:</span>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground focus-visible:outline-none"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
