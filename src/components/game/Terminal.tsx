import { useEffect, useRef, useState } from "react";
import { runMockCommand, initialTerminalLines, type TerminalLine } from "@/mock/terminal";
import { cn } from "@/lib/utils";

let counter = 0;
const nextId = () => `t${counter++}`;

export function Terminal({
  cwd,
  onCwdChange,
  onOpenPath,
}: {
  cwd: string;
  onCwdChange: (path: string) => void;
  onOpenPath: (path: string) => void;
}) {
  const [lines, setLines] = useState<TerminalLine[]>(() =>
    initialTerminalLines.map((l) => ({ ...l, id: nextId() })),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function submit(raw: string) {
    const result = runMockCommand(raw, cwd);
    const entry: TerminalLine = { id: nextId(), kind: "input", text: `${cwd} $ ${raw}` };
    setLines((prev) =>
      result.clear
        ? []
        : [...prev, entry, ...result.lines.map((l) => ({ ...l, id: nextId() }))],
    );
    if (result.cwd) onCwdChange(result.cwd);
    if (result.openedPath) onOpenPath(result.openedPath);
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 50));
    setHistoryIndex(-1);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="mono-label">Terminal</span>
        <span className="font-mono text-[11px] text-muted-foreground">simulated</span>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed"
        aria-live="polite"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "whitespace-pre-wrap",
              line.kind === "input" && "text-foreground",
              line.kind === "output" && "text-muted-foreground",
              line.kind === "error" && "text-destructive",
              line.kind === "system" && "text-success",
            )}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-border px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
          setValue("");
        }}
      >
        <span className="font-mono text-xs text-success">{cwd} $</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const i = Math.min(history.length - 1, historyIndex + 1);
              if (i >= 0) {
                setHistoryIndex(i);
                setValue(history[i]);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const i = historyIndex - 1;
              setHistoryIndex(i);
              setValue(i >= 0 ? history[i] : "");
            }
          }}
          aria-label="Terminal command input"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder="type a command — try 'help'"
        />
      </form>
    </div>
  );
}
