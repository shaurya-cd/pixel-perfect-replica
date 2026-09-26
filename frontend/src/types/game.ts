import type { VirtualFile } from "./filesystem";
import type { Finding, Mission, MissionResult } from "./mission";
import type { Achievement, LeaderboardEntry, LeaderboardScope, MissionHistoryEntry, Player } from "./user";

export interface GameSettings {
  soundEnabled: boolean;
  maskSecrets: boolean;
  showHiddenFiles: boolean;
  terminalFontSize: "sm" | "base" | "lg";
  terminalTheme: "charcoal" | "matrix" | "amber" | "cyberpunk";
  autoInspectOnSelect: boolean;
  apiMode: "mock" | "remote";
  remoteApiUrl: string;
}

export interface IGameService {
  getPlayer(): Promise<Player>;
  listMissions(): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  getFilesystem(missionId?: string): Promise<VirtualFile[]>;
  submitFinding(finding: Finding): Promise<MissionResult>;
  getAchievements(): Promise<Achievement[]>;
  getLeaderboard(scope: LeaderboardScope): Promise<LeaderboardEntry[]>;
  getMissionHistory(): Promise<MissionHistoryEntry[]>;
}

export interface GameNotification {
  id: string;
  type: "xp" | "objective" | "warning" | "info";
  title: string;
  description?: string;
  xpAmount?: number;
}
