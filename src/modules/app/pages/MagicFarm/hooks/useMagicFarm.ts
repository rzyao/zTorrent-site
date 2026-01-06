import { useState } from 'react';
import type { Plot, PanelType, UserStats, Task } from '../types';

// 中文说明：
// 该 Hook 负责农场核心状态与业务动作（浇水、收获、右侧面板切换等），
// 不承担 UI 渲染职责；仅通过返回的数据与方法供页面与纯展示组件使用。

export function useMagicFarm() {
  // 用户属性（金币/等级/经验/能量）
  const [userStats, setUserStats] = useState<UserStats>({
    coins: 15680,
    level: 12,
    exp: 3580,
    expToNext: 5000,
    energy: 85,
    maxEnergy: 100,
  });

  // 农场地块（3x3 网格）初始状态
  const [plots, setPlots] = useState<Plot[]>([
    { id: 1, stage: 'mature',   cropType: 'tomato', plantTime: Date.now() - 3600000, waterLevel: 80, isLocked: false, position: { x: 1, y: 1 } },
    { id: 2, stage: 'growing2', cropType: 'wheat',  plantTime: Date.now() - 1800000, waterLevel: 60, isLocked: false, position: { x: 2, y: 1 } },
    { id: 3, stage: 'growing1', cropType: 'corn',   plantTime: Date.now() -  900000, waterLevel: 40, isLocked: false, position: { x: 3, y: 1 } },
    { id: 4, stage: 'seed',     cropType: 'carrot', plantTime: Date.now() -  300000, waterLevel: 90, isLocked: false, position: { x: 1, y: 2 } },
    { id: 5, stage: 'empty',    cropType: null,     plantTime: null,                 waterLevel:  0, isLocked: false, position: { x: 2, y: 2 } },
    { id: 6, stage: 'growing2', cropType: 'cabbage',plantTime: Date.now() - 1500000, waterLevel: 70, isLocked: false, position: { x: 3, y: 2 } },
    { id: 7, stage: 'empty',    cropType: null,     plantTime: null,                 waterLevel:  0, isLocked: true,  position: { x: 1, y: 3 } },
    { id: 8, stage: 'empty',    cropType: null,     plantTime: null,                 waterLevel:  0, isLocked: true,  position: { x: 2, y: 3 } },
    { id: 9, stage: 'empty',    cropType: null,     plantTime: null,                 waterLevel:  0, isLocked: true,  position: { x: 3, y: 3 } },
  ]);

  // 当前右侧面板类型（商店/仓库/好友/任务）
  const [activePanel, setActivePanel] = useState<PanelType>('none');

  // 任务列表（展示用途，不含复杂逻辑）
  const [tasks] = useState<Task[]>([
    { id: '1', title: '种植大师', description: '种植10次作物', progress: 7,  target: 10, reward:  500, expReward:  50 },
    { id: '2', title: '丰收季节', description: '收获20个作物', progress: 15, target: 20, reward: 1000, expReward: 100 },
    { id: '3', title: '浇水能手', description: '浇水30次',    progress: 22, target: 30, reward:  300, expReward:  30 },
  ]);

  // 对外暴露的业务动作：浇水
  const waterPlot = (plotId: number) => {
    // 能量不足则直接返回（与原页面一致）
    if (userStats.energy < 5) return;
    setPlots(plots.map(p => p.id === plotId ? { ...p, waterLevel: Math.min(100, p.waterLevel + 30) } : p));
    setUserStats({ ...userStats, energy: userStats.energy - 5 });
  };

  // 对外暴露的业务动作：收获
  const harvestPlot = (plotId: number, cropSellPrice: number, cropExp: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.stage !== 'mature' || !plot.cropType) return;
    // 清空该地块，并结算金币与经验（与原页面一致）
    setPlots(plots.map(p => p.id === plotId ? { ...p, stage: 'empty', cropType: null, plantTime: null, waterLevel: 0 } : p));
    setUserStats({
      ...userStats,
      coins: userStats.coins + cropSellPrice,
      exp: userStats.exp + cropExp,
    });
  };

  // 页面组合层使用的工具：切换右侧面板
  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  return {
    // 状态
    userStats,
    plots,
    activePanel,
    tasks,
    // 状态更新器（仅暴露必要的，避免泄漏业务细节）
    setActivePanel,
    setPlots,
    setUserStats,
    // 业务动作
    waterPlot,
    harvestPlot,
    togglePanel,
  };
}

