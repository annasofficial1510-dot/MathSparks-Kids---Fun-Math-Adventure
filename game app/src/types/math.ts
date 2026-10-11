/**
 * Core type definitions for MathSparks Kids
 */

export type GameType = 
  | 'counting'
  | 'addition'
  | 'subtraction'
  | 'comparison'
  | 'patterns'
  | 'sprint';

export type MascotId = 'lion' | 'bunny' | 'robot' | 'unicorn' | 'bear';

export type AccessoryId = 
  | 'none'
  | 'party_hat'
  | 'crown'
  | 'wizard_hat'
  | 'super_cape'
  | 'cool_sunglasses'
  | 'astronaut_helmet'
  | 'flower_crown';

export interface Accessory {
  id: AccessoryId;
  name: string;
  cost: number;
  emoji: string;
  description: string;
  category: 'hat' | 'glasses' | 'cape';
}

export type DifficultyLevel = 1 | 2 | 3; // 1 = Sprout (Ages 3-5), 2 = Explorer (Ages 6-7), 3 = Wizard (Ages 8+)
export type DifficultyMode = 'adaptive' | 'level1' | 'level2' | 'level3';

export interface SkillProficiency {
  counting: number; // 0 - 100
  addition: number; // 0 - 100
  subtraction: number; // 0 - 100
  comparison: number; // 0 - 100
  patterns: number; // 0 - 100
}

export interface SkillStreaks {
  counting: number;
  addition: number;
  subtraction: number;
  comparison: number;
  patterns: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'mastery' | 'explorer';
  unlocked: boolean;
  unlockedAt?: string;
  criteriaText: string;
}

export interface GameSessionLog {
  id: string;
  timestamp: string;
  gameType: GameType;
  gameName: string;
  totalQuestions: number;
  correctAnswers: number;
  starsEarned: number;
  durationSeconds: number;
  difficultyLevel: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  mascot: MascotId;
  equippedAccessory: AccessoryId;
  unlockedAccessories: AccessoryId[];
  stars: number;
  coins: number;
  totalSolved: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  difficultyMode: DifficultyMode;
  skillProficiency: SkillProficiency;
  skillStreaks: SkillStreaks;
  badges: Badge[];
  history: GameSessionLog[];
  soundEnabled: boolean;
  createdAt: string;
}

export interface MathQuestion {
  id: string;
  type: GameType;
  prompt: string;
  subPrompt?: string;
  visualData?: any; // Item type, counts, graphics
  options: (number | string)[];
  correctAnswer: number | string;
  hint?: string;
  level: number;
}
