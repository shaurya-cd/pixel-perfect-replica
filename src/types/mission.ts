export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type MissionCategory =
  | "Filesystem"
  | "Permissions"
  | "Secrets"
  | "Forensics"
  | "Configuration"
  | "Privilege Escalation";

export interface MissionObjective {
  id: string;
  label: string;
  done: boolean;
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  description: string;
  briefing: string;
  objectiveSummary: string;
  difficulty: Difficulty;
  category: MissionCategory;
  xpReward: number;
  progress: number;
  objectives: MissionObjective[];
  hintsAvailable: number;
  estimatedMinutes: number;
  locked?: boolean;
  completed?: boolean;
}

export type Severity = "low" | "medium" | "high" | "critical";

export interface Finding {
  fileId: string;
  filePath: string;
  vulnerabilityType: string;
  severity: Severity;
  evidence: string;
}

export interface MissionResult {
  missionId: string;
  missionTitle: string;
  findingTitle: string;
  baseXp: number;
  timeBonus: number;
  evidenceBonus: number;
  totalXp: number;
  accuracy: number;
  timeSeconds: number;
}
