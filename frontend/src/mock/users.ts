import type { MissionHistoryEntry, Player } from "@/types/user";

export const currentPlayer: Player = {
  id: "u_001",
  username: "SHAURYA",
  title: "Security Investigator",
  level: 12,
  xp: 8450,
  xpToNextLevel: 10000,
  stats: {
    missionsCompleted: 47,
    vulnerabilitiesFound: 123,
    accuracy: 91,
    streakDays: 7,
  },
  joinedAt: "2026-02-14",
};

export const missionHistory: MissionHistoryEntry[] = [
  {
    id: "h1",
    missionTitle: "The Exposed Database",
    category: "Secrets",
    xp: 345,
    accuracy: 94,
    completedAt: "2026-09-25",
  },
  {
    id: "h2",
    missionTitle: "World-Writable Payroll",
    category: "Permissions",
    xp: 280,
    accuracy: 88,
    completedAt: "2026-09-24",
  },
  {
    id: "h3",
    missionTitle: "Ghost in the Log Files",
    category: "Forensics",
    xp: 410,
    accuracy: 97,
    completedAt: "2026-09-22",
  },
  {
    id: "h4",
    missionTitle: "Backup Left Behind",
    category: "Filesystem",
    xp: 190,
    accuracy: 82,
    completedAt: "2026-09-20",
  },
  {
    id: "h5",
    missionTitle: "Sudo Without Limits",
    category: "Privilege Escalation",
    xp: 520,
    accuracy: 90,
    completedAt: "2026-09-18",
  },
];

export const weeklyActivity = [
  { day: "Mon", xp: 420 },
  { day: "Tue", xp: 180 },
  { day: "Wed", xp: 640 },
  { day: "Thu", xp: 300 },
  { day: "Fri", xp: 720 },
  { day: "Sat", xp: 510 },
  { day: "Sun", xp: 260 },
];
