import { useState } from "react";
import { HelpCircle, Key, Lightbulb, Lock, Unlock, X } from "lucide-react";
import type { Mission } from "@/types/mission";

const HINT_DATA: Record<string, string[]> = {
  m14: [
    "Departmental file shares often contain configuration files left behind during system migrations. Inspect the /Finance folder hierarchy.",
    "Look inside /Finance/config for environment files with names like database.env.",
    "Lines 36-37 in database.env hold production credentials in plain text without access restrictions.",
  ],
  m15: [
    "Check Unix directory permissions across the /HR directory structure.",
    "The directory /HR/payroll has 'rwxrwxrwx' (777) permissions, making it world-writable.",
  ],
  m16: [
    "Inspect the log files located in /DevOps/logs/access.log.",
    "Look for irregular sudo escalation at 02:14 by user 'svc_backup'.",
  ],
};

export function HintsModal({
  isOpen,
  onClose,
  mission,
  unlockedCount,
  onUnlockHint,
}: {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  unlockedCount: number;
  onUnlockHint: () => void;
}) {
  if (!isOpen) return null;

  const missionHints = HINT_DATA[mission.id] ?? [
    "Inspect suspicious file paths tagged with warning indicators in the file tree.",
    "Compare file permissions against standard least-privilege security baselines.",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hints-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
    >
      <div className="panel w-full max-w-lg border-border-strong bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-warning/15 text-warning">
              <Lightbulb className="size-4" />
            </div>
            <div>
              <h2 id="hints-modal-title" className="text-sm font-semibold text-foreground">
                Investigation Hints
              </h2>
              <p className="text-xs text-muted-foreground">
                {unlockedCount} of {missionHints.length} hints revealed • Using hints slightly reduces bonus XP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-elevated hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          {missionHints.map((hint, idx) => {
            const isUnlocked = idx < unlockedCount;
            return (
              <div
                key={idx}
                className={`rounded-lg border p-4 transition-all ${
                  isUnlocked
                    ? "border-border-strong bg-background text-foreground"
                    : "border-dashed border-border bg-elevated/30 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="mono-label flex items-center gap-1.5 text-xs">
                    {isUnlocked ? (
                      <Unlock className="size-3 text-warning" />
                    ) : (
                      <Lock className="size-3 text-muted-foreground" />
                    )}
                    Hint {idx + 1}
                  </span>
                  {!isUnlocked && idx === unlockedCount && (
                    <button
                      type="button"
                      onClick={onUnlockHint}
                      className="rounded border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10px] text-warning transition-colors hover:bg-warning/20"
                    >
                      Unlock Hint
                    </button>
                  )}
                </div>

                <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
                  {isUnlocked ? hint : "Hint locked. Click unlock above to reveal investigative guidance."}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-elevated px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
