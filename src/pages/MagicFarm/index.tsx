import { Sun, ShoppingCart, Package, Users, Target, Home } from 'lucide-react';
import { useMagicFarm } from './hooks/useMagicFarm';
import { useSeeds } from './hooks/useSeeds';
import { useTransactions } from './hooks/useTransactions';
import FarmHeader from './components/FarmHeader';
import GardenGrid from './components/GardenGrid';
import ActionPanel from './components/ActionPanel';
import SeedSelector from './components/SeedSelector';
import TransactionModal from './components/TransactionModal';

// 中文说明：
// MagicFarmPage（页面容器）负责将各层（逻辑 Hook 与纯 UI 组件）进行组合：
// - 从 useMagicFarm 获取用户状态、地块数据、任务与基本行为（浇水、收获、面板切换）
// - 从 useSeeds 获取作物列表与种植弹窗控制，并在点击空地或商店购买时打开选择器
// - 从 useTransactions 获取仓库与交易弹窗，用于出售确认（保持原页面功能为可选）
// 页面层不直接实现业务细节，仅进行“何时调用哪个 Hook 的哪个方法”的编排，保证关注点分离。

export function MagicFarmPage() {
  // 1) 获取核心农场状态与动作
  const farm = useMagicFarm();

  // 2) 基于核心状态，获取种子/作物选择逻辑
  const seeds = useSeeds({
    plots: farm.plots,
    setPlots: farm.setPlots,
    userStats: farm.userStats,
    setUserStats: farm.setUserStats,
  });

  // 3) 获取交易逻辑（仓库/出售确认），与作物列表关联
  const tx = useTransactions({
    userStats: farm.userStats,
    setUserStats: farm.setUserStats,
    crops: seeds.crops,
  });

  // 点击地块的页面编排逻辑：
  // - 锁定：忽略
  // - 空地：打开种子选择弹窗并记录目标地块
  // - 成熟：收获（需要作物出售价与经验值，从 crops 中读取）
  // - 其它：浇水
  const onPlotClick = (plot: typeof farm.plots[number]) => {
    if (plot.isLocked) return;
    if (plot.stage === 'empty') {
      seeds.openSelector(plot.id);
      return;
    }
    if (plot.stage === 'mature') {
      const crop = seeds.crops.find(c => c.id === plot.cropType);
      if (!crop) return;
      farm.harvestPlot(plot.id, crop.sellPrice, crop.experience);
      return;
    }
    farm.waterPlot(plot.id);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-400 via-sky-300 to-green-200 overflow-hidden">
      {/* 天空与云朵背景（保持原页面视觉） */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-20 bg-white/40 rounded-full blur-xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-40 h-24 bg-white/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-36 h-22 bg-white/35 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* 太阳图标光晕效果 */}
      <div className="fixed top-24 right-12 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_60px_20px_rgba(253,224,71,0.6)] animate-pulse pointer-events-none z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun className="w-12 h-12 text-yellow-500" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative">
        {/* 顶部头部区域：用户状态与天气 */}
        <FarmHeader userStats={farm.userStats} />

        <div className="flex gap-6">
          {/* 左侧工具栏：切换右侧面板 */}
          <div className="w-20 space-y-3">
            <button
              onClick={() => farm.togglePanel('shop')}
              className={`w-full aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 transition-all ${farm.activePanel === 'shop' ? 'bg-linear-to-br from-amber-500 to-orange-600 text-white scale-105' : 'bg-white/90 text-amber-900 hover:scale-105'}`}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs">商店</span>
            </button>
            <button
              onClick={() => farm.togglePanel('warehouse')}
              className={`w-full aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 transition-all ${farm.activePanel === 'warehouse' ? 'bg-linear-to-br from-amber-500 to-orange-600 text-white scale-105' : 'bg-white/90 text-amber-900 hover:scale-105'}`}
            >
              <Package className="w-6 h-6" />
              <span className="text-xs">仓库</span>
            </button>
            <button
              onClick={() => farm.togglePanel('friends')}
              className={`w-full aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 transition-all ${farm.activePanel === 'friends' ? 'bg-linear-to-br from-amber-500 to-orange-600 text-white scale-105' : 'bg-white/90 text-amber-900 hover:scale-105'}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">好友</span>
            </button>
            <button
              onClick={() => farm.togglePanel('tasks')}
              className={`w-full aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 transition-all ${farm.activePanel === 'tasks' ? 'bg-linear-to-br from-amber-500 to-orange-600 text-white scale-105' : 'bg-white/90 text-amber-900 hover:scale-105'}`}
            >
              <Target className="w-6 h-6" />
              <span className="text-xs">任务</span>
            </button>
          </div>

          {/* 中间农场区域（草地背景与建筑） */}
          <div className="flex-1 relative">
            {/* 农场建筑物（仓库屋顶与门） */}
            <div className="absolute -top-8 left-8 z-20">
              <div className="relative">
                <div className="bg-linear-to-b from-red-600 to-red-800 rounded-t-2xl w-32 h-24 border-4 border-red-900 shadow-2xl relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-16 bg-amber-800 rounded border-2 border-amber-900"></div>
                  <div className="absolute top-0 -right-2 w-8 h-8 bg-yellow-100 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                    <Home className="w-4 h-4 text-amber-900" />
                  </div>
                </div>
                <div className="bg-linear-to-b from-amber-700 to-amber-900 h-4 rounded-b border-4 border-t-0 border-red-900"></div>
              </div>
            </div>

            {/* 草地与装饰背景容器 */}
            <div className="bg-linear-to-b from-green-400 to-green-600 rounded-3xl shadow-2xl border-8 border-green-800 p-8 min-h-[600px] relative overflow-hidden">
              {/* 草地纹理 */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)]"></div>
              </div>
              {/* 栅栏装饰 */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-amber-800 border-b-4 border-amber-900 flex items-center justify-around">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 h-full bg-amber-900"></div>
                ))}
              </div>
              {/* 菜地网格渲染 */}
              <GardenGrid plots={farm.plots} crops={seeds.crops} onPlotClick={onPlotClick} />
              {/* 装饰元素保持 */}
              <div className="absolute bottom-4 left-4 text-4xl animate-sway">🌿</div>
              <div className="absolute bottom-8 right-8 text-3xl animate-sway" style={{ animationDelay: '0.5s' }}>🍄</div>
              <div className="absolute top-1/2 left-2 text-2xl animate-sway" style={{ animationDelay: '1s' }}>🌻</div>
            </div>
          </div>

          {/* 右侧面板（基于 activePanel 显示具体内容） */}
          <ActionPanel
            activePanel={farm.activePanel}
            onClose={() => farm.setActivePanel('none')}
            crops={seeds.crops}
            warehouse={tx.warehouse}
            tasks={farm.tasks}
            userStats={farm.userStats}
            onBuySeed={(cropId) => seeds.openSelector(null, cropId)}
            onSellAll={(cropId) => tx.openSellModal(cropId)}
          />
        </div>
      </div>

      {/* 种子选择弹窗（地块入口与商店入口共用） */}
      <SeedSelector
        open={seeds.isSelectorOpen}
        crops={seeds.crops}
        userStats={farm.userStats}
        onClose={() => { seeds.closeSelector(); }}
        onPick={(cropId) => seeds.plantSelected(cropId)}
      />

      {/* 交易确认弹窗（例如出售全部） */}
      <TransactionModal
        open={tx.showTransactionModal}
        title="确认出售"
        crop={tx.transaction.crop}
        confirmText="出售全部"
        onConfirm={() => tx.transaction.crop && tx.sellAll(tx.transaction.crop.id)}
        onClose={tx.closeTransactionModal}
      />

      {/* 页面私有动画样式（迁移自原页面） */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

