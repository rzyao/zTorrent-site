import { BookOpen, HelpCircle, Star, Zap } from 'lucide-react';
import type { Tutorial } from '../types';

interface TutorialsStatsProps {
  tutorials: Tutorial[];
}

export function TutorialsStats({ tutorials }: TutorialsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">教程总数</span>
          <BookOpen className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-white text-2xl">{tutorials.length}</p>
      </div>
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">新手教程</span>
          <HelpCircle className="w-4 h-4 text-green-400" />
        </div>
        <p className="text-white text-2xl">{tutorials.filter((t) => t.difficulty === 'beginner').length}</p>
      </div>
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">进阶教程</span>
          <Star className="w-4 h-4 text-yellow-400" />
        </div>
        <p className="text-white text-2xl">{tutorials.filter((t) => t.difficulty === 'intermediate').length}</p>
      </div>
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">高级教程</span>
          <Zap className="w-4 h-4 text-red-400" />
        </div>
        <p className="text-white text-2xl">{tutorials.filter((t) => t.difficulty === 'advanced').length}</p>
      </div>
    </div>
  );
}

