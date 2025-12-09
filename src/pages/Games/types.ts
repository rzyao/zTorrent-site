export interface GamesPageProps {
  onNavigateMagicFarm?: () => void;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Game {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  reward: number;
  difficulty: Difficulty;
  plays: number;
  highScore: number;
  route?: string;
}

export interface UserStats {
  totalPlays: number;
  totalRewards: number;
  rank: number;
  level: number;
}
