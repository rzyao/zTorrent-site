import { FileText, Upload } from 'lucide-react';

export function Header({ onClickUpload }: { onClickUpload: () => void }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-3xl">字幕中心</h1>
            <p className="text-neutral-400 text-sm mt-1">分享和下载高质量字幕，让观影体验更完美</p>
          </div>
        </div>
        <button
          onClick={onClickUpload}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30"
        >
          <Upload className="w-5 h-5" />
          <span>发布字幕</span>
        </button>
      </div>
    </div>
  );
}

