/**
 * 工具函数文件：提供纯函数，不依赖 React 状态。
 *
 * 拆分理由：
 * - 便于单元测试与复用；逻辑与 UI 解耦。
 */
import { Users, Film, Music, Gamepad2, BookOpen, Crown } from 'lucide-react';
import type { IconName, Level } from './types';

/**
 * 根据图标名称返回对应的 Lucide 图标组件。
 * 说明：返回的是 React 组件本身，调用方可直接渲染 `<Icon />`。
 */
export const getIconComponent = (icon: IconName) => {
  switch (icon) {
    case 'film':
      return Film;
    case 'music':
      return Music;
    case 'game':
      return Gamepad2;
    case 'book':
      return BookOpen;
    default:
      return Users;
  }
};

/**
 * 根据等级返回用于 Tailwind 的渐变色类名。
 * 保持与原 UI 完全一致。
 */
export const getLevelColor = (level: Level) => {
  switch (level) {
    case 'platinum':
      return 'from-cyan-400 to-blue-400';
    case 'gold':
      return 'from-amber-400 to-yellow-400';
    case 'silver':
      return 'from-gray-300 to-gray-400';
    case 'bronze':
      return 'from-orange-600 to-orange-700';
    default:
      return 'from-gray-400 to-gray-500';
  }
};

/**
 * 根据等级返回中文徽章文案。
 */
export const getLevelBadge = (level: Level) => {
  const labels: Record<Level, string> = {
    platinum: '白金',
    gold: '金牌',
    silver: '银牌',
    bronze: '铜牌',
  };
  return labels[level];
};

