import { Loader2, Film } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
      <p className="text-neutral-400">正在加载影片...</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <Film className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-white text-xl mb-2">加载失败</h3>
      <p className="text-neutral-500 mb-6">{error}</p>
      <button onClick={onRetry} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors">
        重试
      </button>
    </div>
  );
}

