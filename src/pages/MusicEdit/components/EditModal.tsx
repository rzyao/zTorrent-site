import { X, Save } from "lucide-react";
import type { ModalType, TabType } from "../types";

export function EditModal({
  open,
  tab,
  modalType,
  formData,
  onChange,
  onCancel,
  onSave,
}: {
  open: boolean;
  tab: TabType;
  modalType: ModalType;
  formData: any;
  onChange: (next: any) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (!open) return null;
  const isAdd = modalType === "add";
  const title = isAdd
    ? `新增${tab === "songs" ? "单曲" : tab === "artists" ? "歌手" : "专辑"}`
    : `编辑${tab === "songs" ? "单曲" : tab === "artists" ? "歌手" : "专辑"}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl">{title}</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {tab === "songs" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 text-sm mb-2">歌名</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => onChange({ ...formData, title: e.target.value })}
                    placeholder="输入歌名"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">歌手</label>
                  <input
                    type="text"
                    value={formData.artist || ""}
                    onChange={(e) => onChange({ ...formData, artist: e.target.value })}
                    placeholder="输入歌手"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 text-sm mb-2">专辑</label>
                  <input
                    type="text"
                    value={formData.album || ""}
                    onChange={(e) => onChange({ ...formData, album: e.target.value })}
                    placeholder="输入专辑"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">时长</label>
                  <input
                    type="text"
                    value={formData.duration || ""}
                    onChange={(e) => onChange({ ...formData, duration: e.target.value })}
                    placeholder="例如: 3:45"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 text-sm mb-2">年份</label>
                  <input
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => onChange({ ...formData, year: parseInt(e.target.value) })}
                    placeholder="2024"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">风格</label>
                  <input
                    type="text"
                    value={formData.genre || ""}
                    onChange={(e) => onChange({ ...formData, genre: e.target.value })}
                    placeholder="流行/摇滚/电子等"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-400 text-sm mb-2">封面URL</label>
                <input
                  type="text"
                  value={formData.cover || ""}
                  onChange={(e) => onChange({ ...formData, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </>
          )}

          {tab === "artists" && (
            <>
              <div>
                <label className="block text-amber-400 text-sm mb-2">艺名</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => onChange({ ...formData, name: e.target.value })}
                  placeholder="输入艺名"
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 text-sm mb-2">国家/地区</label>
                  <input
                    type="text"
                    value={formData.country || ""}
                    onChange={(e) => onChange({ ...formData, country: e.target.value })}
                    placeholder="中国/美国等"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">出道年份</label>
                  <input
                    type="number"
                    value={formData.debutYear || ""}
                    onChange={(e) => onChange({ ...formData, debutYear: parseInt(e.target.value) })}
                    placeholder="2020"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-400 text-sm mb-2">简介</label>
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) => onChange({ ...formData, bio: e.target.value })}
                  placeholder="输入艺人简介..."
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-amber-400 text-sm mb-2">头像URL</label>
                <input
                  type="text"
                  value={formData.avatar || ""}
                  onChange={(e) => onChange({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </>
          )}

          {tab === "albums" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-400 text-sm mb-2">专辑名</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => onChange({ ...formData, title: e.target.value })}
                    placeholder="输入专辑名"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">艺人</label>
                  <input
                    type="text"
                    value={formData.artist || ""}
                    onChange={(e) => onChange({ ...formData, artist: e.target.value })}
                    placeholder="输入艺人"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-amber-400 text-sm mb-2">年份</label>
                  <input
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => onChange({ ...formData, year: parseInt(e.target.value) })}
                    placeholder="2024"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">风格</label>
                  <input
                    type="text"
                    value={formData.genre || ""}
                    onChange={(e) => onChange({ ...formData, genre: e.target.value })}
                    placeholder="流行/摇滚等"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">曲目数</label>
                  <input
                    type="number"
                    value={formData.tracks || ""}
                    onChange={(e) => onChange({ ...formData, tracks: parseInt(e.target.value) })}
                    placeholder="12"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-400 text-sm mb-2">专辑描述</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => onChange({ ...formData, description: e.target.value })}
                  placeholder="输入专辑描述..."
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-amber-400 text-sm mb-2">封面URL</label>
                <input
                  type="text"
                  value={formData.cover || ""}
                  onChange={(e) => onChange({ ...formData, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-700">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-all"
          >
            取消
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

