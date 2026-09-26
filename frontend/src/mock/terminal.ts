import { childrenOf, filesystem, nodeByPath } from "@/mock/filesystem";
import type { VirtualFile } from "@/types/filesystem";

export interface TerminalLine {
  id: string;
  kind: "input" | "output" | "error" | "system" | "success" | "warning";
  text: string;
}

export interface TerminalCommandResult {
  lines: Omit<TerminalLine, "id">[];
  cwd?: string;
  clear?: boolean;
  openedPath?: string;
}

const HELP = [
  "CyberFS Linux Shell Simulator v2.4 (Investigation Mode)",
  "----------------------------------------------------------",
  "Available Commands:",
  "  ls [-la|-l|-a] [path]  List directory contents & permissions",
  "  pwd                    Print working directory",
  "  cd <path>              Change working directory (e.g. cd /Finance/config, cd ..)",
  "  cat <file>             Print file contents & open in File Viewer",
  "  grep [-i] <text> [file] Search for pattern in file or directory",
  "  find <path> [name]     Search filesystem by filename pattern",
  "  file <path>            Determine file type and MIME",
  "  stat <path>            Display detailed file status & metadata",
  "  whoami                 Print effective investigator identity",
  "  id                     Print user and group IDs",
  "  history                List executed command history",
  "  clear                  Clear terminal output buffer",
  "  help                   Show this reference guide",
];

export function resolvePath(cwd: string, target: string): string {
  if (!target || target === "." || target === "./") return cwd;
  if (target === "~" || target === "~/root") return "/";
  const base = target.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  for (const part of target.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      base.pop();
    } else {
      base.push(part);
    }
  }
  return "/" + base.join("/");
}

/**
 * Purely simulated command handler over the mock filesystem.
 * Replace this module with a real terminal engine adapter later —
 * the UI only depends on the TerminalCommandResult shape.
 */
export function runMockCommand(
  raw: string,
  cwd: string,
  commandHistory: string[] = [],
): TerminalCommandResult {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const parts = input.split(/\s+/);
  const cmd = (parts[0] ?? "").toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case "help":
      return { lines: HELP.map((text) => ({ kind: "system" as const, text })) };

    case "clear":
      return { lines: [], clear: true };

    case "pwd":
      return { lines: [{ kind: "output", text: cwd || "/" }] };

    case "whoami":
      return { lines: [{ kind: "output", text: "shaurya (Security Investigator L12)" }] };

    case "id":
      return {
        lines: [
          {
            kind: "output",
            text: "uid=1001(shaurya) gid=1001(investigators) groups=1001(investigators),27(sudo),4(adm)",
          },
        ],
      };

    case "history":
      return {
        lines: commandHistory.slice(-20).map((h, i) => ({
          kind: "output" as const,
          text: `  ${(i + 1).toString().padStart(3, " ")}  ${h}`,
        })),
      };

    case "ls": {
      const flags = args.filter((a) => a.startsWith("-"));
      const nonFlagArgs = args.filter((a) => !a.startsWith("-"));
      const targetArg = nonFlagArgs[0] ?? "";
      const path = resolvePath(cwd, targetArg);
      const node = nodeByPath(path);

      if (!node) {
        return { lines: [{ kind: "error", text: `ls: cannot access '${targetArg || path}': No such file or directory` }] };
      }

      if (node.type === "file") {
        return { lines: [{ kind: "output", text: node.name }] };
      }

      const showHidden = flags.some((f) => f.includes("a"));
      const longFormat = flags.some((f) => f.includes("l"));

      const kids = childrenOf(node.id).filter((k) => showHidden || !k.hidden);

      if (kids.length === 0) {
        return { lines: [{ kind: "output", text: "(empty directory)" }] };
      }

      if (longFormat) {
        const lines: Omit<TerminalLine, "id">[] = [
          { kind: "output", text: `total ${kids.length * 4}` },
          ...kids.map((k) => ({
            kind: (k.suspicious ? "warning" : "output") as "warning" | "output",
            text: `${(k.permissions ?? "-rw-r--r--").padEnd(12)} ${(k.owner ?? "devops").padEnd(10)} ${(k.group ?? "staff").padEnd(8)} ${String(k.size ?? 4096).padStart(8)}  ${k.modifiedAt ?? "2026-09-25"}  ${k.name}${k.type === "folder" ? "/" : ""}`,
          })),
        ];
        return { lines };
      }

      return {
        lines: [
          {
            kind: "output",
            text: kids.map((k) => `${k.name}${k.type === "folder" ? "/" : ""}`).join("   "),
          },
        ],
      };
    }

    case "cd": {
      const targetArg = args[0] ?? "/";
      const path = resolvePath(cwd, targetArg);
      const node = nodeByPath(path);

      if (!node) {
        return { lines: [{ kind: "error", text: `cd: ${targetArg}: No such file or directory` }] };
      }

      if (node.type !== "folder") {
        return { lines: [{ kind: "error", text: `cd: ${targetArg}: Not a directory` }] };
      }

      return { lines: [], cwd: node.path };
    }

    case "cat": {
      const fileArg = args[0];
      if (!fileArg) return { lines: [{ kind: "error", text: "cat: missing file operand" }] };

      const path = resolvePath(cwd, fileArg);
      const node = nodeByPath(path);

      if (!node) {
        return { lines: [{ kind: "error", text: `cat: ${fileArg}: No such file or directory` }] };
      }

      if (node.type === "folder") {
        return { lines: [{ kind: "error", text: `cat: ${fileArg}: Is a directory` }] };
      }

      const contentLines = (node.content ?? "").split("\n");
      return {
        lines: contentLines.map((text) => ({ kind: "output" as const, text })),
        openedPath: node.path,
      };
    }

    case "grep": {
      if (args.length === 0) {
        return { lines: [{ kind: "error", text: "grep: missing pattern argument. Usage: grep <pattern> [file]" }] };
      }
      const caseInsensitive = args.includes("-i");
      const cleanArgs = args.filter((a) => !a.startsWith("-"));
      const pattern = cleanArgs[0] || "";
      const targetFile = cleanArgs[1];

      if (!pattern) {
        return { lines: [{ kind: "error", text: "grep: pattern cannot be empty" }] };
      }

      const searchRegex = new RegExp(pattern, caseInsensitive ? "i" : "");
      let filesToSearch: VirtualFile[] = [];

      if (targetFile) {
        const path = resolvePath(cwd, targetFile);
        const node = nodeByPath(path);
        if (!node) return { lines: [{ kind: "error", text: `grep: ${targetFile}: No such file or directory` }] };
        if (node.type === "file") filesToSearch = [node];
        else filesToSearch = filesystem.filter((f) => f.type === "file" && f.path.startsWith(node.path));
      } else {
        filesToSearch = filesystem.filter((f) => f.type === "file");
      }

      const results: Omit<TerminalLine, "id">[] = [];
      for (const file of filesToSearch) {
        const lines = (file.content ?? "").split("\n");
        lines.forEach((line, idx) => {
          if (searchRegex.test(line)) {
            results.push({
              kind: "warning",
              text: `${file.path}:${idx + 1}: ${line}`,
            });
          }
        });
      }

      if (results.length === 0) {
        return { lines: [{ kind: "output", text: `grep: no matches found for '${pattern}'` }] };
      }

      return { lines: results };
    }

    case "find": {
      const firstArg = args[0];
      const searchPath = firstArg && !firstArg.startsWith("-") ? resolvePath(cwd, firstArg) : cwd;
      const nameIndex = args.indexOf("-name");
      const nameArg = nameIndex !== -1 ? args[nameIndex + 1] : undefined;
      const pattern = nameArg ? nameArg.replace(/['"*]/g, "") : "";

      const matches = filesystem.filter((n) => {
        const inPath = n.path.startsWith(searchPath === "/" ? "" : searchPath);
        if (!inPath) return false;
        if (!pattern) return true;
        return n.name.toLowerCase().includes(pattern.toLowerCase());
      });

      return {
        lines: matches.map((m) => ({
          kind: "output" as const,
          text: m.path,
        })),
      };
    }

    case "file": {
      const target = args[0];
      if (!target) return { lines: [{ kind: "error", text: "file: missing operand" }] };
      const path = resolvePath(cwd, target);
      const node = nodeByPath(path);
      if (!node) return { lines: [{ kind: "error", text: `file: cannot open '${target}': No such file` }] };

      if (node.type === "folder") {
        return { lines: [{ kind: "output", text: `${node.path}: directory` }] };
      }
      return {
        lines: [
          {
            kind: "output",
            text: `${node.path}: ${node.mimeType ?? "ASCII"} document text (${node.size ?? 0} bytes)`,
          },
        ],
      };
    }

    case "stat": {
      const target = args[0];
      if (!target) return { lines: [{ kind: "error", text: "stat: missing operand" }] };
      const path = resolvePath(cwd, target);
      const node = nodeByPath(path);
      if (!node) return { lines: [{ kind: "error", text: `stat: cannot stat '${target}': No such file` }] };

      return {
        lines: [
          { kind: "output", text: `  File: ${node.path}` },
          { kind: "output", text: `  Size: ${node.size ?? 4096} bytes\tBlocks: 8\tIO Block: 4096\t${node.type}` },
          { kind: "output", text: `Access: (${node.permissions ?? "-rw-r--r--"})  Uid: (${node.owner ?? "devops"})   Gid: (${node.group ?? "staff"})` },
          { kind: "output", text: `Modify: ${node.modifiedAt ?? "2026-09-25"} 14:22:01.000000000` },
          { kind: "output", text: `Create: ${node.createdAt ?? "2026-09-21"} 09:15:30.000000000` },
        ],
      };
    }

    default:
      return {
        lines: [
          {
            kind: "error",
            text: `bash: ${cmd}: command not found. Type 'help' for available commands.`,
          },
        ],
      };
  }
}

export const initialTerminalLines: Omit<TerminalLine, "id">[] = [
  { kind: "system", text: "CyberFS Virtual Sandbox Terminal [v2.4.1]" },
  { kind: "system", text: "Session: Target Host 'acme-corp-core' connected via SSH" },
  { kind: "system", text: "Type 'help' to view available investigation commands." },
];
