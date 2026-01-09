import { X, Clock, FileText, Sparkles, CheckCircle } from "lucide-react";
import type { Tutorial } from "../types";
import { getDifficultyText } from "../utils";

interface TutorialDetailModalProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function TutorialDetailModal({ tutorial, onClose }: TutorialDetailModalProps) {
  const Icon = tutorial.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-4xl rounded-2xl border border-neutral-700 bg-neutral-900">
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl bg-linear-to-r from-amber-500 to-orange-600 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white">{tutorial.title}</h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-white/80">
                  {getDifficultyText(tutorial.difficulty)}
                </span>
                <span className="text白色/60">•</span>
                <span className="flex items-center gap-1 text-sm text-white/80">
                  <Clock className="h-3.5 w-3.5" />
                  {tutorial.duration}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg白色/20 hover:bg白色/30 text白色 flex h-8 w-8 items-center justify-center rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <p className="mb-6 text-neutral-300">{tutorial.description}</p>

          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg text-white">
              <FileText className="h-5 w-5 text-amber-400" />
              教程步骤
            </h3>
            <div className="space-y-4">
              {tutorial.steps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-700/30 bg-neutral-800/50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-orange-600 text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 text-white">{step.title}</h4>
                      <p className="text-sm leading-relaxed text-neutral-400">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tutorial.tips.length > 0 && (
            <div>
              <h3 className="text白色 mb-4 flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                实用小贴士
              </h3>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
                <ul className="space-y-2">
                  {tutorial.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-300">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
