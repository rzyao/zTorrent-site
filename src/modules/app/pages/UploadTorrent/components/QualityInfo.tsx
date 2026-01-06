import React, { memo } from 'react';
import { Film, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaInfoResult } from '@/types/UploadTorrentPage';

/**
 * QualityInfo
 * 纯展示组件：负责渲染“质量信息”板块（分辨率/标准、视频编码、音频编码、制作组、MediaInfo 输入与解析结果展示）。
 */
export interface QualityInfoProps {
  resolutionOptions: string[];
  videoStandard: string;
  onVideoStandardChange: (val: string) => void;
  videoCodecOptions: string[];
  videoFormat: string;
  onVideoFormatChange: (val: string) => void;
  audioCodecOptions: string[];
  audioFormat: string;
  onAudioFormatChange: (val: string) => void;
  productionTeam: string;
  onProductionTeamChange: (val: string) => void;
  mediaInfoText: string;
  onMediaInfoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mediaInfo: MediaInfoResult;
}

export const QualityInfo = memo(function QualityInfo(props: QualityInfoProps) {
  const {
    resolutionOptions,
    videoStandard,
    onVideoStandardChange,
    videoCodecOptions,
    videoFormat,
    onVideoFormatChange,
    audioCodecOptions,
    audioFormat,
    onAudioFormatChange,
    productionTeam,
    onProductionTeamChange,
    mediaInfoText,
    onMediaInfoChange,
    mediaInfo,
  } = props;

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      {/* 模块标题区域 */}
      <div className="bg-linear-to-r from-orange-500/20 to-red-500/20 border-b border-neutral-700/50 px-6 py-3.5">
        <h2 className="text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-orange-400" />
          质量信息
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* 分辨率/标准、视频编码、音频编码、制作组 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm pt-2">质量参数</label>
          <div className="flex flex-wrap gap-10">
            {/* 分辨率（实际绑定的是标准名称，与原逻辑保持一致） */}
            <div className="flex flex-row items-center gap-2">
              <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">分辨率 :</label>
              <Select value={videoStandard} onValueChange={onVideoStandardChange}>
                <SelectTrigger className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                  <SelectGroup>
                    {resolutionOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                        {opt}
                      </SelectItem>
                    ))}
                    {videoStandard && !resolutionOptions.includes(videoStandard) && (
                      <SelectItem value={videoStandard} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                        {videoStandard}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 视频编码 */}
            <div className="flex flex-row items-center gap-2">
              <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">视频编码 :</label>
              <Select value={videoFormat} onValueChange={onVideoFormatChange}>
                <SelectTrigger className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                  <SelectGroup>
                    {videoCodecOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                        {opt}
                      </SelectItem>
                    ))}
                    {videoFormat && !videoCodecOptions.includes(videoFormat) && (
                      <SelectItem value={videoFormat} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                        {videoFormat}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 音频编码 */}
            <div className="flex flex-row items-center gap-2">
              <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">音频编码 :</label>
              <Select value={audioFormat} onValueChange={onAudioFormatChange}>
                <SelectTrigger className="bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                  <SelectGroup>
                    {audioCodecOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                        {opt}
                      </SelectItem>
                    ))}
                    {audioFormat && !audioCodecOptions.includes(audioFormat) && (
                      <SelectItem value={audioFormat} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                        {audioFormat}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 制作组 */}
            <div className="flex flex-row items-center gap-2">
              <label className="text-neutral-400 text-sm flex items-center gap-1 whitespace-nowrap">制作组 :</label>
              <input
                type="text"
                placeholder="例如: CSAUTO"
                className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                value={productionTeam}
                onChange={(e) => onProductionTeamChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* MediaInfo 输入与解析展示 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm pt-2">MediaInfo</label>
          <div className="col-span-1">
            <textarea
              rows={10}
              placeholder="请粘贴 MediaInfo 或 BDInfo 信息..."
              className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none resize-none font-mono transition-all scrollbar-themed"
              value={mediaInfoText}
              onChange={onMediaInfoChange}
            />
            <p className="text-neutral-500 text-xs mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              建议使用 MediaInfo 或 BDInfo 获取完整的技术信息
            </p>
            {mediaInfo.Video && (
              <div className="mt-4 flex flex-wrap gap-10">
                <p className="text-neutral-400 text-sm">视频时长: {mediaInfo.Video.duration}</p>
                <p className="text-neutral-400 text-sm">视频分辨率: {mediaInfo.Video.resolution}</p>
                <p className="text-neutral-400 text-sm">视频编码: {mediaInfo.Video.format}</p>
                <p className="text-neutral-400 text-sm">视频码率: {mediaInfo.Video.bitRate}</p>
                <p className="text-neutral-400 text-sm">视频帧率: {mediaInfo.Video.frameRate}</p>
                <p className="text-neutral-400 text-sm">音频编码: {mediaInfo.Audio?.format}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

