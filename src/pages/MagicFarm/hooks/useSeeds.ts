import { useState } from 'react';
import type { Crop, Plot, UserStats } from '../types';

// 中文说明：
// 该 Hook 专注于“种子/作物选择与种植”逻辑：
// - 提供可选作物列表（原页面的静态 crops 数据）
// - 管理种子选择弹窗的开关与当前选中作物
// - 执行种植操作（扣金币、更新地块、水分等）
// 注意：为保持关注点分离，该 Hook 不直接持有农场地块与用户状态，
// 通过参数接收必要的状态与更新器，从而在单一职责的前提下完成业务。

export function useSeeds(params: {
  plots: Plot[];
  setPlots: (updater: Plot[] | ((prev: Plot[]) => Plot[])) => void;
  userStats: UserStats;
  setUserStats: (updater: UserStats | ((prev: UserStats) => UserStats)) => void;
}) {
  const { plots, setPlots, userStats, setUserStats } = params;

  // 作物列表（与原页面一致，迁移到 Hook 内集中管理）
  const crops: Crop[] = [
    {
      id: 'wheat', name: '小麦', icon: '🌾', price: 50, sellPrice: 120, growTime: 60, experience: 10, waterNeeded: 30, color: '#F59E0B',
      stages: { seed: '🟤', growing1: '🌱', growing2: '🌿', mature: '🌾' },
    },
    {
      id: 'corn', name: '玉米', icon: '🌽', price: 120, sellPrice: 280, growTime: 120, experience: 25, waterNeeded: 50, color: '#FBBF24',
      stages: { seed: '🟤', growing1: '🌱', growing2: '🌿', mature: '🌽' },
    },
    {
      id: 'tomato', name: '番茄', icon: '🍅', price: 200, sellPrice: 480, growTime: 180, experience: 40, waterNeeded: 70, color: '#EF4444',
      stages: { seed: '🟤', growing1: '🌱', growing2: '🍃', mature: '🍅' },
    },
    {
      id: 'carrot', name: '胡萝卜', icon: '🥕', price: 80, sellPrice: 180, growTime: 90, experience: 15, waterNeeded: 40, color: '#F97316',
      stages: { seed: '🟤', growing1: '🌱', growing2: '🥬', mature: '🥕' },
    },
    {
      id: 'cabbage', name: '卷心菜', icon: '🥬', price: 150, sellPrice: 350, growTime: 150, experience: 30, waterNeeded: 60, color: '#10B981',
      stages: { seed: '🟤', growing1: '🌱', growing2: '🌿', mature: '🥬' },
    },
    {
      id: 'pumpkin', name: '南瓜', icon: '🎃', price: 300, sellPrice: 700, growTime: 240, experience: 60, waterNeeded: 80, color: '#F97316',
      stages: { seed: '🟤', growing1: '🌱', growing2: '🍃', mature: '🎃' },
    },
  ];

  // 弹窗显示状态与当前选中的作物、目标地块
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [targetPlotId, setTargetPlotId] = useState<number | null>(null);

  // 打开选择器：可指定目标地块与预选作物（商店入口与地块入口通用）
  const openSelector = (plotId: number | null, presetCropId?: string) => {
    setTargetPlotId(plotId);
    setSelectedCropId(presetCropId ?? selectedCropId);
    setSelectorOpen(true);
  };

  // 关闭选择器并清理上下文
  const closeSelector = () => {
    setSelectorOpen(false);
    setSelectedCropId(null);
    setTargetPlotId(null);
  };

  // 执行种植（与原页面 handlePlantCrop 等价）：
  // - 需要已选定目标地块（来自点击空地）
  // - 校验金币与作物存在
  // - 更新 plots 与用户金币
  const plantSelected = (cropId: string) => {
    if (!targetPlotId) return; // 未选择地块则不执行（保持与原页面一致的行为）
    const crop = crops.find(c => c.id === cropId);
    if (!crop || userStats.coins < crop.price) return;

    setPlots(plots.map(p => p.id === targetPlotId
      ? { ...p, stage: 'seed', cropType: cropId, plantTime: Date.now(), waterLevel: 20 }
      : p
    ));
    setUserStats({ ...userStats, coins: userStats.coins - crop.price });
    closeSelector();
  };

  return {
    crops,
    // 弹窗与选择
    isSelectorOpen,
    selectedCropId,
    setSelectedCropId,
    targetPlotId,
    openSelector,
    closeSelector,
    // 行为
    plantSelected,
  };
}

