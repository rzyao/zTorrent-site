import type { ChangeEvent } from 'react';

export interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  desc: string;
  onNameChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onCreate: () => void;
}

export function CreatePlaylistModal(props: CreatePlaylistModalProps) {
  const { isOpen, onClose, name, desc, onNameChange, onDescChange, onCreate } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-800 to-stone-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl text-white">新建歌单</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">歌单名称</label>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
              placeholder="输入歌单名称"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2 text-white placeholder-neutral-500 transition-all focus:border-amber-500 focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-neutral-400">描述（可选）</label>
            <textarea
              value={desc}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onDescChange(e.target.value)}
              placeholder="添加描述..."
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2 text-white placeholder-neutral-500 transition-all focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-lg bg-neutral-800 px-4 py-2 text-white transition-all hover:bg-neutral-700">
              取消
            </button>
            <button onClick={onCreate} disabled={!name.trim()} className="flex-1 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50">
              创建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
