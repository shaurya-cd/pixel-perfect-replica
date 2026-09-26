import { childrenOf, nodeByPath } from "@/mock/filesystem";

export interface TerminalLine {
  id: string;
  kind: "input" | "output" | "error" | "system";
  text: string;
}

export interface TerminalCommandResult {
  lines: Omit<TerminalLine, "id">[];
  /** New working directory path, when the command changed it. */
  cwd?: string;
  clear?: boolean;
  /** Path of a file the command displayed — the UI can open it in the viewer. */
  openedPath?: string;
}

const HELP = [
  "Available commands:",
  "  ls [path]     list directory contents",
  "  pwd           print working directory",
  "  cd <path>     change directory",
  "  cat <file>    print file contents",
  "  clear         clear the terminal",
  "  help          show this message",
];

function resolvePath(cwd: string, target: string): string {
  if (!target || target === ".") return cwd;
  const base = target.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  for (const part of target.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part);
  }
  return "/" + base.join("/");
}

/**
 * Purely simulated command handler over the mock filesystem.
 * Replace this module with a real terminal engine adapter later —
 * the UI only depends on the TerminalCommandResult shape.
 */
export function runMockCommand(raw: string, cwd: string): TerminalCommandResult {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args[0] ?? "";

  switch (cmd) {
    case "help":
      return { lines: HELP.map((text) => ({ kind: "output" as const, text })) };

    case "clear":
      return { lines: [], clear: true };

    case "pwd":
      return { lines: [{ kind: "output", text: cwd }] };

    case "ls": {
      const path = resolvePath(cwd, arg);
      const node = nodeByPath(path);
      if (!node) return { lines: [{ kind: "error", text: `ls: ${arg || path}: No such file or directory` }] };
      if (node.type === "file") return { lines: [{ kind: "output", text: node.name }] };
      const kids = childrenOf(node.id).filter((k) => !k.hidden || args.includes("-a") || args.includes("-la"));
      if (kids.length === 0) return { lines: [{ kind: "output", text: "" }] };
      if (args.includes("-la") || args.includes("-l")) {
        return {
          lines: kids.map((k) => ({
            kind: "output" as const,
            text: `${(k.permissions ?? "----------").padEnd(11)} ${(k.owner ?? "unknown").padEnd(9)} ${String(k.size ?? 4096).padStart(9)}  ${k.name}`,
          })),
        };
      }
      return { lines: [{ kind: "output", text: kids.map((k) => k.name).join("   ") }] };
    }

    case "cd": {
      const path = resolvePath(cwd, arg || "/");
      const node = nodeByPath(path);
      if (!node) return { lines: [{ kind: "error", text: `cd: ${arg}: No such file or directory` }] };
      if (node.type !== "folder") return { lines: [{ kind: "error", text: `cd: ${arg}: Not a directory` }] };
      return { lines: [], cwd: node.path };
    }

    case "cat": {
      if (!arg) return { lines: [{ kind: "error", text: "cat: missing operand" }] };
      const path = resolvePath(cwd, arg);
      const node = nodeByPath(path);
      if (!node) return { lines: [{ kind: "error", text: `cat: ${arg}: No such file or directory` }] };
      if (node.type === "folder") return { lines: [{ kind: "error", text: `cat: ${arg}: Is a directory` }] };
      return {
        lines: (node.content ?? "").split("\n").map((text) => ({ kind: "output" as const, text })),
        openedPath: node.path,
      };
    }

    default:
      return { lines: [{ kind: "error", text: `${cmd}: command not found. Type 'help'.` }] };
  }
}

export const initialTerminalLines: Omit<TerminalLine, "id">[] = [
  { kind: "system", text: "CyberFS investigation shell — simulated environment" },
  { kind: "system", text: "Type 'help' for available commands." },
];
