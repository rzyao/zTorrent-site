import { X } from 'lucide-react';
import type { Crop, UserStats } from '../types';

// 中文说明：
// 种子选择弹窗纯展示组件：
// - 接收作物列表与用户状态用于展示与禁用逻辑（不足金币时禁用）
// - 通过回调向外部反馈用户选择的作物 ID
// - 不持有任何页面状态，关闭与种植由上层协调

interface Props {
  open: boolean;
  crops: Crop[];
  userStats: UserStats;
  onClose: () => void;
  onPick: (cropId: string) => void;
}

export function SeedSelector({ open, crops, userStats, onClose, onPick }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white text-xl">选择要种植的作物</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 作物列表栅格 */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => onPick(crop.id)}
              disabled={userStats.coins < crop.price}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200 hover:border-amber-400 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="text-6xl mb-3">{crop.icon}</div>
              <h4 className="text-amber-900 mb-2">{crop.name}</h4>
              <div className="text-xs text-amber-700 space-y-1 text-left">
                <p>💰 价格: {crop.price}</p>
                <p>⏱️ {crop.growTime}分钟</p>
                <p>📈 收益: {crop.sellPrice}</p>
                <p>✨ 经验: +{crop.experience}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SeedSelector;

