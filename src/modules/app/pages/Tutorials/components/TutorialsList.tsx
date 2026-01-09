import { ChevronRight, Clock } from "lucide-react";
import type { Tutorial } from "../types";
import { getDifficultyColor, getDifficultyText } from "../utils";

interface TutorialsListProps {
  tutorials: Tutorial[];
  onSelect: (t: Tutorial) => void;
}

export function TutorialsList({ tutorials, onSelect }: TutorialsListProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tutorials.map((tutorial) => {
        const Icon = tutorial.icon;
        return (
          <div
            key={tutorial.id}
            onClick={() => onSelect(tutorial)}
            className="group cursor-pointer rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-6 backdrop-blur-sm transition-all hover:border-amber-500/50"
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 line-clamp-1 text-white transition-colors group-hover:text-amber-400">
                  {tutorial.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${getDifficultyColor(tutorial.difficulty)}`}
                  >
                    {getDifficultyText(tutorial.difficulty)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="h-3 w-3" />
                    {tutorial.duration}
                  </span>
                </div>
              </div>
            </div>
            <p className="mb-4 line-clamp-2 text-sm text-neutral-400">{tutorial.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{tutorial.steps.length} 个步骤</span>
              <ChevronRight className="h-5 w-5 text-neutral-500 transition-colors group-hover:text-amber-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
