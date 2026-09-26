import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Database,
  FileCode,
  FileKey,
  FolderTree,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Topbar } from "@/components/layout/AppShell";
import { DifficultyBadge, LevelBadge } from "@/components/common/primitives";
import { currentPlayer } from "@/mock/users";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const GAME_STEPS = [
  {
    step: "01",
    title: "Explore",
    desc: "Traverse real-world Linux directory structures, shared network drives, and deployment configs.",
    icon: FolderTree,
  },
  {
    step: "02",
    title: "Investigate",
    desc: "Inspect file contents, review permission bitmasks (chmod), and correlate timeline access logs.",
    icon: Search,
  },
  {
    step: "03",
    title: "Discover",
    desc: "Spot exposed production credentials, world-writable directories, sudo misconfigurations, and stale dumps.",
    icon: ShieldAlert,
  },
  {
    step: "04",
    title: "Submit Evidence",
    desc: "Document findings, classify vulnerability severity (CVSS), and cite proof from the filesystem.",
    icon: FileCode,
  },
  {
    step: "05",
    title: "Earn XP & Rank",
    desc: "Gain XP, unlock cybersecurity badges, progress from Lvl 1 Rookie to Lvl 50 Security Architect.",
    icon: Trophy,
  },
];

const FEATURES = [
  {
    icon: FolderTree,
    title: "Virtual Filesystems",
    desc: "Interact with comprehensive UNIX-style enterprise filesystems containing hidden dotfiles, configs, logs, and backups.",
  },
  {
    icon: ShieldCheck,
    title: "Security Investigations",
    desc: "Analyze real vulnerability patterns based on actual CVEs, OWASP Top 10, and real incident postmortems.",
  },
  {
    icon: Terminal,
    title: "Simulated Shell",
    desc: "Use familiar commands (ls, cat, grep, pwd, cd, find) inside an embedded cybersecurity terminal simulator.",
  },
  {
    icon: Zap,
    title: "XP & Achievements",
    desc: "Earn XP bounties, speed bonuses, and evidence multipliers while unlocking 30+ achievement badges.",
  },
  {
    icon: Trophy,
    title: "Global Leaderboards",
    desc: "Compete with security engineers worldwide across Weekly, Monthly, and All-Time investigation ladders.",
  },
  {
    icon: Shield,
    title: "Progressive Difficulty",
    desc: "Scale from Beginner permission audits to Expert multi-stage privilege escalation forensics.",
  },
];

const PREVIEW_NODES = [
  {
    id: "finance",
    name: "Finance/",
    type: "dir",
    details: "drwxr-x---  finance  finance",
    desc: "Contains reports, invoices, backups, and staging config files.",
  },
  {
    id: "db_env",
    name: "  └─ config/database.env",
    type: "file",
    details: "-rw-r--r--  devops   staff (421 B)",
    desc: "⚠️ DB_HOST=db01.internal, DB_USER=admin, DB_PASSWORD=••••••••••",
    highlight: true,
  },
  {
    id: "hr",
    name: "HR/payroll/",
    type: "dir",
    details: "drwxrwxrwx  hr       hr",
    desc: "⚠️ World-writable directory with sensitive compensation records.",
    highlight: true,
  },
  {
    id: "devops",
    name: "DevOps/deploy/docker-compose.yml",
    type: "file",
    details: "-rw-r--r--  devops   devops",
    desc: "DEBUG=true, ADMIN_ENDPOINT_PUBLIC=true in production environment.",
  },
  {
    id: "ssh",
    name: "DevOps/.ssh_backup/id_rsa",
    type: "file",
    details: "-rw-r--r--  devops   devops (hidden)",
    desc: "⚠️ Unencrypted SSH private key left behind on share.",
    highlight: true,
  },
];

function LandingPage() {
  const [selectedPreview, setSelectedPreview] = useState(PREVIEW_NODES[1]!);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-success/30">
      <Topbar />

      {/* Hero Section */}
      <section className="grid-field relative overflow-hidden border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-success animate-pulse" />
                <span>CyberFS v2.4 — Live Investigation Platform</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                  Think Like an <br className="hidden sm:inline" />
                  <span className="text-success">Attacker.</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                  Explore virtual company filesystems, investigate hidden assets, discover critical vulnerabilities, and level up your cybersecurity skills.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/play/$missionId"
                  params={{ missionId: "m14" }}
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 font-mono text-xs font-semibold tracking-wider text-background uppercase transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  Start Investigation
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/missions"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 font-mono text-xs font-semibold tracking-wider text-foreground uppercase transition-colors hover:bg-elevated"
                >
                  Explore Missions
                </Link>
              </div>

              {/* Player snapshot pill */}
              <div className="flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="size-4 text-success" />
                  <span>No installations needed</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Terminal className="size-4 text-info" />
                  <span>Browser-based shell</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="size-4 text-warning" />
                  <span>Gamified XP & Rank</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Virtual Filesystem Showcase */}
            <div className="lg:col-span-5">
              <div className="panel border-border-strong bg-surface shadow-2xl overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-destructive/60" />
                    <span className="size-2.5 rounded-full bg-warning/60" />
                    <span className="size-2.5 rounded-full bg-success/60" />
                    <span className="ml-2 text-foreground">acme-corp-share (Target Host)</span>
                  </div>
                  <span className="text-[11px]">SSH : 22</span>
                </div>

                {/* Tree visualizer */}
                <div className="p-4">
                  <div className="font-mono text-xs text-muted-foreground mb-2">
                    ACME CORPORATION FILESYSTEM
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {PREVIEW_NODES.map((node) => {
                      const isSelected = selectedPreview.id === node.id;
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setSelectedPreview(node)}
                          className={`flex w-full items-center justify-between rounded p-2 text-left transition-colors ${isSelected
                              ? "bg-elevated text-foreground"
                              : "text-muted-foreground hover:bg-elevated/50 hover:text-foreground"
                            }`}
                        >
                          <span className={node.highlight ? "text-warning font-semibold" : ""}>
                            {node.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{node.details}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Preview Box */}
                  <div className="mt-4 rounded-md border border-border bg-background p-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>INSPECTED NODE</span>
                      <span className="text-warning">Evidence Candidate</span>
                    </div>
                    <p className="mt-1 text-foreground leading-relaxed">
                      {selectedPreview.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Loop Section */}
      <section className="border-b border-border py-16 sm:py-24 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mono-label text-success">Investigation Methodology</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The Security Analyst Game Loop
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Master the same forensic workflows utilized by red teams and defensive security auditors.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GAME_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="panel relative p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-sm font-bold text-foreground">{item.step}</span>
                      <Icon className="size-4 text-success" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  {idx < GAME_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="size-5 text-border-strong" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12">
            <p className="mono-label">Platform Capabilities</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for Practical Cybersecurity Mastery
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="panel p-6 space-y-3 transition-colors hover:border-border-strong">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-elevated text-foreground">
                    <Icon className="size-5 text-success" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <ShieldAlert className="mx-auto size-10 text-warning" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to Begin Your First Investigation?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Mission 14 is active: An unauthenticated database leak was detected on ACME Corp's internal subnet.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/play/$missionId"
              params={{ missionId: "m14" }}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 font-mono text-xs font-semibold tracking-wider text-background uppercase transition-opacity hover:opacity-90"
            >
              Launch Mission 14
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <span className="font-mono text-xs text-muted-foreground">
            CyberFS — Gamified Cybersecurity Training Platform
          </span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/tutorial" className="hover:text-foreground">
              How to Play
            </Link>
            <Link to="/leaderboard" className="hover:text-foreground">
              Leaderboard
            </Link>
            <Link to="/settings" className="hover:text-foreground">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
