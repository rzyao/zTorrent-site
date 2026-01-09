import { ChevronRight, Clock } from 'lucide-react';
import type { Tutorial } from '../types';
import { getDifficultyColor, getDifficultyText } from '.@/utils/cn';

interface TutorialsListProps {
  tutorials: Tutorial[];
  onSelect: (t: Tutorial) => void;
}

export function TutorialsList({ tutorials, onSelect }: TutorialsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {tutorials.map((tutorial) => {
        const Icon = tutorial.icon;
        return (
          <div
            key={tutorial.id}
            onClick={() => onSelect(tutorial)}
            className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:border-amber-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">{tutorial.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(tutorial.difficulty)}`}>{getDifficultyText(tutorial.difficulty)}</span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="w-3 h-3" />
                    {tutorial.duration}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{tutorial.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 text-xs">{tutorial.steps.length} 个步骤</span>
              <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

