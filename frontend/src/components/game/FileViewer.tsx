import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Eye,
  EyeOff,
  FileCode2,
  FileSearch,
  Fingerprint,
  Info,
  Lock,
  PanelRightClose,
  PanelRightOpen,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VirtualFile } from "@/types/filesystem";

function formatSize(bytes?: number) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function computeMockHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (
    Math.abs(hash).toString(16).padStart(8, "0") +
    "e9c4b12f883017a0d421884bb07c"
  ).slice(0, 32);
}

function parsePermissions(perm?: string) {
  if (!perm || perm.length < 10) return { owner: "r-x", group: "r-x", others: "r-x", octal: "0755" };
  const owner = perm.slice(1, 4);
  const group = perm.slice(4, 7);
  const others = perm.slice(7, 10);
  let oct = 0;
  if (owner[0] === "r") oct += 400;
  if (owner[1] === "w") oct += 200;
  if (owner[2] === "x") oct += 100;
  if (group[0] === "r") oct += 40;
  if (group[1] === "w") oct += 20;
  if (group[2] === "x") oct += 10;
  if (others[0] === "r") oct += 4;
  if (others[1] === "w") oct += 2;
  if (others[2] === "x") oct += 1;
  return { owner, group, others, octal: "0" + oct.toString() };
}

function MetadataDrawer({ file }: { file: VirtualFile }) {
  const perms = parsePermissions(file.permissions);
  const hash = computeMockHash(file.content || file.path);

  return (
    <div className="space-y-4 p-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="mono-label font-bold text-foreground">FILE INSPECTOR</span>
        <span className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {perms.octal}
        </span>
      </div>

      {/* Basic properties */}
      <div className="space-y-2">
        <div>
          <span className="mono-label block text-[10px]">Full Path</span>
          <p className="mt-0.5 font-mono text-xs text-foreground break-all">{file.path}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mono-label block text-[10px]">Owner</span>
            <p className="font-mono text-foreground">{file.owner ?? "unknown"}</p>
          </div>
          <div>
            <span className="mono-label block text-[10px]">Group</span>
            <p className="font-mono text-foreground">{file.group ?? "staff"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mono-label block text-[10px]">Size</span>
            <p className="font-mono text-foreground">{formatSize(file.size)}</p>
          </div>
          <div>
            <span className="mono-label block text-[10px]">MIME / Format</span>
            <p className="font-mono text-foreground">{file.mimeType ?? "text/plain"}</p>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="rounded-md border border-border bg-background p-2.5">
        <span className="mono-label block text-[10px]">Permission Bitmask</span>
        <p className="mt-1 font-mono text-sm tracking-widest text-foreground">{file.permissions ?? "-rw-r--r--"}</p>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
          <div className="rounded bg-elevated p-1">
            <span className="text-muted-foreground">User</span>
            <p className="font-semibold text-foreground">{perms.owner}</p>
          </div>
          <div className="rounded bg-elevated p-1">
            <span className="text-muted-foreground">Group</span>
            <p className="font-semibold text-foreground">{perms.group}</p>
          </div>
          <div className="rounded bg-elevated p-1">
            <span className="text-muted-foreground">Others</span>
            <p className={cn("font-semibold", perms.others.includes("w") ? "text-destructive" : "text-foreground")}>
              {perms.others}
            </p>
          </div>
        </div>
        {perms.others.includes("w") && (
          <p className="mt-1.5 text-[10px] text-destructive">
            ⚠️ Insecure: File/folder is world-writable.
          </p>
        )}
      </div>

      {/* Integrity & Hashes */}
      <div>
        <span className="mono-label block text-[10px]">SHA-256 Checksum</span>
        <div className="mt-1 flex items-center gap-1 rounded bg-background p-1.5 font-mono text-[10px] text-muted-foreground">
          <Fingerprint className="size-3.5 shrink-0 text-info" />
          <span className="truncate">{hash}</span>
        </div>
      </div>

      {/* Timestamps */}
      <div className="space-y-1 text-[11px] text-muted-foreground">
        <div className="flex justify-between">
          <span>Created:</span>
          <span className="font-mono text-foreground">{file.createdAt ?? "2026-09-21"}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Modified:</span>
          <span className="font-mono text-foreground">{file.modifiedAt ?? "2026-09-25"}</span>
        </div>
      </div>
    </div>
  );
}

export function FileViewer({
  file,
  showDetails,
  onToggleDetails,
  onInspect,
  onSelectEvidenceLine,
}: {
  file?: VirtualFile | undefined;
  showDetails: boolean;
  onToggleDetails: () => void;
  onInspect: (file: VirtualFile) => void;
  onSelectEvidenceLine?: ((line: string, lineNum?: number) => void) | undefined;
}) {
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedLineIdx, setSelectedLineIdx] = useState<number | null>(null);

  if (!file) {
    return (
      <div className="grid-field flex h-full items-center justify-center p-8">
        <div className="max-w-sm text-center">
          <FileSearch className="mx-auto size-8 text-muted-foreground/60" aria-hidden />
          <h3 className="mt-3 text-sm font-semibold text-foreground">No File Selected</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Explore the filesystem tree on the left or use <code className="rounded bg-elevated px-1 py-0.5 font-mono text-foreground">cat &lt;file&gt;</code> in the terminal.
          </p>
        </div>
      </div>
    );
  }

  const lines = (file.content ?? "").split("\n");

  const handleCopyPath = () => {
    navigator.clipboard?.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderFormattedLine = (line: string) => {
    if (!line.trim()) return <span>&nbsp;</span>;
    if (line.trimStart().startsWith("#")) {
      return <span className="italic text-muted-foreground">{line}</span>;
    }

    const secretRegex = /((?:PASSWORD|SECRET|TOKEN|KEY|PASS)\s*=\s*)(\S+)/i;
    if (maskSecrets && secretRegex.test(line)) {
      return line.split(secretRegex).map((part, idx) => {
        if (idx === 1) return <span key={idx} className="text-warning font-semibold">{part}</span>;
        if (idx === 2) return <span key={idx} className="rounded bg-muted px-1 font-mono text-foreground select-none">••••••••••••</span>;
        return <span key={idx}>{part}</span>;
      });
    }

    if (line.includes("=")) {
      const [k, ...rest] = line.split("=");
      return (
        <span>
          <span className="text-info font-medium">{k}=</span>
          <span className="text-foreground">{rest.join("=")}</span>
        </span>
      );
    }

    return <span>{line}</span>;
  };

  return (
    <div className="flex h-full min-h-0 bg-background font-sans">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FileCode2 className="size-4 text-info shrink-0" />
              <h2 className="truncate font-mono text-xs font-semibold text-foreground">{file.name}</h2>
              <button
                type="button"
                onClick={handleCopyPath}
                title="Copy Path"
                className="text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
              </button>
            </div>
            <p className="truncate font-mono text-[10px] text-muted-foreground">{file.path}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMaskSecrets((v) => !v)}
              title={maskSecrets ? "Reveal secrets" : "Mask secrets"}
              className="flex items-center gap-1 rounded-md border border-border bg-elevated/50 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:bg-elevated hover:text-foreground"
            >
              {maskSecrets ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              <span className="hidden sm:inline">{maskSecrets ? "Masked" : "Revealed"}</span>
            </button>

            <button
              type="button"
              onClick={() => onInspect(file)}
              className="rounded-md border border-border bg-elevated px-2.5 py-1 font-mono text-[11px] tracking-wider text-foreground uppercase transition-colors hover:bg-muted"
            >
              Inspect
            </button>

            <button
              type="button"
              onClick={onToggleDetails}
              aria-label={showDetails ? "Hide inspector" : "Show inspector"}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-elevated hover:text-foreground"
            >
              {showDetails ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
            </button>
          </div>
        </div>

        {/* Quick Meta Subhead */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border bg-surface/60 px-4 py-1.5 font-mono text-[11px] text-muted-foreground">
          <span>Type: <strong className="text-foreground">{file.mimeType ?? "DIR"}</strong></span>
          <span>Size: <strong className="text-foreground">{formatSize(file.size)}</strong></span>
          <span>Owner: <strong className="text-foreground">{file.owner ?? "—"}</strong></span>
          <span>Perms: <strong className="text-foreground">{file.permissions ?? "—"}</strong></span>
          <span>Modified: <strong className="text-foreground">{file.modifiedAt ?? "—"}</strong></span>
        </div>

        {/* Warning banner */}
        {file.suspicious && (
          <div className="flex items-center gap-2 border-b border-border bg-warning/10 px-4 py-2 text-xs text-warning">
            <TriangleAlert className="size-4 shrink-0" />
            <span>
              <strong>Suspicious File:</strong> Security markers detected. Analyze this file closely for exposed secrets or flawed permissions.
            </span>
          </div>
        )}

        {/* Code View Body */}
        <div className="min-h-0 flex-1 overflow-auto bg-background p-0">
          {file.type === "folder" ? (
            <div className="p-8 text-center font-mono text-xs text-muted-foreground">
              Directory container. Expand nodes in the filesystem tree to explore subfiles.
            </div>
          ) : (
            <pre className="p-0 font-mono text-xs leading-relaxed">
              {lines.map((line, idx) => {
                const isSelected = selectedLineIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedLineIdx(idx);
                      onSelectEvidenceLine?.(line, idx + 1);
                    }}
                    className={cn(
                      "flex cursor-pointer transition-colors hover:bg-elevated/80",
                      isSelected && "bg-info/10 border-l-2 border-info",
                    )}
                  >
                    <span className="w-11 shrink-0 border-r border-border px-2.5 py-0.5 text-right text-muted-foreground/60 select-none">
                      {idx + 1}
                    </span>
                    <code className="px-3 py-0.5 whitespace-pre-wrap">
                      {renderFormattedLine(line)}
                    </code>
                  </div>
                );
              })}
            </pre>
          )}
        </div>
      </div>

      {/* File Details Drawer */}
      {showDetails && (
        <aside className="hidden w-72 shrink-0 overflow-auto border-l border-border bg-surface lg:block">
          <MetadataDrawer file={file} />
        </aside>
      )}
    </div>
  );
}
