import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, CornerDownLeft, Maximize2, Minimize2, Terminal as TerminalIcon, Trash2 } from "lucide-react";
import { runMockCommand, initialTerminalLines, type TerminalLine } from "@/mock/terminal";
import { filesystem } from "@/mock/filesystem";
import { cn } from "@/lib/utils";

let counter = 0;
const nextId = () => `t_${counter++}`;

const QUICK_COMMANDS = [
  "ls -la",
  "pwd",
  "cat /Finance/config/database.env",
  "grep -i password",
  "whoami",
  "help",
];

export function Terminal({
  cwd,
  onCwdChange,
  onOpenPath,
  height,
  onToggleHeight,
}: {
  cwd: string;
  onCwdChange: (path: string) => void;
  onOpenPath: (path: string) => void;
  height?: "collapsed" | "normal" | "expanded";
  onToggleHeight?: () => void;
}) {
  const [lines, setLines] = useState<TerminalLine[]>(() =>
    initialTerminalLines.map((l) => ({ ...l, id: nextId() })),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  function submit(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const result = runMockCommand(trimmed, cwd, history);
    const entry: TerminalLine = { id: nextId(), kind: "input", text: `${cwd} $ ${raw}` };

    if (result.clear) {
      setLines([]);
    } else {
      setLines((prev) => [...prev, entry, ...result.lines.map((l) => ({ ...l, id: nextId() }))]);
    }

    if (result.cwd) onCwdChange(result.cwd);
    if (result.openedPath) onOpenPath(result.openedPath);

    setHistory((h) => [trimmed, ...h.filter((x) => x !== trimmed)].slice(0, 50));
    setHistoryIndex(-1);
    setValue("");
  }

  const handleTabCompletion = () => {
    const parts = value.split(" ");
    const currentPart = parts[parts.length - 1];
    if (!currentPart) return;

    const matches = filesystem
      .map((f) => f.name)
      .filter((name) => name.toLowerCase().startsWith(currentPart.toLowerCase()));

    if (matches.length === 1 && matches[0]) {
      parts[parts.length - 1] = matches[0];
      setValue(parts.join(" "));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-3.5 text-success" />
          <span className="mono-label text-[11px] font-semibold text-foreground">
            INVESTIGATION TERMINAL
          </span>
          <span className="hidden text-[10px] text-muted-foreground sm:inline">
            (target: acme-internal-share)
          </span>
        </div>

        {/* Quick actions in title bar */}
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 md:flex">
            {QUICK_COMMANDS.slice(0, 4).map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => submit(cmd)}
                className="rounded border border-border bg-elevated/40 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-elevated hover:text-foreground"
              >
                {cmd}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLines([])}
            title="Clear Output"
            className="rounded p-1 text-muted-foreground hover:bg-elevated hover:text-foreground"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      {/* Terminal Scroll Output */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="min-h-0 flex-1 cursor-text overflow-auto p-3 leading-relaxed select-text"
        aria-live="polite"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "whitespace-pre-wrap",
              line.kind === "input" && "text-foreground font-semibold",
              line.kind === "output" && "text-muted-foreground",
              line.kind === "error" && "text-destructive",
              line.kind === "system" && "text-info font-medium",
              line.kind === "success" && "text-success",
              line.kind === "warning" && "text-warning",
            )}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        className="flex items-center gap-2 border-t border-border bg-surface/50 px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <span className="text-success font-semibold shrink-0 select-none">
          investigator@acme:{cwd}$
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              handleTabCompletion();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const i = Math.min(history.length - 1, historyIndex + 1);
              if (i >= 0 && history[i]) {
                setHistoryIndex(i);
                setValue(history[i]);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const i = historyIndex - 1;
              setHistoryIndex(i);
              setValue(i >= 0 ? (history[i] ?? "") : "");
            }
          }}
          aria-label="Terminal command input"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          placeholder="Type command (e.g. ls -la, cat database.env, grep -i password)..."
        />
        <button
          type="submit"
          className="rounded p-1 text-muted-foreground hover:bg-elevated hover:text-foreground"
          title="Execute Command"
        >
          <CornerDownLeft className="size-3" />
        </button>
      </form>
    </div>
  );
}
