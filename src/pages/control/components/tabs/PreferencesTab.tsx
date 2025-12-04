import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Palette, Globe, Monitor } from 'lucide-react';
import { MultiSelectPopover } from '../common/MultiSelectPopover';
import type { PreferencesData, KeyLabelOption } from '../../types';

interface PreferencesTabProps {
  adultMode: boolean;
  setAdultMode: (v: boolean) => void;
  preferences: PreferencesData;
  setPreferences: (next: PreferencesData) => void;
  torrentCategoryOptions: KeyLabelOption[];
  selectedTorrentCategories: string[];
  setSelectedTorrentCategories: (fn: (prev: string[]) => string[]) => void;
  filmGenreOptions: string[];
  selectedFilmGenres: string[];
  setSelectedFilmGenres: (fn: (prev: string[]) => string[]) => void;
}

// 网站偏好 Tab
// 职责：语言、主题、默认视图、成人模式与分类/影片多选
export function PreferencesTab(props: PreferencesTabProps) {
  const {
    adultMode,
    setAdultMode,
    preferences,
    setPreferences,
    torrentCategoryOptions,
    selectedTorrentCategories,
    setSelectedTorrentCategories,
    filmGenreOptions,
    selectedFilmGenres,
    setSelectedFilmGenres,
  } = props;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">网站偏好</h2>
          <p className="text-neutral-400 text-sm">自定义您的浏览体验</p>
        </div>
      </div>

      {/* 成人模式 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">显示成人模式</div>
          <p className="text-neutral-500 text-xs">开启后允许展示成人分级的分类与内容（保存后生效）</p>
        </div>
        <Switch checked={adultMode} onCheckedChange={setAdultMode} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 语言 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" /> 语言
        </label>
        <Select value={preferences.language} onValueChange={(v) => setPreferences({ ...preferences, language: v })}>
          <SelectTrigger>
            <SelectValue placeholder="选择语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-CN">简体中文</SelectItem>
            <SelectItem value="zh-TW">繁體中文</SelectItem>
            <SelectItem value="en-US">English</SelectItem>
            <SelectItem value="ja-JP">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 主题 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm flex items-center gap-2">
          <Monitor className="w-4 h-4" /> 主题
        </label>
        <Select value={preferences.theme} onValueChange={(v) => setPreferences({ ...preferences, theme: v })}>
          <SelectTrigger>
            <SelectValue placeholder="选择主题" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">深色模式</SelectItem>
            <SelectItem value="light">浅色模式</SelectItem>
            <SelectItem value="auto">跟随系统</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 默认视图 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">默认视图</label>
        <Select value={preferences.defaultView} onValueChange={(v) => setPreferences({ ...preferences, defaultView: v as 'grid' | 'list' })}>
          <SelectTrigger>
            <SelectValue placeholder="选择默认视图" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">网格视图</SelectItem>
            <SelectItem value="list">列表视图</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 种子分类多选 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">种子分类默认展示（多选）</label>
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
          <div className="flex-1">
            <div className="text-neutral-400 text-xs mb-2">共 {torrentCategoryOptions.length} 项，可点击选择</div>
            <div className="flex flex-wrap gap-2">
              {torrentCategoryOptions.map((opt) => {
                const checked = selectedTorrentCategories.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    className={`px-2 py-1 rounded-md border text-xs transition-colors ${checked
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-neutral-800/50 text-neutral-300 border-neutral-700 hover:bg-neutral-700/60'
                      }`}
                    onClick={() => {
                      setSelectedTorrentCategories((prev) => {
                        if (checked) return prev.filter((k) => k !== opt.key);
                        if (!prev.includes(opt.key)) return [...prev, opt.key];
                        return prev;
                      });
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
              {torrentCategoryOptions.length === 0 && <span className="text-neutral-500 text-xs">暂无可选分类</span>}
            </div>
          </div>
          <div className="hidden" />
        </div>
      </div>

      {/* 影片分类多选 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">影片分类默认展示（多选）</label>
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
          <div className="flex-1">
            <div className="text-neutral-400 text-xs mb-2">已选 {selectedFilmGenres.length} 项</div>
            <div className="flex flex-wrap gap-2">
              {selectedFilmGenres.map((g) => (
                <Badge key={g} className="bg-amber-500/20 text-amber-400 border border-amber-500/30">{g}</Badge>
              ))}
              {selectedFilmGenres.length === 0 && <span className="text-neutral-500 text-xs">未选择</span>}
            </div>
          </div>
          <MultiSelectPopover
            label="选择分类"
            options={filmGenreOptions}
            isChecked={(g) => selectedFilmGenres.includes(String(g))}
            onToggle={(g, checked) => {
              setSelectedFilmGenres((prev) => {
                const value = String(g);
                if (checked && !prev.includes(value)) return [...prev, value];
                if (!checked) return prev.filter((x) => x !== value);
                return prev;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
