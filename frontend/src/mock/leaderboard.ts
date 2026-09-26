import type { LeaderboardEntry, LeaderboardScope } from "@/types/user";

const global: LeaderboardEntry[] = [
  { rank: 1, username: "ShadowFox", level: 34, xp: 52340, missions: 210 },
  { rank: 2, username: "CyberNinja", level: 32, xp: 49210, missions: 198 },
  { rank: 3, username: "RootHunter", level: 31, xp: 46890, missions: 187 },
  { rank: 4, username: "SHAURYA", level: 12, xp: 45120, missions: 47, isCurrentPlayer: true },
  { rank: 5, username: "nullbyte", level: 29, xp: 43870, missions: 176 },
  { rank: 6, username: "Ciphercat", level: 28, xp: 41220, missions: 165 },
  { rank: 7, username: "packetstorm", level: 27, xp: 39980, missions: 160 },
  { rank: 8, username: "grep_master", level: 26, xp: 37440, missions: 151 },
  { rank: 9, username: "0xFalcon", level: 25, xp: 35110, missions: 144 },
  { rank: 10, username: "SaltedHash", level: 24, xp: 33020, missions: 139 },
];

const weekly: LeaderboardEntry[] = [
  { rank: 1, username: "SHAURYA", level: 12, xp: 3040, missions: 9, isCurrentPlayer: true },
  { rank: 2, username: "CyberNinja", level: 32, xp: 2890, missions: 8 },
  { rank: 3, username: "grep_master", level: 26, xp: 2610, missions: 7 },
  { rank: 4, username: "nullbyte", level: 29, xp: 2380, missions: 7 },
  { rank: 5, username: "ShadowFox", level: 34, xp: 2100, missions: 6 },
];

const monthly: LeaderboardEntry[] = [
  { rank: 1, username: "ShadowFox", level: 34, xp: 11420, missions: 38 },
  { rank: 2, username: "SHAURYA", level: 12, xp: 10870, missions: 33, isCurrentPlayer: true },
  { rank: 3, username: "Ciphercat", level: 28, xp: 9940, missions: 31 },
  { rank: 4, username: "RootHunter", level: 31, xp: 9330, missions: 29 },
  { rank: 5, username: "0xFalcon", level: 25, xp: 8710, missions: 27 },
];

const friends: LeaderboardEntry[] = [
  { rank: 1, username: "Ciphercat", level: 28, xp: 41220, missions: 165 },
  { rank: 2, username: "SHAURYA", level: 12, xp: 45120, missions: 47, isCurrentPlayer: true },
  { rank: 3, username: "byteknight", level: 11, xp: 7980, missions: 41 },
  { rank: 4, username: "logrotate", level: 9, xp: 5410, missions: 30 },
];

export const leaderboards: Record<LeaderboardScope, LeaderboardEntry[]> = {
  global,
  weekly,
  monthly,
  friends,
};
