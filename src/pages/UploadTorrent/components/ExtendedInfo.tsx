import React from 'react';
import { Link2, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * ExtendedInfo
 * 纯展示组件：负责渲染“扩展信息”板块（国家/地区、IMDb、豆瓣、PT-GEN、语言、字幕）。
 */
export interface ExtendedInfoProps {
  // 国家/地区
  countryOptions: string[];
  region: string;
  onRegionChange: (val: string) => void;

  // IMDb / Douban
  imdbUrl: string;
  onImdbUrlChange: (val: string) => void;
  doubanUrl: string;
  onDoubanUrlChange: (val: string) => void;

  // PT-GEN
  ptGenUrl: string;
  onPtGenUrlChange: (val: string) => void;
  onFetchPtGen: () => void;
  ptGenLoading: boolean;
  ptGenError: string | null;

  // 语言/字幕
  languageOptions: string[];
  selectedLanguages: string[];
  onToggleLanguage: (lang: string) => void;
  subtitleOptions: string[];
  selectedSubtitles: string[];
  onToggleSubtitle: (sub: string) => void;
}

export function ExtendedInfo(props: ExtendedInfoProps) {
  const {
    countryOptions,
    region,
    onRegionChange,
    imdbUrl,
    onImdbUrlChange,
    doubanUrl,
    onDoubanUrlChange,
    ptGenUrl,
    onPtGenUrlChange,
    onFetchPtGen,
    ptGenLoading,
    ptGenError,
    languageOptions,
    selectedLanguages,
    onToggleLanguage,
    subtitleOptions,
    selectedSubtitles,
    onToggleSubtitle,
  } = props;

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      {/* 模块标题区域 */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-amber-500/20 border-b border-neutral-700/50 px-6 py-3.5">
        <h2 className="text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-yellow-400" />
          扩展信息
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* 国家/地区 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm flex items-center gap-1">国家/地区</label>
          <div className="col-span-1">
            <Select value={region} onValueChange={onRegionChange}>
              <SelectTrigger className="w-[200px] bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all">
                <SelectValue placeholder="请选择国家/地区" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
                <SelectGroup>
                  {countryOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* IMDb 链接 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm flex items-center gap-1">IMDb 链接</label>
          <div className="col-span-1">
            <input
              type="text"
              placeholder="例如: https://www.imdb.com/title/tt0816692/"
              className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all"
              value={imdbUrl}
              onChange={(e) => onImdbUrlChange(e.target.value)}
            />
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 豆瓣链接 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm flex items-center gap-1">豆瓣链接</label>
          <div className="col-span-1">
            <input
              type="text"
              placeholder="例如: https://movie.douban.com/subject/1292052/"
              className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all"
              value={doubanUrl}
              onChange={(e) => onDoubanUrlChange(e.target.value)}
            />
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* PT-GEN */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm flex items-center gap-1">PT-GEN</label>
          <div className="col-span-1">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="输入 PT-Gen 链接或代码 , PT-GEN 可帮助自动生成种子简介"
                className="flex-1 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none transition-all"
                value={ptGenUrl}
                onChange={(e) => onPtGenUrlChange(e.target.value)}
              />
              <Button type="button" className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white whitespace-nowrap" onClick={onFetchPtGen} disabled={ptGenLoading}>
                <Download className="w-4 h-4 mr-1.5" />
                {ptGenLoading ? '获取中...' : '获取简介'}
              </Button>
            </div>
            {ptGenError && <p className="text-red-500 text-xs mt-2">{ptGenError}</p>}
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 语言 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm">语言</label>
          <div className="col-span-1">
            <div className="flex flex-wrap gap-8">
              {languageOptions.map((lang) => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedLanguages.includes(lang)}
                    onCheckedChange={() => onToggleLanguage(lang)}
                    className="border-neutral-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <span className="text-neutral-400 text-sm group-hover:text-white transition-colors">{lang}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 字幕 */}
        <div className="grid grid-cols-1 grid-cols-[160px_1fr] gap-2">
          <label className="text-neutral-300 text-sm">字幕</label>
          <div className="col-span-1">
            <div className="flex flex-wrap gap-8">
              {subtitleOptions.map((sub) => (
                <label key={sub} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedSubtitles.includes(sub)}
                    onCheckedChange={() => onToggleSubtitle(sub)}
                    className="border-neutral-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <span className="text-neutral-400 text-sm group-hover:text-white transition-colors">{sub}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

