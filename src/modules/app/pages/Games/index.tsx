import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { GameCard } from './components/GameCard';
import { GameModal } from './components/GameModal';
import { games } from './constants';
import { useGamesState } from './hooks/useGamesState';
import type { GamesPageProps } from './types';

export default function GamesPage({ onNavigateMagicFarm }: GamesPageProps) {
  const { selectedGame, setSelectedGame, userStats, handleGameClick } = useGamesState(onNavigateMagicFarm);

  return (
    <div className="min-h-screen bg-[#0F171E] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1920px] mx-auto">
        <Header />
        <StatsCards userStats={userStats} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {games.map((game) => (
            <GameCard key={game.id} game={game} onClick={handleGameClick} />
          ))}
        </div>

        {selectedGame && (
          <GameModal
            selectedGame={selectedGame}
            onClose={() => setSelectedGame(null)}
            onNavigateMagicFarm={onNavigateMagicFarm}
          />
        )}

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl text-white mb-4 flex items-center gap-2">游戏规则</h2>
          <div className="space-y-3 text-neutral-300">
            <p>• 通过参与游戏可以获得魔力值奖励</p>
            <p>• 每日签到每天只能签到一次</p>
            <p>• 幸运转盘和猜数字游戏每天有次数限制</p>
            <p>• 答题闯关难度越高，奖励越丰富</p>
            <p>• 获得的魔力值可用于兑换上传流量、VIP等级等</p>
            <p>• 作弊或使用外挂将被永久封禁</p>
          </div>
        </div>
      </div>
    </div>
  );
}
