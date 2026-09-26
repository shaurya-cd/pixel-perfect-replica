import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  Eye,
  EyeOff,
  File,
  FileKey,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  MoreVertical,
  Search,
  Terminal,
  TriangleAlert,
  Copy,
  Check,
} from "lucide-react";
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
  showHidden,
  onContextMenu,
}: {
  node: VirtualFile;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId?: string | undefined;
  onSelect: (node: VirtualFile) => void;
  showHidden: boolean;
  onContextMenu: (e: React.MouseEvent, node: VirtualFile) => void;
}) {
  if (node.hidden && !showHidden) return null;

  const isOpen = expanded.has(node.id);
  const Icon = iconFor(node, isOpen);
  const kids = node.type === "folder" ? childrenOf(node.id) : [];

  return (
    <li role="none">
      <div
        role="treeitem"
        aria-expanded={node.type === "folder" ? isOpen : undefined}
        aria-selected={selectedId === node.id}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, node);
        }}
        onClick={() => (node.type === "folder" ? onToggle(node.id) : onSelect(node))}
        style={{ paddingLeft: depth * 12 + 8 }}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-left font-mono text-xs transition-colors select-none",
          selectedId === node.id
            ? "bg-elevated text-foreground"
            : "text-muted-foreground hover:bg-elevated/60 hover:text-foreground",
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
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            node.suspicious ? "text-warning" : "text-muted-foreground group-hover:text-foreground",
          )}
          aria-hidden
        />
        <span className={cn("truncate", node.hidden && "italic text-muted-foreground/80")}>
          {node.name}
        </span>
        {node.hidden && (
          <span className="rounded bg-muted px-1 text-[9px] text-muted-foreground">hidden</span>
        )}
        {node.suspicious ? (
          <TriangleAlert className="ml-auto size-3 shrink-0 text-warning" aria-label="Flagged as suspicious" />
        ) : null}
      </div>

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
              showHidden={showHidden}
              onContextMenu={onContextMenu}
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
  onExpandAll,
  onCollapseAll,
  onRunTerminalCommand,
}: {
  selectedId?: string | undefined;
  onSelect: (node: VirtualFile) => void;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onRunTerminalCommand?: (cmd: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [showHidden, setShowHidden] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: VirtualFile;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return filesystem
      .filter((n) => n.name.toLowerCase().includes(q) || n.path.toLowerCase().includes(q))
      .slice(0, 40);
  }, [query]);

  const root = filesystem.find((n) => n.id === "root")!;

  const handleCopyPath = (path: string) => {
    navigator.clipboard?.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setContextMenu(null);
  };

  return (
    <div className="flex h-full flex-col bg-surface font-sans">
      {/* Header with Search and Toolbar */}
      <div className="space-y-2 border-b border-border p-3">
        <div className="flex items-center justify-between">
          <span className="mono-label flex items-center gap-1.5 text-xs text-foreground">
            <FolderTree className="size-3.5 text-info" />
            FILESYSTEM TREE
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowHidden((v) => !v)}
              title={showHidden ? "Hide dotfiles" : "Show dotfiles"}
              className={cn(
                "rounded p-1 text-xs transition-colors",
                showHidden ? "bg-elevated text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {showHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            </button>
            {onCollapseAll && (
              <button
                type="button"
                onClick={onCollapseAll}
                title="Collapse All"
                className="rounded px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:bg-elevated hover:text-foreground"
              >
                Collapse
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search path or name..."
            className="w-full rounded-md border border-border bg-background py-1.5 pr-2 pl-8 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Tree Content */}
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
                  <div className="flex items-center justify-between">
                    <span className="truncate font-semibold text-foreground">{node.name}</span>
                    {node.suspicious && <TriangleAlert className="size-3 text-warning" />}
                  </div>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {node.path}
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <p className="px-2 py-6 text-center font-mono text-xs text-muted-foreground">
                No matching files found.
              </p>
            )}
          </ul>
        ) : (
          <ul role="tree" aria-label="Virtual filesystem" className="space-y-0.5">
            <TreeNode
              node={root}
              depth={0}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              showHidden={showHidden}
              onContextMenu={(e, node) => {
                setContextMenu({ x: e.clientX, y: e.clientY, node });
              }}
            />
          </ul>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 min-w-44 rounded-md border border-border-strong bg-elevated p-1 shadow-xl animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">
            {contextMenu.node.name}
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect(contextMenu.node);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface"
          >
            <Eye className="size-3.5 text-muted-foreground" />
            Inspect in Viewer
          </button>
          <button
            type="button"
            onClick={() => handleCopyPath(contextMenu.node.path)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface"
          >
            {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5 text-muted-foreground" />}
            Copy Path
          </button>
          {onRunTerminalCommand && (
            <button
              type="button"
              onClick={() => {
                const cmd = contextMenu.node.type === "folder" ? `cd ${contextMenu.node.path}` : `cat ${contextMenu.node.path}`;
                onRunTerminalCommand(cmd);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface"
            >
              <Terminal className="size-3.5 text-muted-foreground" />
              Open in Terminal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
