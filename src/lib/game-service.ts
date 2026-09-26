import { achievements } from "@/mock/achievements";
import { filesystem } from "@/mock/filesystem";
import { leaderboards } from "@/mock/leaderboard";
import { missions } from "@/mock/missions";
import { currentPlayer, missionHistory } from "@/mock/users";
import type { VirtualFile } from "@/types/filesystem";
import type { Finding, Mission, MissionResult } from "@/types/mission";
import type {
  Achievement,
  LeaderboardEntry,
  LeaderboardScope,
  MissionHistoryEntry,
  Player,
} from "@/types/user";

/**
 * The only contract the UI depends on.
 * Swap MockGameService for an ApiGameService without touching components.
 */
export interface GameService {
  getPlayer(): Promise<Player>;
  getMissions(): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  getFilesystem(missionId: string): Promise<VirtualFile[]>;
  getAchievements(): Promise<Achievement[]>;
  getLeaderboard(scope: LeaderboardScope): Promise<LeaderboardEntry[]>;
  getMissionHistory(): Promise<MissionHistoryEntry[]>;
  submitFinding(missionId: string, finding: Finding): Promise<MissionResult>;
}

const latency = (ms = 180) => new Promise((r) => setTimeout(r, ms));

class MockGameService implements GameService {
  async getPlayer() {
    await latency();
    return currentPlayer;
  }

  async getMissions() {
    await latency();
    return missions;
  }

  async getMission(id: string) {
    await latency();
    return missions.find((m) => m.id === id);
  }

  async getFilesystem(_missionId: string) {
    await latency();
    return filesystem;
  }

  async getAchievements() {
    await latency();
    return achievements;
  }

  async getLeaderboard(scope: LeaderboardScope) {
    await latency();
    return leaderboards[scope];
  }

  async getMissionHistory() {
    await latency();
    return missionHistory;
  }

  async submitFinding(missionId: string, finding: Finding): Promise<MissionResult> {
    await latency(700);
    const mission = missions.find((m) => m.id === missionId);
    const base = mission?.xpReward ?? 200;
    const evidenceBonus = Math.min(50, Math.round(finding.evidence.trim().length / 4));
    const timeBonus = 45;
    return {
      missionId,
      missionTitle: mission?.title ?? "Investigation",
      findingTitle: finding.vulnerabilityType,
      baseXp: base,
      timeBonus,
      evidenceBonus,
      totalXp: base + timeBonus + evidenceBonus,
      accuracy: 94,
      timeSeconds: 402,
    };
  }
}

export const gameService: GameService = new MockGameService();

export const queryKeys = {
  player: ["player"] as const,
  missions: ["missions"] as const,
  mission: (id: string) => ["mission", id] as const,
  filesystem: (id: string) => ["filesystem", id] as const,
  achievements: ["achievements"] as const,
  leaderboard: (scope: LeaderboardScope) => ["leaderboard", scope] as const,
  history: ["mission-history"] as const,
};
