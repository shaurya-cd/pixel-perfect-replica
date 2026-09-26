import { achievements } from "@/mock/achievements";
import { filesystem } from "@/mock/filesystem";
import { leaderboards } from "@/mock/leaderboard";
import { missions } from "@/mock/missions";
import { currentPlayer, missionHistory } from "@/mock/users";
import type { VirtualFile } from "@/types/filesystem";
import type { IGameService } from "@/types/game";
import type { Finding, Mission, MissionResult } from "@/types/mission";
import type { Achievement, LeaderboardEntry, LeaderboardScope, MissionHistoryEntry, Player } from "@/types/user";

/**
 * Mock implementation of IGameService.
 * In a production backend setup, replace or wrap this with an ApiGameService
 * making fetch / Axios calls to your real API endpoints.
 */
export class MockGameService implements IGameService {
  async getPlayer(): Promise<Player> {
    return { ...currentPlayer };
  }

  async listMissions(): Promise<Mission[]> {
    return [...missions];
  }

  async getMission(id: string): Promise<Mission | undefined> {
    const mission = missions.find((m) => m.id === id);
    return mission ? { ...mission } : undefined;
  }

  async getFilesystem(_missionId?: string): Promise<VirtualFile[]> {
    return [...filesystem];
  }

  async submitFinding(finding: Finding): Promise<MissionResult> {
    // Simulated calculation based on finding
    const isTargetFile = finding.filePath.includes("database.env") || finding.filePath.includes("sudoers") || finding.filePath.includes("payroll");
    const accuracy = isTargetFile ? 94 : 75;
    const baseXp = 250;
    const timeBonus = 45;
    const evidenceBonus = finding.evidence.length > 20 ? 50 : 25;
    const totalXp = baseXp + timeBonus + evidenceBonus;

    return {
      missionId: "m14",
      missionTitle: "The Exposed Database",
      findingTitle: finding.vulnerabilityType || "Exposed Database Credentials",
      baseXp,
      timeBonus,
      evidenceBonus,
      totalXp,
      accuracy,
      timeSeconds: 402, // 06:42
    };
  }

  async getAchievements(): Promise<Achievement[]> {
    return [...achievements];
  }

  async getLeaderboard(scope: LeaderboardScope): Promise<LeaderboardEntry[]> {
    return [...(leaderboards[scope] ?? leaderboards.global)];
  }

  async getMissionHistory(): Promise<MissionHistoryEntry[]> {
    return [...missionHistory];
  }
}

/**
 * Global singleton instance of GameService.
 * Can be replaced by ApiGameService when backend is ready.
 */
export const gameService: IGameService = new MockGameService();
