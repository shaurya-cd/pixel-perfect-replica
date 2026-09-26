import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCode,
  FolderTree,
  Lightbulb,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/tutorial")({
  component: TutorialPage,
});

const TUTORIAL_STEPS = [
  {
    step: "01",
    title: "Explore the Filesystem",
    short: "Navigate tree & hidden files",
    icon: FolderTree,
    content:
      "Enterprise systems have complex folder structures. Expand departmental directories (Finance, HR, DevOps, IT). Keep an eye out for hidden directories (.ssh_backup, .config) and suspicious warning tags (⚠️) on forgotten folders.",
    commandExample: "ls -la /Finance/config",
    sandboxAction: "Try navigating with 'cd' and 'ls' in the terminal or expanding tree nodes.",
  },
  {
    step: "02",
    title: "Inspect Files & Metadata",
    short: "Analyze permissions & ownership",
    icon: Search,
    content:
      "Click any file to open it in the code editor viewer. Check the permission bitmask (e.g. 777 world-writable 'drwxrwxrwx', or 644 readable 'rw-r--r--'). Review file ownership (root, devops, finance) and modification timestamps.",
    commandExample: "cat /Finance/config/database.env",
    sandboxAction: "Inspect the file to earn +10 XP inspection bonus.",
  },
  {
    step: "03",
    title: "Look for Security Issues",
    short: "Identify vulnerability patterns",
    icon: ShieldAlert,
    content:
      "Common vulnerabilities include hardcoded database credentials in .env files, world-writable payroll exports, sudoers misconfigurations, exposed SSH private keys (id_rsa), and debug mode left enabled in production compose files.",
    commandExample: "grep -i password /Finance/config/database.env",
    sandboxAction: "Spot unencrypted passwords and tokens.",
  },
  {
    step: "04",
    title: "Collect Evidence",
    short: "Cite line numbers & proof",
    icon: FileCode,
    content:
      "A valid security finding requires precise evidence. Click on lines within the code viewer or copy the file path. Note down the specific variable names, lines, or log entries proving the exposure.",
    commandExample: "stat /Finance/config/database.env",
    sandboxAction: "Highlight line 36: DB_USER=admin and line 37: DB_PASSWORD.",
  },
  {
    step: "05",
    title: "Submit Your Finding",
    short: "Classify type & severity",
    icon: Shield,
    content:
      "Click 'Submit Finding' at the top right. Select the affected file, classify the vulnerability type (e.g., Exposed Database Credentials), assess the CVSS severity (Critical/High), and write a brief rationale explaining the risk.",
    commandExample: "Submit Finding Modal -> Assess as Critical",
    sandboxAction: "Quality evidence reports unlock +50 XP bonus multipliers.",
  },
  {
    step: "06",
    title: "Earn XP & Rank Up",
    short: "Climb the investigator ladder",
    icon: Trophy,
    content:
      "Every validated finding awards base bounty XP plus speed and evidence accuracy bonuses. Climb from Level 1 Rookie to Level 50 Principal Security Architect and top the global leaderboards!",
    commandExample: "Mission Complete: +345 XP Total",
    sandboxAction: "Unlock achievement badges and advance to expert tier missions.",
  },
];

function TutorialPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = TUTORIAL_STEPS[activeStepIndex] ?? TUTORIAL_STEPS[0]!;
  const Icon = activeStep.icon;

  return (
    <AppShell
      title="How to Play — Security Analyst Field Guide"
      description="Learn the 6-step investigation cycle to inspect virtual company assets and submit findings."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Step Navigator */}
        <aside className="space-y-2 lg:col-span-4">
          <div className="panel p-3">
            <span className="mono-label block px-2 py-1 text-[11px]">TRAINING MODULES</span>
            <div className="mt-2 space-y-1">
              {TUTORIAL_STEPS.map((s, idx) => {
                const StepIcon = s.icon;
                const isCurrent = idx === activeStepIndex;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-md p-2.5 text-left font-mono text-xs transition-colors ${
                      isCurrent
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:bg-elevated hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11px] opacity-75">{s.step}</span>
                      <StepIcon className="size-4 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </div>
                    {isCurrent && <ChevronRight className="size-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Active Step Detail & Interactive Showcase */}
        <main className="space-y-6 lg:col-span-8">
          <div className="panel p-6 space-y-6">
            {/* Step header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-elevated text-success">
                  <Icon className="size-5" />
                </div>
                <div>
                  <span className="mono-label text-success">STEP {activeStep.step}</span>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {activeStep.title}
                  </h2>
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {activeStepIndex + 1} / {TUTORIAL_STEPS.length}
              </span>
            </div>

            {/* Step Explanation */}
            <div className="space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{activeStep.content}</p>

              {/* Sample Shell Command Box */}
              <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span>COMMAND LINE SIMULATION</span>
                  <span className="text-success">bash syntax</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="text-success">$</span>
                  <span>{activeStep.commandExample}</span>
                </div>
              </div>

              {/* Action Note */}
              <div className="flex items-start gap-2.5 rounded-md border border-border bg-elevated/40 p-3.5 text-xs text-muted-foreground">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
                <div>
                  <strong className="text-foreground">Investigator Tip: </strong>
                  <span>{activeStep.sandboxAction}</span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="rounded-md border border-border px-4 py-2 font-mono text-xs text-muted-foreground hover:bg-elevated hover:text-foreground disabled:opacity-30"
              >
                ← Previous Step
              </button>

              {activeStepIndex < TUTORIAL_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveStepIndex((prev) => Math.min(TUTORIAL_STEPS.length - 1, prev + 1))
                  }
                  className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 font-mono text-xs font-semibold text-background hover:opacity-90"
                >
                  Next Step
                  <ChevronRight className="size-3.5" />
                </button>
              ) : (
                <Link
                  to="/play/$missionId"
                  params={{ missionId: "m14" }}
                  className="inline-flex items-center gap-2 rounded-md bg-success px-4 py-2 font-mono text-xs font-bold text-background uppercase hover:opacity-90"
                >
                  Start Mission 14 Now
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
