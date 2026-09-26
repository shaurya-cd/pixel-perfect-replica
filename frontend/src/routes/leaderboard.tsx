import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Crown, Flame, Medal, Search, Trophy, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LevelBadge } from "@/components/common/primitives";
import { leaderboards } from "@/mock/leaderboard";
import type { LeaderboardScope } from "@/types/user";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

const TABS: Array<{ id: LeaderboardScope; label: string }> = [
  { id: "global", label: "Global All-Time" },
  { id: "weekly", label: "Weekly League" },
  { id: "monthly", label: "Monthly Season" },
  { id: "friends", label: "Friends & Squad" },
];

function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [search, setSearch] = useState("");

  const currentList = useMemo(() => {
    const list = leaderboards[scope] ?? [];
    if (!search.trim()) return list;
    return list.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));
  }, [scope, search]);

  const [first, second, third] = currentList;

  return (
    <AppShell
      title="Investigator Leaderboards"
      description="Compete with top cybersecurity analysts worldwide. Climb the ranks by identifying vulnerabilities accurately."
    >
      <div className="space-y-8">
        {/* Scope Tabs & Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setScope(tab.id)}
                className={`rounded-md px-3.5 py-1.5 font-mono text-xs transition-colors ${scope === tab.id
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search investigator..."
              className="w-full rounded-md border border-border bg-surface py-1.5 pr-3 pl-8 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Top 3 Podium (when not filtered by search) */}
        {!search && first && second && third && (
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Rank 2 */}
            <div className="panel order-2 sm:order-1 flex flex-col items-center p-6 text-center border-border-strong bg-elevated/20">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground">
                <Medal className="size-6 text-muted-foreground" />
              </div>
              <span className="mono-label mt-3 text-xs">#2 SECOND PLACE</span>
              <h3 className="mt-1 text-base font-bold text-foreground">{second.username}</h3>
              <div className="mt-2 flex items-center gap-2">
                <LevelBadge level={second.level ?? 1} />
                <span className="font-mono text-xs text-foreground font-semibold">
                  {second.xp.toLocaleString()} XP
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {second.missions} operations cleared
              </p>
            </div>

            {/* Rank 1 (Center Champion) */}
            <div className="panel order-1 sm:order-2 flex flex-col items-center p-6 text-center border-warning/40 bg-surface shadow-lg">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-warning/50 bg-warning/10 text-warning">
                <Crown className="size-7" />
              </div>
              <span className="mono-label mt-3 text-xs text-warning">#1 DIVISION CHAMPION</span>
              <h3 className="mt-1 text-lg font-bold text-foreground">{first.username}</h3>
              <div className="mt-2 flex items-center gap-2">
                <LevelBadge level={first.level ?? 1} />
                <span className="font-mono text-sm text-foreground font-bold">
                  {first.xp.toLocaleString()} XP
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {first.missions} operations cleared
              </p>
            </div>

            {/* Rank 3 */}
            <div className="panel order-3 sm:order-3 flex flex-col items-center p-6 text-center border-border-strong bg-elevated/20">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground">
                <Trophy className="size-6 text-muted-foreground" />
              </div>
              <span className="mono-label mt-3 text-xs">#3 THIRD PLACE</span>
              <h3 className="mt-1 text-base font-bold text-foreground">{third.username}</h3>
              <div className="mt-2 flex items-center gap-2">
                <LevelBadge level={third.level ?? 1} />
                <span className="font-mono text-xs text-foreground font-semibold">
                  {third.xp.toLocaleString()} XP
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {third.missions} operations cleared
              </p>
            </div>
          </div>
        )}

        {/* Full Standings Table */}
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="mono-label text-xs">OFFICIAL STANDINGS</span>
            <span className="font-mono text-xs text-muted-foreground">
              Season resets in 2d 14h
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-border bg-surface text-[11px] text-muted-foreground">
                <tr>
                  <th className="w-16 px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Investigator</th>
                  <th className="px-4 py-3">Rank Level</th>
                  <th className="px-4 py-3">Missions Solved</th>
                  <th className="px-4 py-3 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentList.map((entry) => {
                  return (
                    <tr
                      key={entry.username}
                      className={
                        entry.isCurrentPlayer
                          ? "bg-elevated/90 font-semibold border-l-2 border-success"
                          : "hover:bg-elevated/40"
                      }
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex size-6 items-center justify-center rounded font-bold ${entry.rank === 1
                            ? "bg-warning/20 text-warning"
                            : entry.rank === 2
                              ? "bg-muted text-foreground"
                              : entry.rank === 3
                                ? "bg-muted text-muted-foreground"
                                : "text-muted-foreground"
                            }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{entry.username}</span>
                          {entry.isCurrentPlayer && (
                            <span className="rounded bg-success/20 px-1.5 py-0.5 text-[10px] text-success">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <LevelBadge level={entry.level} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.missions}</td>
                      <td className="px-4 py-3 text-right text-success font-bold">
                        {entry.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
