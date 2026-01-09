import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Download,
  FileText,
  Star,
  Upload,
  User,
  Calendar,
} from "lucide-react";
import type { Subtitle } from "../types";
import { getLanguageFlag } from "../utils";

export function SubtitlesList({
  subtitles,
  onSelect,
}: {
  subtitles: Subtitle[];
  onSelect: (s: Subtitle) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm">
      <div className="grid grid-cols-12 gap-4 border-b border-neutral-700/50 bg-neutral-800/60 px-6 py-4 text-sm text-neutral-400">
        <div className="col-span-5">字幕名称</div>
        <div className="col-span-2">关联种子</div>
        <div className="col-span-1 text-center">类型</div>
        <div className="col-span-1 text-center">语言</div>
        <div className="col-span-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <ArrowDown className="h-3.5 w-3.5" />
            下载
          </div>
        </div>
        <div className="col-span-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <ArrowUp className="h-3.5 w-3.5" />
            上传
          </div>
        </div>
        <div className="col-span-1 text-center">评分</div>
      </div>

      <div className="divide-y divide-neutral-700/30">
        {subtitles.map((subtitle) => (
          <div
            key={subtitle.id}
            onClick={() => onSelect(subtitle)}
            className="group grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 transition-all hover:bg-neutral-800/40"
          >
            <div className="col-span-5 flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-amber-400" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="truncate text-sm text-white transition-colors group-hover:text-amber-400">
                    {subtitle.name}
                  </p>
                  {subtitle.verified && <CheckCircle className="h-4 w-4 shrink-0 text-blue-400" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {subtitle.uploader}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {subtitle.uploadDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-2 flex min-w-0 items-center">
              <p className="truncate text-sm text-neutral-300" title={subtitle.torrentName}>
                {subtitle.torrentName}
              </p>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="rounded bg-neutral-700/50 px-2 py-1 text-xs text-neutral-300">
                {subtitle.type}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="text-xl" title={subtitle.language}>
                {getLanguageFlag(subtitle.languageCode)}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="flex items-center gap-1 text-sm text-green-400">
                <Download className="h-3.5 w-3.5" />
                {subtitle.downloads.toLocaleString()}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="flex items-center gap-1 text-sm text-blue-400">
                <Upload className="h-3.5 w-3.5" />
                {subtitle.uploads.toLocaleString()}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-white">{subtitle.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subtitles.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
          <p className="text-neutral-400">暂无字幕</p>
        </div>
      )}
    </div>
  );
}
