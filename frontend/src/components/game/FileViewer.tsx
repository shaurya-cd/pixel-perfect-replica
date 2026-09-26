import { FileSearch, PanelRightClose, PanelRightOpen, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VirtualFile } from "@/types/filesystem";

function formatSize(bytes?: number) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Masks obvious secret values so the answer is never handed to the player. */
function maskLine(line: string) {
  return line.replace(
    /((?:PASSWORD|SECRET|TOKEN|KEY|PASS)\s*=\s*)(\S+)/i,
    (_m, p1: string, p2: string) => p1 + "•".repeat(Math.min(12, p2.length)),
  );
}

function Metadata({ file }: { file: VirtualFile }) {
  const rows: Array<[string, string]> = [
    ["Name", file.name],
    ["Path", file.path],
    ["Type", file.mimeType ?? (file.type === "folder" ? "DIR" : "—")],
    ["Owner", file.owner ?? "—"],
    ["Permissions", file.permissions ?? "—"],
    ["Size", formatSize(file.size)],
    ["Created", file.createdAt ?? "—"],
    ["Modified", file.modifiedAt ?? "—"],
  ];

  return (
    <dl className="space-y-3 p-4">
      <p className="mono-label">File information</p>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="mono-label">{k}</dt>
          <dd className="mt-0.5 font-mono text-xs break-all text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FileViewer({
  file,
  showDetails,
  onToggleDetails,
  onInspect,
}: {
  file?: VirtualFile;
  showDetails: boolean;
  onToggleDetails: () => void;
  onInspect: (file: VirtualFile) => void;
}) {
  if (!file) {
    return (
      <div className="grid-field flex h-full items-center justify-center p-8">
        <div className="text-center">
          <FileSearch className="mx-auto size-6 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-sm text-foreground">No file selected</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pick a file from the tree or run <span className="font-mono">cat</span> in the terminal.
          </p>
        </div>
      </div>
    );
  }

  const lines = (file.content ?? "").split("\n");

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div className="min-w-0">
            <h2 className="truncate font-mono text-sm text-foreground">{file.name}</h2>
            <p className="truncate font-mono text-[11px] text-muted-foreground">{file.path}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onInspect(file)}
              className="rounded-md border border-border px-2.5 py-1.5 font-mono text-[11px] tracking-widest text-foreground uppercase transition-colors hover:bg-elevated"
            >
              Inspect
            </button>
            <button
              type="button"
              onClick={onToggleDetails}
              aria-label={showDetails ? "Hide file details" : "Show file details"}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            >
              {showDetails ? (
                <PanelRightClose className="size-4" />
              ) : (
                <PanelRightOpen className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-4 py-2 font-mono text-[11px] text-muted-foreground">
          <span>{file.mimeType ?? "DIR"}</span>
          <span>{formatSize(file.size)}</span>
          <span>{file.owner ?? "—"}</span>
          <span>{file.permissions ?? "—"}</span>
          <span>modified {file.modifiedAt ?? "—"}</span>
        </div>

        {file.suspicious ? (
          <div className="flex items-start gap-2 border-b border-border bg-warning/10 px-4 py-2">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
            <p className="text-xs text-warning">
              Suspicious file — this deserves further investigation.
            </p>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-auto bg-background">
          {file.type === "folder" ? (
            <p className="p-4 font-mono text-xs text-muted-foreground">
              Directory — expand it in the tree to list its contents.
            </p>
          ) : (
            <pre className="p-0 font-mono text-xs leading-relaxed">
              {lines.map((line, i) => (
                <div key={i} className="flex hover:bg-elevated/60">
                  <span className="w-10 shrink-0 border-r border-border px-2 py-0.5 text-right text-muted-foreground select-none">
                    {i + 1}
                  </span>
                  <code
                    className={cn(
                      "px-3 py-0.5 whitespace-pre-wrap",
                      line.trimStart().startsWith("#") ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {maskLine(line)}
                  </code>
                </div>
              ))}
            </pre>
          )}
        </div>
      </div>

      {showDetails ? (
        <aside className="hidden w-64 shrink-0 overflow-auto border-l border-border bg-surface lg:block">
          <Metadata file={file} />
        </aside>
      ) : null}
    </div>
  );
}
