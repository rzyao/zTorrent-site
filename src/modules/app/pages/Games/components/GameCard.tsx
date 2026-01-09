import type { Game } from '../types';
import { Award } from 'lucide-react';
import { getDifficultyColor, getDifficultyText } from '.@/utils/cn';

export function GameCard({ game, onClick }: { game: Game; onClick: (g: Game) => void }) {
  return (
    <div
      onClick={() => onClick(game)}
      className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-amber-500/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
          {game.icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs border ${getDifficultyColor(game.difficulty)}`}>
          {getDifficultyText(game.difficulty)}
        </span>
      </div>

      <h3 className="text-xl text-white mb-2">{game.name}</h3>
      <p className="text-sm text-neutral-400 mb-4">{game.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400">{game.reward} 魔力值</span>
        </div>
        <span className="text-xs text-neutral-500">{game.plays.toLocaleString()} 次游玩</span>
      </div>
    </div>
  );
}
