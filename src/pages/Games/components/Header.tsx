import { Gamepad2 } from 'lucide-react';

export function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Gamepad2 className="w-8 h-8 text-amber-400" />
        <h1 className="text-3xl text-white">小游戏中心</h1>
      </div>
      <p className="text-neutral-400">通过游戏获取魔力值，提升站点等级</p>
    </div>
  );
}
