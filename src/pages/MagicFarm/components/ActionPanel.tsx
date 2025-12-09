import { X } from 'lucide-react';
import type { PanelType, Crop, WarehouseItem, Task, UserStats } from '../types';

// 中文说明：
// 右侧动作面板纯展示组件，依据 activePanel 渲染不同内容：
// - shop：展示可购买的种子列表，并通过 onBuySeed 回调向外部发起购买/选择动作
// - warehouse：展示仓库物品与出售按钮（保持原页面无实际逻辑，可提供回调）
// - friends：展示好友列表与操作按钮（示例 UI，与原页面一致，不含业务）
// - tasks：展示任务进度
// 组件内部不管理状态，所有数据与交互通过 props 完成。

interface Props {
  activePanel: PanelType;
  onClose: () => void;
  crops: Crop[];
  warehouse: WarehouseItem[];
  tasks: Task[];
  userStats: UserStats;
  onBuySeed?: (cropId: string) => void;
  onSellAll?: (cropId: string) => void;
}

export function ActionPanel({ activePanel, onClose, crops, warehouse, tasks, userStats, onBuySeed, onSellAll }: Props) {
  if (activePanel === 'none') return null;

  return (
    <div className="w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-400 p-6 max-h-[700px] overflow-y-auto">
      {/* 面板标题与关闭按钮 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl text-amber-900">
          {activePanel === 'shop' && '🛒 种子商店'}
          {activePanel === 'warehouse' && '📦 我的仓库'}
          {activePanel === 'friends' && '👥 好友农场'}
          {activePanel === 'tasks' && '🎯 任务列表'}
        </h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 商店内容 */}
      {activePanel === 'shop' && (
        <div className="space-y-4">
          {crops.map(crop => (
            <div key={crop.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 hover:border-amber-400 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{crop.icon}</div>
                <div className="flex-1">
                  <h4 className="text-amber-900 mb-1">{crop.name}</h4>
                  <div className="text-xs text-amber-700 space-y-0.5">
                    <p>💰 购买: {crop.price} | 出售: {crop.sellPrice}</p>
                    <p>⏱️ 成长: {crop.growTime}分钟 | 💧 需水: {crop.waterNeeded}%</p>
                    <p>✨ 经验: +{crop.experience}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onBuySeed && onBuySeed(crop.id)}
                disabled={userStats.coins < crop.price}
                className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                购买种子
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 仓库内容 */}
      {activePanel === 'warehouse' && (
        <div className="space-y-4">
          <div className="bg-amber-100 rounded-lg p-3 border border-amber-300">
            <p className="text-amber-900 text-sm">仓库容量: {warehouse.reduce((sum, item) => sum + item.count, 0)}/200</p>
          </div>
          {warehouse.map(item => {
            const crop = crops.find(c => c.id === item.cropId);
            if (!crop) return null;
            return (
              <div key={item.cropId} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{crop.icon}</div>
                    <div>
                      <h4 className="text-green-900">{crop.name}</h4>
                      <p className="text-sm text-green-700">数量: {item.count}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 text-sm">出售价</p>
                    <p className="text-green-900">{crop.sellPrice}</p>
                  </div>
                </div>
                <button
                  onClick={() => onSellAll && onSellAll(item.cropId)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all"
                >
                  出售 (+{crop.sellPrice * item.count})
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 好友内容（示例数据，与原页面一致） */}
      {activePanel === 'friends' && (
        <div className="space-y-4">
          {['MovieMaster', 'CinemaFan', 'TorrentKing'].map((friend, idx) => (
            <div key={friend} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">👨‍🌾</div>
                <div className="flex-1">
                  <h4 className="text-blue-900">{friend}</h4>
                  <p className="text-sm text-blue-700">Lv.{10 + idx * 3}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-green-500">{3 + idx}</p>
                  <p className="text-xs text-blue-700">可收获</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all">💧 浇水</button>
                <button className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm transition-all">🤲 偷菜</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 任务内容 */}
      {activePanel === 'tasks' && (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-purple-900 mb-1">{task.title}</h4>
                  <p className="text-sm text-purple-700">{task.description}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-amber-600">💰 {task.reward}</p>
                  <p className="text-blue-600">✨ {task.expReward}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${(task.progress / task.target) * 100}%` }} />
                </div>
                <span className="text-xs text-purple-700">{task.progress}/{task.target}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActionPanel;

