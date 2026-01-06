// 中文说明：本文件集中存放与魔法农场页面相关的所有类型定义，
// 用于在 UI 层与逻辑层之间建立清晰的数据契约，避免在组件中散落的隐式结构。

// 作物生长阶段枚举（以联合字面量替代枚举，贴合项目现有风格）
export type CropStage = 'empty' | 'seed' | 'growing1' | 'growing2' | 'mature' | 'withered';

// 单块菜地（地块）信息结构
export interface Plot {
  id: number;
  stage: CropStage;
  cropType: string | null; // 当前种植的作物 ID（无作物时为 null）
  plantTime: number | null; // 种植时间戳，便于后续扩展生长逻辑
  waterLevel: number; // 0-100 的水分值
  isLocked: boolean; // 是否锁定，锁定时不可操作
  position: { x: number; y: number }; // 在农场网格中的位置（列、行）
}

// 作物定义结构（用于商店、选择器以及地块渲染）
export interface Crop {
  id: string;
  name: string;
  icon: string; // 使用 emoji 字符作为图标展示
  price: number; // 购买价格
  sellPrice: number; // 出售价格
  growTime: number; // 成长时间（分钟）
  experience: number; // 收获经验
  waterNeeded: number; // 推荐/需求水分值
  color: string; // 主题色（未直接使用，保留为风格扩展）
  stages: {
    seed: string;
    growing1: string;
    growing2: string;
    mature: string;
  };
}

// 页面动作模式与右侧面板类型
export type ActionMode = 'none' | 'plant' | 'water' | 'harvest' | 'steal';
export type PanelType = 'none' | 'shop' | 'warehouse' | 'friends' | 'tasks';

// 用户状态（金币、等级、能量等）
export interface UserStats {
  coins: number;
  level: number;
  exp: number;
  expToNext: number;
  energy: number;
  maxEnergy: number;
}

// 任务结构，用于右侧任务面板展示
export interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number; // 金币奖励
  expReward: number; // 经验奖励
}

// 仓库物品结构（用于展示作物库存）
export interface WarehouseItem {
  cropId: string;
  count: number;
}

