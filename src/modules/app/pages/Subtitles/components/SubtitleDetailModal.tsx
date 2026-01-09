import { Award, Calendar, CheckCircle, Download, Flag, Link, MessageSquare, Star, ThumbsUp, Upload, User, X } from 'lucide-react';
import type { Subtitle } from '../types';
import { getLanguageFlag } from '.@/utils/cn';

export function SubtitleDetailModal({
  open,
  subtitle,
  onClose,
  onDownload,
  onLike,
  onReport,
}: {
  open: boolean;
  subtitle: Subtitle | null;
  onClose: () => void;
  onDownload: (subtitle: Subtitle) => void;
  onLike: (subtitle: Subtitle) => void;
  onReport: (subtitle: Subtitle) => void;
}) {
  if (!open || !subtitle) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-6 flex items-center justify-between">
          <h2 className="text-white text-xl">字幕详情</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-white text-2xl">{subtitle.name}</h3>
              {subtitle.verified && (
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  官方认证
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">类型：</span>
                <span className="text-white px-2 py-1 bg-neutral-800 rounded">{subtitle.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">语言：</span>
                <span className="text-white flex items-center gap-1">
                  <span className="text-xl">{getLanguageFlag(subtitle.languageCode)}</span>
                  {subtitle.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">下载量：</span>
                <span className="text-green-400 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {subtitle.downloads.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">上传量：</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  {subtitle.uploads.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Link className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-400 text-sm">关联种子</span>
              </div>
              <p className="text-white">{subtitle.torrentName}</p>
            </div>

            {subtitle.description && (
              <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span className="text-neutral-400 text-sm">字幕说明</span>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed">{subtitle.description}</p>
              </div>
            )}
          </div>

          <div className="bg-neutral-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white">{subtitle.uploader}</p>
                  <p className="text-neutral-400 text-sm">上传于 {subtitle.uploadDate}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span>{subtitle.rating}</span>
                  <span className="text-neutral-500 text-sm">({subtitle.reviews}评价)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onDownload(subtitle)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30">
              <Download className="w-5 h-5" />
              下载字幕
            </button>
            <button onClick={() => onLike(subtitle)} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all">
              <ThumbsUp className="w-5 h-5" />
              点赞
            </button>
            <button onClick={() => onReport(subtitle)} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all">
              <Flag className="w-5 h-5" />
              举报
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
