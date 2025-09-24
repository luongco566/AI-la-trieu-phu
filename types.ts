
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type QuestionStatus = "draft" | "verified" | "flagged";

export type Question = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  domain?: string;
  tags?: string[];
  status?: QuestionStatus;
  source?: string;
  editorLog?: { at: string; by: string; action: string; note?: string }[];
  variants?: { 
    createdAt: string;
    items: { question: string; choices: string[]; correctIndex: number }[];
  };
};

export type Player = {
  id: number;
  name: string;
  questionIndex: number; 
  isFinished: boolean;
  finalPrize: number;
};

export type GameMode = 'classic' | 'daily' | 'host';

export type GameSettings = {
  numPlayers: number;
  playerNames: string[];
  topic: string;
  difficulty: Difficulty;
  numQuestions: number;
  timePerQuestion: number;
  gameMode: GameMode;
};

export type GameState = 'SETUP' | 'LOADING' | 'PLAYING' | 'GAME_OVER' | 'LEADERBOARD' | 'MAIN_MENU' | 'DAILY_CHALLENGE' | 'PROFILE';

export type LeaderboardEntry = {
    name: string;
    score: number;
    date: string;
};

export type LifelineState = {
  fiftyFifty: boolean;
  audience: boolean;
  hint: boolean;
};

export enum AnswerState {
    UNSELECTED,
    SELECTED,
    CONFIRMED_CORRECT,
    CONFIRMED_WRONG,
}

export type AnswerEvent = {
  at: string;
  userId: string;
  questionId: string;
  chosenIndex: number;
  correct: boolean;
  timeMs: number;
  mode: GameMode;
  domain?: string;
};

export type Cosmetic = { 
  id: string; 
  type: "avatar"; 
  name: string; 
  levelReq: number; 
  asset: string; // URL or identifier
};

export type UserProfile = { 
  id: string; 
  name: string;
  level: number; 
  xp: number; 
  coins: number; 
  ownedCosmetics: string[]; 
  equippedCosmetics: {
    avatar?: string; 
  };
};

export type McLines = {
  intro: string[];
  next_question: string[];
  lifeline: string[];
  correct: string[];
  wrong: string[];
  milestone: string[];
  timer_warning: string[];
  timeout: string[];
  win: string[];
};
