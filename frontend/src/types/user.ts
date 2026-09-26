export interface PlayerStats {
  missionsCompleted: number;
  vulnerabilitiesFound: number;
  accuracy: number;
  streakDays: number;
}

export interface Player {
  id: string;
  username: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: PlayerStats;
  joinedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  goal?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  missions: number;
  isCurrentPlayer?: boolean;
}

export type LeaderboardScope = "global" | "weekly" | "monthly" | "friends";

export interface MissionHistoryEntry {
  id: string;
  missionTitle: string;
  category: string;
  xp: number;
  accuracy: number;
  completedAt: string;
}
