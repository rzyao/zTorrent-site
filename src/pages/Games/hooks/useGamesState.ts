import { useState } from 'react';
import type { Game, UserStats } from '../types';

export function useGamesState(onNavigateMagicFarm?: () => void) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [userStats] = useState<UserStats>({
    totalPlays: 234,
    totalRewards: 15680,
    rank: 42,
    level: 12,
  });

  const handleGameClick = (game: Game) => {
    if (game.route === 'magicfarm' && onNavigateMagicFarm) {
      onNavigateMagicFarm();
    } else {
      setSelectedGame(game.id);
    }
  };

  return { selectedGame, setSelectedGame, userStats, handleGameClick };
}
