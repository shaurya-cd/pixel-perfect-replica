import { ChevronRight, File, FileKey, FileText, Folder, FolderOpen, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { childrenOf, filesystem } from "@/mock/filesystem";
import { cn } from "@/lib/utils";
import type { VirtualFile } from "@/types/filesystem";

function iconFor(node: VirtualFile, expanded: boolean) {
  if (node.type === "folder") return expanded ? FolderOpen : Folder;
  if (node.mimeType === "KEY" || node.mimeType === "ENV") return FileKey;
  if (["MD", "TXT", "CSV", "LOG", "YML", "BAK"].includes(node.mimeType ?? "")) return FileText;
  return File;
}

function TreeNode({
  node,
  depth,
  expanded,
  onToggle,
  selectedId,
  onSelect,
}: {
  node: VirtualFile;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId?: string;
  onSelect: (node: VirtualFile) => void;
}) {
  const isOpen = expanded.has(node.id);
  const Icon = iconFor(node, isOpen);
  const kids = node.type === "folder" ? childrenOf(node.id) : [];

  return (
    <li role="none">
      <button
        type="button"
        role="treeitem"
        aria-expanded={node.type === "folder" ? isOpen : undefined}
        aria-selected={selectedId === node.id}
        onClick={() => (node.type === "folder" ? onToggle(node.id) : onSelect(node))}
        style={{ paddingLeft: depth * 12 + 8 }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          selectedId === node.id
            ? "bg-elevated text-foreground"
            : "text-muted-foreground hover:bg-elevated hover:text-foreground",
        )}
      >
        {node.type === "folder" ? (
          <ChevronRight
            aria-hidden
            className={cn("size-3 shrink-0 transition-transform", isOpen && "rotate-90")}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <Icon className={cn("size-3.5 shrink-0", node.suspicious && "text-warning")} aria-hidden />
        <span className={cn("truncate", node.hidden && "italic")}>{node.name}</span>
        {node.suspicious ? (
          <TriangleAlert className="ml-auto size-3 shrink-0 text-warning" aria-label="Flagged" />
        ) : null}
      </button>

      {node.type === "folder" && isOpen && kids.length > 0 ? (
        <ul role="group">
          {kids.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FilesystemTree({
  selectedId,
  onSelect,
  expanded,
  onToggle,
}: {
  selectedId?: string;
  onSelect: (node: VirtualFile) => void;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return filesystem.filter((n) => n.name.toLowerCase().includes(q)).slice(0, 40);
  }, [query]);

  const root = filesystem.find((n) => n.id === "root")!;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3">
        <label className="relative block">
          <span className="sr-only">Search files</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filesystem"
            className="w-full rounded-md border border-border bg-background py-1.5 pr-2 pl-8 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        </label>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {results ? (
          <ul className="space-y-0.5">
            {results.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => onSelect(node)}
                  className="w-full rounded-md px-2 py-1.5 text-left font-mono text-xs text-muted-foreground hover:bg-elevated hover:text-foreground"
                >
                  <span className="block truncate">{node.name}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {node.path}
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <p className="px-2 py-4 text-center font-mono text-xs text-muted-foreground">
                No matches
              </p>
            ) : null}
          </ul>
        ) : (
          <ul role="tree" aria-label="Virtual filesystem">
            <TreeNode
              node={root}
              depth={0}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </ul>
        )}
      </div>
    </div>
  );
}
