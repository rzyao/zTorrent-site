import { Sparkles } from 'lucide-react';

export function BonusHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-white text-3xl">魔力值中心</h1>
      </div>
      <p className="text-neutral-400 ml-13">管理您的魔力值，兑换专属特权</p>
    </div>
  );
}

