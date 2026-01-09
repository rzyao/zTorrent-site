import {
  Award,
  Calendar,
  CheckCircle,
  Download,
  Flag,
  Link,
  MessageSquare,
  Star,
  ThumbsUp,
  Upload,
  User,
  X,
} from "lucide-react";
import type { Subtitle } from "../types";
import { getLanguageFlag } from "../utils";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-700 bg-neutral-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-700 bg-neutral-900 p-6">
          <h2 className="text-xl text-white">字幕详情</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-white transition-all hover:bg-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-2xl text-white">{subtitle.name}</h3>
              {subtitle.verified && (
                <span className="flex items-center gap-1 rounded-lg border border-blue-500/50 bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
                  <Award className="h-4 w-4" />
                  官方认证
                </span>
              )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">类型：</span>
                <span className="rounded bg-neutral-800 px-2 py-1 text-white">{subtitle.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">语言：</span>
                <span className="flex items-center gap-1 text-white">
                  <span className="text-xl">{getLanguageFlag(subtitle.languageCode)}</span>
                  {subtitle.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">下载量：</span>
                <span className="flex items-center gap-1 text-green-400">
                  <Download className="h-4 w-4" />
                  {subtitle.downloads.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">上传量：</span>
                <span className="flex items-center gap-1 text-blue-400">
                  <Upload className="h-4 w-4" />
                  {subtitle.uploads.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-neutral-800/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Link className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-neutral-400">关联种子</span>
              </div>
              <p className="text-white">{subtitle.torrentName}</p>
            </div>

            {subtitle.description && (
              <div className="mb-4 rounded-xl bg-neutral-800/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-neutral-400">字幕说明</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-300">{subtitle.description}</p>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-xl bg-neutral-800/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-orange-600 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white">{subtitle.uploader}</p>
                  <p className="text-sm text-neutral-400">上传于 {subtitle.uploadDate}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <span>{subtitle.rating}</span>
                  <span className="text-sm text-neutral-500">({subtitle.reviews}评价)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onDownload(subtitle)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 px-6 py-3 text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-700"
            >
              <Download className="h-5 w-5" />
              下载字幕
            </button>
            <button
              onClick={() => onLike(subtitle)}
              className="flex items-center gap-2 rounded-xl bg-neutral-800 px-6 py-3 text-white transition-all hover:bg-neutral-700"
            >
              <ThumbsUp className="h-5 w-5" />
              点赞
            </button>
            <button
              onClick={() => onReport(subtitle)}
              className="flex items-center gap-2 rounded-xl bg-neutral-800 px-6 py-3 text-white transition-all hover:bg-neutral-700"
            >
              <Flag className="h-5 w-5" />
              举报
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
