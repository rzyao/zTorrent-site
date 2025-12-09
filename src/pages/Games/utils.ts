import type { Difficulty } from './types';

export function getDifficultyColor(difficulty: Difficulty | string) {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400 bg-green-500/10 border-green-500/20';
    case 'medium':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'hard':
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
}

export function getDifficultyText(difficulty: Difficulty | string) {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return '未知';
  }
}
