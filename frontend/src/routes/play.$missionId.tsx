import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  FileCode,
  FolderTree,
  Lightbulb,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  ShieldAlert,
  Terminal as TerminalIcon,
  Target,
} from "lucide-react";
import { GameHeader } from "@/components/layout/GameHeader";
import { FilesystemTree } from "@/components/game/FilesystemTree";
import { FileViewer } from "@/components/game/FileViewer";
import { MissionPanel } from "@/components/game/MissionPanel";
import { Terminal } from "@/components/game/Terminal";
import { FindingModal } from "@/components/game/FindingModal";
import { HintsModal } from "@/components/game/HintsModal";
import { MissionResultModal } from "@/components/game/MissionResultModal";
import { NotificationToast } from "@/components/common/NotificationToast";
import { filesystem, nodeByPath } from "@/mock/filesystem";
import { missions } from "@/mock/missions";
import { gameService } from "@/services/gameService";
import type { VirtualFile } from "@/types/filesystem";
import type { Finding, Mission, MissionObjective, MissionResult } from "@/types/mission";
import type { GameNotification } from "@/types/game";

export const Route = createFileRoute("/play/$missionId")({
  component: GameWorkspacePage,
});

function GameWorkspacePage() {
  const { missionId } = Route.useParams();
  const navigate = useNavigate();

  const mission: Mission = useMemo(() => {
    return missions.find((m) => m.id === missionId) ?? missions[0]!;
  }, [missionId]);

  // Game Workspace State
  const [selectedFile, setSelectedFile] = useState<VirtualFile | undefined>(() => {
    return filesystem.find((f) => f.path === "/Finance/config/database.env") ?? filesystem.find((f) => f.type === "file");
  });

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(["root", "fin", "fin-cfg", "dev", "hr"]),
  );

  const [cwd, setCwd] = useState("/Finance/config");
  const [timerSeconds, setTimerSeconds] = useState(522); // 08:42
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Layout toggles
  const [showDetails, setShowDetails] = useState(false);
  const [showMissionPanel, setShowMissionPanel] = useState(true);
  const [mobileTab, setMobileTab] = useState<"filesystem" | "viewer" | "mission" | "terminal">("viewer");

  // Modals & Drawers
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [unlockedHintsCount, setUnlockedHintsCount] = useState(0);

  // Objectives State
  const [objectives, setObjectives] = useState<MissionObjective[]>(mission.objectives);

  // Real-time notifications
  const [notifications, setNotifications] = useState<GameNotification[]>([]);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const addNotification = (notif: Omit<GameNotification, "id">) => {
    const id = `notif_${Date.now()}_${Math.random()}`;
    const newNotif = { ...notif, id };
    setNotifications((prev) => [...prev.slice(-3), newNotif]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  };

  const handleSelectFile = (node: VirtualFile) => {
    setSelectedFile(node);
    if (node.type === "folder") {
      setCwd(node.path);
    } else {
      const parentPath = node.path.substring(0, node.path.lastIndexOf("/")) || "/";
      setCwd(parentPath);
      setMobileTab("viewer");

      if (node.suspicious) {
        addNotification({
          type: "warning",
          title: "Suspicious File Opened",
          description: `${node.name} contains potential security vulnerabilities.`,
        });
      }
    }
  };

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleInspect = (file: VirtualFile) => {
    setShowDetails(true);
    addNotification({
      type: "xp",
      title: "File Inspected",
      description: `Analyzed metadata for ${file.name}`,
      xpAmount: 10,
    });

    // Check if an objective is completed by this inspection
    if (file.path.includes("config")) {
      setObjectives((prev) =>
        prev.map((obj) => (obj.id === "o2" ? { ...obj, done: true } : obj)),
      );
    }
  };

  const handleToggleObjective = (id: string) => {
    setObjectives((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = !o.done;
          if (updated) {
            addNotification({
              type: "objective",
              title: "Objective Complete",
              description: o.label,
              xpAmount: 25,
            });
          }
          return { ...o, done: updated };
        }
        return o;
      }),
    );
  };

  const handleOpenPathFromTerminal = (path: string) => {
    const node = nodeByPath(path);
    if (node) {
      setSelectedFile(node);
      setMobileTab("viewer");
    }
  };

  const handleSubmitFinding = async (finding: Finding) => {
    setShowFindingModal(false);
    const result = await gameService.submitFinding(finding);
    setMissionResult(result);
    setShowResultModal(true);

    // Mark remaining objectives as complete
    setObjectives((prev) => prev.map((o) => ({ ...o, done: true })));
  };

  const handleUnlockHint = () => {
    setUnlockedHintsCount((prev) => Math.min(mission.hintsAvailable, prev + 1));
    addNotification({
      type: "info",
      title: "Hint Revealed",
      description: "Review investigation hint guidance.",
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground select-none">
      {/* Investigation Topbar */}
      <GameHeader
        mission={mission}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning((v) => !v)}
        onOpenHints={() => setShowHintsModal(true)}
        onOpenSubmit={() => setShowFindingModal(true)}
        unlockedHintsCount={unlockedHintsCount}
        hintsAvailable={mission.hintsAvailable}
      />

      {/* Mobile Tab Navigation (<lg screens) */}
      <div className="flex border-b border-border bg-surface lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("filesystem")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-colors ${
            mobileTab === "filesystem"
              ? "border-b-2 border-foreground bg-elevated text-foreground font-semibold"
              : "text-muted-foreground"
          }`}
        >
          <FolderTree className="size-3.5" />
          <span>Files</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("viewer")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-colors ${
            mobileTab === "viewer"
              ? "border-b-2 border-foreground bg-elevated text-foreground font-semibold"
              : "text-muted-foreground"
          }`}
        >
          <FileCode className="size-3.5" />
          <span>Viewer</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("mission")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-colors ${
            mobileTab === "mission"
              ? "border-b-2 border-foreground bg-elevated text-foreground font-semibold"
              : "text-muted-foreground"
          }`}
        >
          <Target className="size-3.5" />
          <span>Mission</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("terminal")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-colors ${
            mobileTab === "terminal"
              ? "border-b-2 border-foreground bg-elevated text-foreground font-semibold"
              : "text-muted-foreground"
          }`}
        >
          <TerminalIcon className="size-3.5" />
          <span>Terminal</span>
        </button>
      </div>

      {/* Main Workspace Area */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Top 3-Column Split for Desktop / Active Tab for Mobile */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Panel 1: Filesystem Tree */}
          <section
            aria-label="Filesystem tree"
            className={`w-full shrink-0 border-r border-border lg:block lg:w-72 xl:w-80 ${
              mobileTab === "filesystem" ? "block" : "hidden"
            }`}
          >
            <FilesystemTree
              selectedId={selectedFile?.id}
              onSelect={handleSelectFile}
              expanded={expandedFolders}
              onToggle={handleToggleFolder}
              onCollapseAll={() => setExpandedFolders(new Set(["root"]))}
              onRunTerminalCommand={(cmd) => {
                setCwd(selectedFile?.path || "/");
                setMobileTab("terminal");
              }}
            />
          </section>

          {/* Panel 2: File Viewer + Details Drawer */}
          <section
            aria-label="File viewer"
            className={`flex-1 overflow-hidden lg:block ${
              mobileTab === "viewer" ? "block" : "hidden"
            }`}
          >
            <FileViewer
              file={selectedFile}
              showDetails={showDetails}
              onToggleDetails={() => setShowDetails((v) => !v)}
              onInspect={handleInspect}
              onSelectEvidenceLine={(line) => {
                addNotification({
                  type: "info",
                  title: "Line Selected for Evidence",
                  description: line.slice(0, 45),
                });
              }}
            />
          </section>

          {/* Panel 3: Mission & Objectives Panel */}
          {showMissionPanel && (
            <aside
              aria-label="Mission objectives"
              className={`w-full shrink-0 border-l border-border lg:block lg:w-80 xl:w-96 ${
                mobileTab === "mission" ? "block" : "hidden"
              }`}
            >
              <MissionPanel
                mission={mission}
                objectives={objectives}
                onToggleObjective={handleToggleObjective}
                onOpenHints={() => setShowHintsModal(true)}
                onOpenSubmit={() => setShowFindingModal(true)}
                unlockedHintsCount={unlockedHintsCount}
              />
            </aside>
          )}
        </div>

        {/* Bottom Panel: Interactive Terminal */}
        <section
          aria-label="Interactive terminal"
          className={`h-48 shrink-0 border-t border-border lg:block lg:h-56 ${
            mobileTab === "terminal" ? "block h-full" : "hidden"
          }`}
        >
          <Terminal
            cwd={cwd}
            onCwdChange={setCwd}
            onOpenPath={handleOpenPathFromTerminal}
          />
        </section>
      </div>

      {/* Finding Submission Modal */}
      <FindingModal
        isOpen={showFindingModal}
        onClose={() => setShowFindingModal(false)}
        initialFile={selectedFile}
        onSubmit={handleSubmitFinding}
      />

      {/* Hints Modal */}
      <HintsModal
        isOpen={showHintsModal}
        onClose={() => setShowHintsModal(false)}
        mission={mission}
        unlockedCount={unlockedHintsCount}
        onUnlockHint={handleUnlockHint}
      />

      {/* Mission Result Victory Modal */}
      <MissionResultModal
        isOpen={showResultModal}
        result={missionResult}
        onClose={() => setShowResultModal(false)}
        onNextMission={() => navigate({ to: "/missions" })}
      />

      {/* Feedback Toasts */}
      <NotificationToast
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />
    </div>
  );
}
