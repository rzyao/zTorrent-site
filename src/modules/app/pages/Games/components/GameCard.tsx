import type { Game } from "../types";
import { Award } from "lucide-react";
import { getDifficultyColor, getDifficultyText } from "../utils";

export function GameCard({ game, onClick }: { game: Game; onClick: (g: Game) => void }) {
  return (
    <div
      onClick={() => onClick(game)}
      className="group cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-amber-500/50"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20 text-amber-400 transition-transform group-hover:scale-110">
          {game.icon}
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${getDifficultyColor(game.difficulty)}`}
        >
          {getDifficultyText(game.difficulty)}
        </span>
      </div>

      <h3 className="mb-2 text-xl text-white">{game.name}</h3>
      <p className="mb-4 text-sm text-neutral-400">{game.description}</p>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400">{game.reward} 魔力值</span>
        </div>
        <span className="text-xs text-neutral-500">{game.plays.toLocaleString()} 次游玩</span>
      </div>
    </div>
  );
}
