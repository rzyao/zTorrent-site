import { AlertCircle, FileText, Languages, Link, Upload, X, MessageSquare } from 'lucide-react';
import type { TorrentOption, UploadForm } from '../types';

export function UploadSubtitleModal({
  open,
  uploadForm,
  availableTorrents,
  onFileChange,
  onFormPatch,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  uploadForm: UploadForm;
  availableTorrents: TorrentOption[];
  onFileChange: (file: File | null) => void;
  onFormPatch: (patch: Partial<UploadForm>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Upload className="w-6 h-6" />
            发布字幕
          </h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-neutral-300 mb-2 text-sm">
              <FileText className="w-4 h-4 inline mr-2" />
              字幕文件 *
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".srt,.ass,.ssa,.sub"
                className="hidden"
                id="subtitle-file"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />
              <label htmlFor="subtitle-file" className="block border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-amber-500 transition-all cursor-pointer">
                {uploadForm.file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-amber-500" />
                    <div className="text-left">
                      <p className="text-white mb-1">{uploadForm.file.name}</p>
                      <p className="text-neutral-400 text-sm">{(uploadForm.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
                    <p className="text-neutral-400 mb-1">点击或拖拽文件到此处上传</p>
                    <p className="text-neutral-600 text-sm">支持 .srt, .ass, .ssa, .sub 格式</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-2 text-sm">
              <Link className="w-4 h-4 inline mr-2" />
              关联种子 *
            </label>
            <select
              value={uploadForm.torrentId}
              onChange={(e) => onFormPatch({ torrentId: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">请选择要关联的种子</option>
              {availableTorrents.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <p className="text-neutral-500 text-xs mt-1">选择此字幕对应的种子文件，方便用户查找匹配</p>
          </div>

          <div>
            <label className="block text-neutral-300 mb-2 text-sm">
              <FileText className="w-4 h-4 inline mr-2" />
              字幕名称 *
            </label>
            <input
              type="text"
              value={uploadForm.name}
              onChange={(e) => onFormPatch({ name: e.target.value })}
              placeholder="例如：Interstellar.2014.1080p.BluRay.CHT&ENG"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">
                <FileText className="w-4 h-4 inline mr-2" />
                字幕类型 *
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => onFormPatch({ type: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="SRT">SRT</option>
                <option value="ASS">ASS</option>
                <option value="SSA">SSA</option>
                <option value="SUB">SUB</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">
                <Languages className="w-4 h-4 inline mr-2" />
                字幕语言 *
              </label>
              <select
                value={uploadForm.language}
                onChange={(e) => onFormPatch({ language: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="zh">简体中文</option>
                <option value="zh-TW">繁体中文</option>
                <option value="en">English</option>
                <option value="jp">日本語</option>
                <option value="kr">한국어</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-2 text-sm">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              字幕说明（可选）
            </label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => onFormPatch({ description: e.target.value })}
              placeholder="添加字幕的相关说明，如时间轴是否完美、翻译来源、特殊格式等..."
              rows={4}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="mb-1">上传提示：</p>
                <ul className="space-y-1 text-blue-400/80">
                  <li>• 请确保字幕文件编码为 UTF-8，避免乱码问题</li>
                  <li>• 字幕时间轴应与关联的种子版本完全匹配</li>
                  <li>• 上传前建议先本地测试字幕是否正常显示</li>
                  <li>• 禁止上传包含违规内容的字幕文件</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              disabled={!uploadForm.file || !uploadForm.name || !uploadForm.torrentId}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              提交发布
            </button>
            <button onClick={onCancel} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
