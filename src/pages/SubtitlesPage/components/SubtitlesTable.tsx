import { ArrowDown, ArrowUp, Calendar, CheckCircle, Download, FileText, Star, Upload, User } from 'lucide-react';
import { Subtitle } from '../types';

function getLanguageFlag(code: string) {
  const flags: { [key: string]: string } = { zh: '🇨🇳', en: '🇺🇸', jp: '🇯🇵', kr: '🇰🇷' };
  return flags[code] || '🌍';
}

export function SubtitlesTable({ subtitles, onSelectSubtitle }: { subtitles: Subtitle[]; onSelectSubtitle: (s: Subtitle) => void }) {
  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-800/60 border-b border-neutral-700/50 text-sm text-neutral-400">
        <div className="col-span-5">字幕名称</div>
        <div className="col-span-2">关联种子</div>
        <div className="col-span-1 text-center">类型</div>
        <div className="col-span-1 text-center">语言</div>
        <div className="col-span-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <ArrowDown className="w-3.5 h-3.5" />
            下载
          </div>
        </div>
        <div className="col-span-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" />
            上传
          </div>
        </div>
        <div className="col-span-1 text-center">评分</div>
      </div>

      <div className="divide-y divide-neutral-700/30">
        {subtitles.map((subtitle) => (
          <div
            key={subtitle.id}
            onClick={() => onSelectSubtitle(subtitle)}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-800/40 transition-all cursor-pointer group"
          >
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm truncate group-hover:text-amber-400 transition-colors">{subtitle.name}</p>
                  {subtitle.verified && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {subtitle.uploader}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {subtitle.uploadDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-center min-w-0">
              <p className="text-neutral-300 text-sm truncate" title={subtitle.torrentName}>{subtitle.torrentName}</p>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="px-2 py-1 bg-neutral-700/50 rounded text-neutral-300 text-xs">{subtitle.type}</span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="text-xl" title={subtitle.language}>{getLanguageFlag(subtitle.languageCode)}</span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="text-green-400 text-sm flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {subtitle.downloads.toLocaleString()}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="text-blue-400 text-sm flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                {subtitle.uploads.toLocaleString()}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm">{subtitle.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
