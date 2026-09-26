import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  KeyRound,
  RotateCcw,
  Save,
  Server,
  Settings,
  Sliders,
  Terminal,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  // Preferences State
  const [terminalFontSize, setTerminalFontSize] = useState<"sm" | "base" | "lg">("sm");
  const [terminalTheme, setTerminalTheme] = useState<"charcoal" | "matrix" | "amber">("charcoal");
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [showHiddenFiles, setShowHiddenFiles] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // API Backend Hookup State
  const [apiMode, setApiMode] = useState<"mock" | "remote">("mock");
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api/v1");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success">("idle");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestConnection = () => {
    setConnectionStatus("testing");
    setTimeout(() => {
      setConnectionStatus("success");
      setTimeout(() => setConnectionStatus("idle"), 3000);
    }, 600);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AppShell
      title="Platform Settings & Preferences"
      description="Configure workspace typography, terminal aesthetics, and backend integration endpoints."
    >
      <div className="max-w-4xl space-y-8">
        {/* Workspace Display & Terminal */}
        <section className="panel space-y-6 p-6">
          <div className="border-b border-border pb-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Terminal className="size-4 text-info" />
              Terminal & Code Viewer Preferences
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Customize shell appearance and file viewing behavior.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="mono-label block text-xs">Terminal Font Size</label>
              <div className="flex gap-2">
                {[
                  { id: "sm", label: "Compact (11px)" },
                  { id: "base", label: "Standard (12px)" },
                  { id: "lg", label: "Large (14px)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTerminalFontSize(s.id as typeof terminalFontSize)}
                    className={`flex-1 rounded-md border py-2 font-mono text-xs transition-colors ${
                      terminalFontSize === s.id
                        ? "border-foreground bg-elevated text-foreground font-bold"
                        : "border-border text-muted-foreground hover:bg-elevated hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Palette */}
            <div className="space-y-2">
              <label className="mono-label block text-xs">Terminal Color Theme</label>
              <div className="flex gap-2">
                {[
                  { id: "charcoal", label: "Charcoal Dark", color: "bg-background" },
                  { id: "matrix", label: "Matrix Green", color: "bg-emerald-950" },
                  { id: "amber", label: "Amber Phosphor", color: "bg-amber-950" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTerminalTheme(t.id as typeof terminalTheme)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border py-2 font-mono text-xs transition-colors ${
                      terminalTheme === t.id
                        ? "border-foreground bg-elevated text-foreground font-bold"
                        : "border-border text-muted-foreground hover:bg-elevated hover:text-foreground"
                    }`}
                  >
                    <span className={`size-2 rounded-full ${t.color}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-3.5 hover:bg-elevated/40">
              <div>
                <span className="font-mono text-xs font-semibold text-foreground">
                  Mask Secrets in File Viewer
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Automatically obscure passwords and private tokens (••••••••••) to simulate real investigation challenge.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maskSecrets}
                onChange={(e) => setMaskSecrets(e.target.checked)}
                className="size-4 rounded border-border bg-background text-foreground"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-3.5 hover:bg-elevated/40">
              <div>
                <span className="font-mono text-xs font-semibold text-foreground">
                  Show Hidden Files (.dotfiles) by Default
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Render hidden directories like .ssh_backup and .env files in the filesystem explorer.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showHiddenFiles}
                onChange={(e) => setShowHiddenFiles(e.target.checked)}
                className="size-4 rounded border-border bg-background text-foreground"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-3.5 hover:bg-elevated/40">
              <div>
                <span className="font-mono text-xs font-semibold text-foreground">
                  Simulated Audio & Keystroke FX
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Play subtle micro-audio cues on terminal execution, finding submission, and XP gain.
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="size-4 rounded border-border bg-background text-foreground"
              />
            </label>
          </div>
        </section>

        {/* Backend & API Integration Architecture */}
        <section className="panel space-y-6 p-6">
          <div className="border-b border-border pb-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Server className="size-4 text-success" />
              API Service Integration Architecture
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Configure the frontend data provider. The UI is decoupled from the backend via <code className="rounded bg-elevated px-1 text-foreground">IGameService</code>.
            </p>
          </div>

          <div className="space-y-4">
            {/* Mode selector */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setApiMode("mock")}
                className={`panel p-4 text-left transition-colors ${
                  apiMode === "mock"
                    ? "border-foreground bg-elevated"
                    : "border-border bg-background hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-foreground">
                    Mock Game Service (Active)
                  </span>
                  {apiMode === "mock" && <Check className="size-4 text-success" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Runs self-contained mock filesystem data, mission state, and terminal simulator in-browser.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setApiMode("remote")}
                className={`panel p-4 text-left transition-colors ${
                  apiMode === "remote"
                    ? "border-foreground bg-elevated"
                    : "border-border bg-background hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-foreground">
                    Remote Backend API
                  </span>
                  {apiMode === "remote" && <Check className="size-4 text-success" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Directs service calls to your custom backend REST/GraphQL/WebSocket server.
                </p>
              </button>
            </div>

            {/* Custom URL Input */}
            {apiMode === "remote" && (
              <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                <label htmlFor="api-url" className="mono-label block text-xs">
                  Remote Backend API Base URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="api-url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:8000/api/v1"
                    className="flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground focus-visible:border-ring focus-visible:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={connectionStatus === "testing"}
                    className="rounded-md border border-border bg-elevated px-4 py-2 font-mono text-xs text-foreground hover:bg-muted"
                  >
                    {connectionStatus === "testing" ? "Pinging..." : connectionStatus === "success" ? "Online ✓" : "Test Ping"}
                  </button>
                </div>
                {connectionStatus === "success" && (
                  <p className="text-xs text-success flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    Mock handshake succeeded. Ready for ApiGameService adapter.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setMaskSecrets(true);
              setShowHiddenFiles(true);
              setTerminalFontSize("sm");
              setTerminalTheme("charcoal");
            }}
            className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 font-mono text-xs text-muted-foreground hover:bg-elevated hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="font-mono text-xs text-success flex items-center gap-1">
                <Check className="size-3.5" /> Settings Saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2 font-mono text-xs font-bold text-background uppercase transition-opacity hover:opacity-90"
            >
              <Save className="size-3.5" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
