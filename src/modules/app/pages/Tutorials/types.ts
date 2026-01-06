export type CategoryType = 'all' | 'basic' | 'torrent' | 'community' | 'advanced';

export interface TutorialStep {
  title: string;
  content: string;
  image?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  category: CategoryType | string;
  description: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: TutorialStep[];
  tips: string[];
  video?: string;
}

export interface CategoryItem {
  id: CategoryType;
  name: string;
  icon: any;
  color: 'amber' | 'green' | 'blue' | 'purple' | 'orange';
}

