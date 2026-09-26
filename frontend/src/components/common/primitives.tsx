import { cn } from "@/lib/utils";
import type { Difficulty, Severity } from "@/types/mission";
import type { ReactNode } from "react";

export function ProgressBar({
  value,
  className,
  tone = "default",
}: {
  value: number;
  className?: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "bg-foreground",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  }[tone];

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", toneClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function LevelBadge({ level, className }: { level: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-2 py-1 font-mono text-[11px] tracking-widest text-foreground uppercase",
        className,
      )}
    >
      <span className="text-muted-foreground">LVL</span>
      {level}
    </span>
  );
}

export function XPBar({
  xp,
  xpToNextLevel,
  className,
}: {
  xp: number;
  xpToNextLevel: number;
  className?: string;
}) {
  const pct = (xp / xpToNextLevel) * 100;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="mono-label">XP</span>
        <span className="text-foreground">
          {xp.toLocaleString()}
          <span className="text-muted-foreground"> / {xpToNextLevel.toLocaleString()}</span>
        </span>
      </div>
      <ProgressBar value={pct} tone="success" />
    </div>
  );
}

const difficultyMeta: Record<Difficulty, { label: string; bars: number; className: string }> = {
  easy: { label: "Beginner", bars: 1, className: "text-success" },
  medium: { label: "Intermediate", bars: 2, className: "text-info" },
  hard: { label: "Advanced", bars: 3, className: "text-warning" },
  expert: { label: "Expert", bars: 4, className: "text-destructive" },
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  const meta = difficultyMeta[difficulty];
  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-[11px]", className)}>
      <span aria-hidden className="flex items-end gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-1 rounded-[1px]",
              i < meta.bars ? cn("bg-current", meta.className) : "bg-border-strong",
            )}
            style={{ height: 4 + i * 3 }}
          />
        ))}
      </span>
      <span className={meta.className}>{meta.label}</span>
    </span>
  );
}

const severityClass: Record<Severity, string> = {
  low: "border-border text-muted-foreground",
  medium: "border-info/40 text-info",
  high: "border-warning/40 text-warning",
  critical: "border-destructive/50 text-destructive",
};

export function SeverityTag({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase",
        severityClass[severity],
      )}
    >
      {severity}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <span className="mono-label">{label}</span>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <div className="mt-3 font-mono text-2xl tracking-tight text-foreground tabular-nums">
        {value}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
  description,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
