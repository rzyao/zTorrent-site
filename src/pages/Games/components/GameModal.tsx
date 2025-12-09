import { Star, Target, Dice5, Zap, Sprout } from 'lucide-react';
import { games } from '../constants';
import { useCheckIn } from '../hooks/useCheckIn';
import { useSpin } from '../hooks/useSpin';
import { useGuess } from '../hooks/useGuess';

export function GameModal({
  selectedGame,
  onClose,
  onNavigateMagicFarm,
}: {
  selectedGame: number;
  onClose: () => void;
  onNavigateMagicFarm?: () => void;
}) {
  const { checkInDone, handleCheckIn } = useCheckIn();
  const { spinning, spinResult, handleSpin } = useSpin();
  const { guess, setGuess, guessResult, handleGuess } = useGuess();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl text-white">{games.find((g) => g.id === selectedGame)?.name}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="p-6">
          {selectedGame === 1 && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <Star className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl text-white mb-4">每日签到</h3>
              <p className="text-neutral-400 mb-8">每天签到可获得 {games[0].reward} 魔力值</p>
              {checkInDone ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-4">
                  <p className="text-green-400 text-lg">✓ 今日已签到</p>
                  <p className="text-neutral-400 text-sm mt-2">获得 {games[0].reward} 魔力值</p>
                </div>
              ) : (
                <button
                  onClick={handleCheckIn}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  立即签到
                </button>
              )}
            </div>
          )}

          {selectedGame === 2 && (
            <div className="text-center py-8">
              <div
                className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center ${spinning ? 'animate-spin' : ''}`}
              >
                <Target className="w-16 h-16 text-amber-400" />
              </div>
              <h3 className="text-2xl text-white mb-4">幸运转盘</h3>
              <p className="text-neutral-400 mb-8">消耗 10 魔力值，转动转盘赢取大奖</p>
              {spinResult !== null && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-4">
                  <p className="text-amber-400 text-lg">🎉 恭喜获得 {spinResult} 魔力值！</p>
                </div>
              )}
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {spinning ? '转动中...' : '开始转动'}
              </button>
            </div>
          )}

          {selectedGame === 3 && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <Dice5 className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl text-white mb-4">猜数字</h3>
              <p className="text-neutral-400 mb-8">猜一个 1-100 之间的数字，猜中获得 {games[2].reward} 魔力值</p>
              {guessResult && (
                <div
                  className={`border rounded-xl p-4 mb-4 ${guessResult.includes('恭喜') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-neutral-800/50 border-neutral-700 text-neutral-300'}`}
                >
                  {guessResult}
                </div>
              )}
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="输入你的猜测 (1-100)"
                  className="flex-1 bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                  min="1"
                  max="100"
                />
                <button
                  onClick={handleGuess}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  猜！
                </button>
              </div>
            </div>
          )}

          {selectedGame === 4 && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <Zap className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl text-white mb-4">答题闯关</h3>
              <p className="text-neutral-400 mb-8">回答PT知识问题，答对一题获得 {games[3].reward} 魔力值</p>
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 mb-6">
                <p className="text-white text-lg mb-4">问题：以下哪个不是PT站点常见的促销活动？</p>
                <div className="space-y-3">
                  {['FREE（免费）', 'HOT（热门）', '2X UP（双倍上传）', 'VIP专享'].map((option, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white hover:border-amber-500/50 hover:bg-neutral-800/50 transition-all text-left"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all">开始答题</button>
            </div>
          )}

          {selectedGame === 5 && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <Sprout className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl text-white mb-4">魔力农场</h3>
              <p className="text-neutral-400 mb-8">种植作物，收获魔力值，经营你的农场</p>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateMagicFarm) onNavigateMagicFarm();
                }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                进入农场
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
