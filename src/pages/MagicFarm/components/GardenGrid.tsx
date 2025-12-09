import { Droplet, Sprout, Sparkles, Lock } from 'lucide-react';
import type { Plot, Crop } from '../types';

// 中文说明：
// GardenGrid 为纯展示组件，负责渲染农场 3x3 网格中的每块地。
// - 接收地块数据与作物定义用于视觉展示
// - 通过 onPlotClick 回调向外部报告点击事件（不做业务判断）
// - 内部包含 getCropVisual 纯函数，用于从地块与作物定义计算显示内容

interface Props {
  plots: Plot[];
  crops: Crop[];
  onPlotClick: (plot: Plot) => void;
}

export function GardenGrid({ plots, crops, onPlotClick }: Props) {
  // 根据地块阶段返回对应的作物视觉符号（纯函数，无副作用）
  const getCropVisual = (plot: Plot): string | null => {
    if (plot.stage === 'empty') return null;
    if (plot.isLocked) return null;
    const crop = crops.find(c => c.id === plot.cropType);
    if (!crop) return null;
    switch (plot.stage) {
      case 'seed': return crop.stages.seed;
      case 'growing1': return crop.stages.growing1;
      case 'growing2': return crop.stages.growing2;
      case 'mature': return crop.stages.mature;
      default: return '';
    }
  };

  return (
    <div className="relative mt-12 grid grid-cols-3 gap-6 max-w-4xl mx-auto">
      {plots.map((plot) => (
        <div
          key={plot.id}
          onClick={() => onPlotClick(plot)}
          className="relative group cursor-pointer"
          style={{ gridColumn: plot.position.x, gridRow: plot.position.y }}
        >
          {/* 土地卡片 */}
          <div
            className={`aspect-square rounded-2xl border-4 transition-all relative overflow-hidden ${plot.isLocked
              ? 'bg-gradient-to-br from-stone-600 to-stone-800 border-stone-900'
              : plot.stage === 'empty'
                ? 'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-950 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:scale-105'
                : plot.stage === 'mature'
                  ? 'bg-gradient-to-br from-amber-800 to-amber-900 border-amber-950 shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse-slow'
                  : 'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-950 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105'
            }`}
          >
            {/* 土壤纹理 */}
            {!plot.isLocked && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.1)_8px,rgba(0,0,0,0.1)_10px)]"></div>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(0,0,0,0.1)_8px,rgba(0,0,0,0.1)_10px)]"></div>
              </div>
            )}

            {/* 土地编号 */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center text-white text-xs z-10">
              {plot.id}
            </div>

            {/* 水分指示器 */}
            {!plot.isLocked && plot.stage !== 'empty' && (
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                  <Droplet className={`w-3 h-3 ${plot.waterLevel > 60 ? 'text-blue-400' : plot.waterLevel > 30 ? 'text-yellow-400' : 'text-red-400'}`} />
                  <span className="text-white text-xs">{plot.waterLevel}%</span>
                </div>
              </div>
            )}

            {/* 作物显示 */}
            <div className="absolute inset-0 flex items-center justify-center">
              {plot.isLocked ? (
                <div className="text-center">
                  <Lock className="w-12 h-12 text-stone-500 mx-auto mb-2" />
                  <span className="text-stone-400 text-xs">Lv.{15 + plot.id}</span>
                </div>
              ) : (
                <div className="text-7xl transform transition-all group-hover:scale-110">
                  {getCropVisual(plot) || (
                    <div className="text-amber-700/30 text-5xl">
                      <Sprout className="w-16 h-16" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 成熟闪光效果 */}
            {plot.stage === 'mature' && (
              <>
                <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-300 animate-ping" />
                <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-yellow-300 animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-green-400/20 to-transparent rounded-2xl"></div>
              </>
            )}

            {/* Hover 提示 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-2xl">
              <div className="bg-white/90 px-4 py-2 rounded-lg">
                <span className="text-amber-900 text-sm">
                  {plot.isLocked ? '🔒 已锁定' : plot.stage === 'empty' ? '🌱 点击种植' : plot.stage === 'mature' ? '✨ 点击收获' : '💧 点击浇水'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GardenGrid;

