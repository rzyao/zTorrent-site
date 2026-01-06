export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-400 bg-green-500/20';
    case 'intermediate':
      return 'text-yellow-400 bg-yellow-500/20';
    case 'advanced':
      return 'text-red-400 bg-red-500/20';
    default:
      return 'text-neutral-400 bg-neutral-500/20';
  }
};

export const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return '入门';
    case 'intermediate':
      return '进阶';
    case 'advanced':
      return '高级';
    default:
      return '';
  }
};

