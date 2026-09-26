import { useState } from "react";
import { AlertCircle, CheckCircle, FileCode, ShieldAlert, X } from "lucide-react";
import type { Finding, Severity } from "@/types/mission";
import type { VirtualFile } from "@/types/filesystem";
import { SeverityTag } from "@/components/common/primitives";
import { filesystem } from "@/mock/filesystem";

const VULN_TYPES = [
  "Exposed Database Credentials",
  "World-Writable Directory / File",
  "Unrestricted Sudo Privilege Escalation",
  "Exposed SSH Private Key",
  "Debug Mode Enabled in Production",
  "Unprotected Database Dump / Backup",
  "Information Disclosure",
  "Insecure File Permissions",
];

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

export function FindingModal({
  isOpen,
  onClose,
  initialFile,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialFile?: VirtualFile | undefined;
  onSubmit: (finding: Finding) => void | Promise<void>;
}) {
  const [filePath, setFilePath] = useState(initialFile?.path ?? "/Finance/config/database.env");
  const [vulnType, setVulnType] = useState("Exposed Database Credentials");
  const [severity, setSeverity] = useState<Severity>("critical");
  const [evidence, setEvidence] = useState(
    "Lines 36-37 contain hardcoded DB_USER=admin and DB_PASSWORD=Pr0d!Finance2026 on a readable file share (/Finance/config/database.env).",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const selectedNode = filesystem.find((f) => f.path === filePath);
      onSubmit({
        fileId: selectedNode?.id ?? "custom",
        filePath,
        vulnerabilityType: vulnType,
        severity,
        evidence,
      });
    }, 450);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="finding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
    >
      <div className="panel w-full max-w-xl border-border-strong bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-destructive/15 text-destructive">
              <ShieldAlert className="size-4" />
            </div>
            <div>
              <h2 id="finding-modal-title" className="text-sm font-semibold text-foreground">
                Submit Security Finding
              </h2>
              <p className="text-xs text-muted-foreground">Document identified vulnerability & evidence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Target File */}
          <div>
            <label htmlFor="target-file" className="mono-label block text-xs">
              Affected File / Path
            </label>
            <div className="relative mt-1.5">
              <FileCode className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="target-file"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 font-mono text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                placeholder="/Finance/config/database.env"
              />
            </div>
            {initialFile && initialFile.path !== filePath && (
              <button
                type="button"
                onClick={() => setFilePath(initialFile.path)}
                className="mt-1 text-[11px] text-muted-foreground underline hover:text-foreground"
              >
                Use currently viewed file ({initialFile.path})
              </button>
            )}
          </div>

          {/* Vulnerability Type */}
          <div>
            <label htmlFor="vuln-type" className="mono-label block text-xs">
              Vulnerability Classification
            </label>
            <select
              id="vuln-type"
              value={vulnType}
              onChange={(e) => setVulnType(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              {VULN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="mono-label block text-xs">Assessed Severity</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs transition-all ${
                    severity === s
                      ? "border-foreground bg-elevated text-foreground"
                      : "border-border bg-background/50 text-muted-foreground hover:border-border-strong hover:text-foreground"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      s === "critical"
                        ? "bg-destructive"
                        : s === "high"
                          ? "bg-warning"
                          : s === "medium"
                            ? "bg-info"
                            : "bg-muted-foreground"
                    }`}
                  />
                  <span className="capitalize">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="evidence-text" className="mono-label block text-xs">
                Investigation Evidence & Rationale
              </label>
              <span className="font-mono text-[10px] text-muted-foreground">Quality Score: +50 XP bonus</span>
            </div>
            <textarea
              id="evidence-text"
              rows={3}
              required
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Cite lines of code, directory permissions, or compromised host logs..."
              className="mt-1.5 w-full rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-elevated/40 p-3 text-xs text-muted-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-info" />
            <p>
              Submitting valid evidence evaluates your investigation accuracy and awards base XP plus speed and evidence bonuses.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="size-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Verifying Finding...
                </>
              ) : (
                <>
                  <CheckCircle className="size-3.5" />
                  Submit Finding
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
