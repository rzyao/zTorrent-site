import { BookOpen } from 'lucide-react';

export function TutorialsHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">使用教程</h1>
          <p className="text-neutral-400 text-sm mt-1">从新手入门到高级技巧，帮助您更好地使用本站</p>
        </div>
      </div>
    </div>
  );
}

