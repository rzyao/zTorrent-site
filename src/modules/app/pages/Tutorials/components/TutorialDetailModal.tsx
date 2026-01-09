import { X, Clock, FileText, Sparkles, CheckCircle } from 'lucide-react';
import type { Tutorial } from '../types';
import { getDifficultyText } from '.@/utils/cn';

interface TutorialDetailModalProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function TutorialDetailModal({ tutorial, onClose }: TutorialDetailModalProps) {
  const Icon = tutorial.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-linear-to-r from-amber-500 to-orange-600 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl">{tutorial.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/80 text-sm">{getDifficultyText(tutorial.difficulty)}</span>
                <span className="text白色/60">•</span>
                <span className="text-white/80 text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {tutorial.duration}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg白色/20 hover:bg白色/30 text白色 flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <p className="text-neutral-300 mb-6">{tutorial.description}</p>

          <div className="mb-6">
            <h3 className="text-white text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              教程步骤
            </h3>
            <div className="space-y-4">
              {tutorial.steps.map((step, index) => (
                <div key={index} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">{step.title}</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tutorial.tips.length > 0 && (
            <div>
              <h3 className="text白色 text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                实用小贴士
              </h3>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                <ul className="space-y-2">
                  {tutorial.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-300 text-sm">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
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

