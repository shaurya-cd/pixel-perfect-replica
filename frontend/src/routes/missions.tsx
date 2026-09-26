import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Search, Shield, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MissionCard } from "@/components/common/MissionCard";
import { missions } from "@/mock/missions";
import type { Difficulty, MissionCategory } from "@/types/mission";

export const Route = createFileRoute("/missions")({
  component: MissionsPage,
});

const DIFFICULTIES: Array<{ id: Difficulty; label: string }> = [
  { id: "easy", label: "Beginner" },
  { id: "medium", label: "Intermediate" },
  { id: "hard", label: "Advanced" },
  { id: "expert", label: "Expert" },
];

const CATEGORIES: MissionCategory[] = [
  "Filesystem",
  "Permissions",
  "Secrets",
  "Forensics",
  "Configuration",
  "Privilege Escalation",
];

function MissionsPage() {
  const [search, setSearch] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<MissionCategory>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "in_progress" | "completed" | "locked">("all");
  const [sortBy, setSortBy] = useState<"default" | "xp" | "difficulty">("default");

  const toggleDifficulty = (diff: Difficulty) => {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(diff)) next.delete(diff);
      else next.add(diff);
      return next;
    });
  };

  const toggleCategory = (cat: MissionCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedDifficulties(new Set());
    setSelectedCategories(new Set());
    setStatusFilter("all");
    setSearch("");
  };

  const filteredMissions = useMemo(() => {
    return missions
      .filter((m) => {
        if (search) {
          const q = search.toLowerCase();
          const match =
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q);
          if (!match) return false;
        }

        if (selectedDifficulties.size > 0 && !selectedDifficulties.has(m.difficulty)) {
          return false;
        }

        if (selectedCategories.size > 0 && !selectedCategories.has(m.category)) {
          return false;
        }

        if (statusFilter === "in_progress" && (m.progress === 0 || m.completed || m.locked)) {
          return false;
        }
        if (statusFilter === "completed" && !m.completed) {
          return false;
        }
        if (statusFilter === "locked" && !m.locked) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "xp") return b.xpReward - a.xpReward;
        if (sortBy === "difficulty") {
          const order = { easy: 1, medium: 2, hard: 3, expert: 4 };
          return order[b.difficulty] - order[a.difficulty];
        }
        return 0;
      });
  }, [search, selectedDifficulties, selectedCategories, statusFilter, sortBy]);

  const activeFilterCount =
    selectedDifficulties.size +
    selectedCategories.size +
    (statusFilter !== "all" ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <AppShell
      title="Mission Operations"
      description="Select an investigation target to explore filesystems, find vulnerabilities, and submit findings."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Sidebar Filters */}
        <aside className="space-y-6 lg:col-span-3">
          <div className="panel space-y-6 p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="mono-label flex items-center gap-1.5 text-xs text-foreground">
                <Filter className="size-3.5 text-info" />
                FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search filter */}
            <div>
              <label htmlFor="mission-search" className="mono-label block text-[11px]">
                Search Missions
              </label>
              <div className="relative mt-1.5">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="mission-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full rounded-md border border-border bg-background py-1.5 pr-2 pl-8 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mono-label block text-[11px]">Mission Status</label>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {[
                  { id: "all", label: "All" },
                  { id: "in_progress", label: "Active" },
                  { id: "completed", label: "Done" },
                  { id: "locked", label: "Locked" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatusFilter(s.id as typeof statusFilter)}
                    className={`rounded px-2 py-1 font-mono text-[11px] transition-colors ${
                      statusFilter === s.id
                        ? "bg-foreground text-background font-semibold"
                        : "bg-surface text-muted-foreground hover:bg-elevated hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="mono-label block text-[11px]">Difficulty</label>
              <div className="mt-2 space-y-1.5">
                {DIFFICULTIES.map((diff) => {
                  const checked = selectedDifficulties.has(diff.id);
                  return (
                    <label
                      key={diff.id}
                      className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDifficulty(diff.id)}
                        className="rounded border-border bg-background text-foreground focus:ring-ring"
                      />
                      <span>{diff.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mono-label block text-[11px]">Category</label>
              <div className="mt-2 space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const checked = selectedCategories.has(cat);
                  return (
                    <label
                      key={cat}
                      className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat)}
                        className="rounded border-border bg-background text-foreground focus:ring-ring"
                      />
                      <span>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Mission Grid */}
        <div className="space-y-4 lg:col-span-9">
          {/* Top Sort and Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <span className="font-mono text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredMissions.length}</strong> missions
            </span>

            <div className="flex items-center gap-2">
              <span className="mono-label text-[11px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground focus-visible:outline-none"
              >
                <option value="default">Default Order</option>
                <option value="xp">Highest XP Reward</option>
                <option value="difficulty">Difficulty Rating</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>

          {filteredMissions.length === 0 && (
            <div className="panel grid-field p-12 text-center">
              <Shield className="mx-auto size-8 text-muted-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">No Missions Matched</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try loosening your filters or clearing search criteria.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-md border border-border bg-elevated px-3 py-1.5 font-mono text-xs text-foreground hover:bg-muted"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
