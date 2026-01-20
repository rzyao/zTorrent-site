import { Separator } from "@/modules/app/components/ui/separator";
import { Switch } from "@/modules/app/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/modules/app/components/ui/select";
import { Palette, Globe, Monitor } from "lucide-react";
import type { PreferencesData, KeyLabelOption } from "../../types";
import { useLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/hooks/useLanguage";

interface PreferencesTabProps {
  adultMode: boolean;
  setAdultMode: (v: boolean) => void;
  preferences: PreferencesData;
  setPreferences: (next: PreferencesData) => void;
  torrentCategoryOptions: KeyLabelOption[];
  selectedTorrentCategories: string[];
  setSelectedTorrentCategories: (fn: (prev: string[]) => string[]) => void;
  movieGenreOptions: KeyLabelOption[];
  selectedMovieGenres: string[];
  setSelectedMovieGenres: (fn: (prev: string[]) => string[]) => void;
  seriesGenreOptions: KeyLabelOption[];
  selectedSeriesGenres: string[];
  setSelectedSeriesGenres: (fn: (prev: string[]) => string[]) => void;
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
    movieGenreOptions,
    selectedMovieGenres,
    setSelectedMovieGenres,
    seriesGenreOptions,
    selectedSeriesGenres,
    setSelectedSeriesGenres,
  } = props;

  const { changeLanguage, t } = useLanguage();

  // 语言切换处理：同时更新偏好设置和 i18n
  const handleLanguageChange = (value: string) => {
    setPreferences({ ...preferences, language: value });
    // 同步更新 i18n 语言
    changeLanguage(value as SupportedLanguage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">{t('settings.preferences')}</h2>
          <p className="text-neutral-400 text-sm">{t('settings.preferencesDesc')}</p>
        </div>
      </div>

      {/* 成人模式 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">{t('preferences.adultMode')}</div>
          <p className="text-neutral-500 text-xs">
            {t('preferences.adultModeDesc')}
          </p>
        </div>
        <Switch checked={adultMode} onCheckedChange={setAdultMode} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 语言 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" /> {t('settings.language')}
        </label>
        <Select
          value={preferences.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('settings.languageDesc')} />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 主题 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm flex items-center gap-2">
          <Monitor className="w-4 h-4" /> {t('settings.theme')}
        </label>
        <Select
          value={preferences.theme}
          onValueChange={(v) => setPreferences({ ...preferences, theme: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('settings.themeDesc')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">{t('settings.themeDark')}</SelectItem>
            <SelectItem value="light">{t('settings.themeLight')}</SelectItem>
            <SelectItem value="auto">{t('settings.themeSystem')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 默认视图 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">{t('settings.defaultView')}</label>
        <Select
          value={preferences.defaultView}
          onValueChange={(v) =>
            setPreferences({
              ...preferences,
              defaultView: v as "grid" | "list",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t('settings.defaultViewDesc')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">{t('settings.viewGrid')}</SelectItem>
            <SelectItem value="list">{t('settings.viewList')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 种子分类多选 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">
          {t('preferences.torrentCategories')}
        </label>
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
          <div className="flex-1">
            <div className="text-neutral-400 text-xs mb-2">
              {t('preferences.itemsClickToSelect', { count: torrentCategoryOptions.length })}
            </div>
            <div className="flex flex-wrap gap-2">
              {torrentCategoryOptions.map((opt) => {
                const checked = selectedTorrentCategories.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    className={`px-2 py-1 rounded-md border text-xs transition-colors ${
                      checked
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-neutral-800/50 text-neutral-300 border-neutral-700 hover:bg-neutral-700/60"
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
              {torrentCategoryOptions.length === 0 && (
                <span className="text-neutral-500 text-xs">{t('preferences.noCategories')}</span>
              )}
            </div>
          </div>
          <div className="hidden" />
        </div>
      </div>

      {/* 电影分类多选 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">
          {t('preferences.movieGenres')}
        </label>
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
          <div className="flex-1">
            <div className="text-neutral-400 text-xs mb-2">
              {t('preferences.itemsClickToSelect', { count: movieGenreOptions.length })}
            </div>
            <div className="flex flex-wrap gap-2">
              {movieGenreOptions.map((opt) => {
                const checked = selectedMovieGenres.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    className={`px-2 py-1 rounded-md border text-xs transition-colors ${
                      checked
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-neutral-800/50 text-neutral-300 border-neutral-700 hover:bg-neutral-700/60"
                    }`}
                    onClick={() => {
                      setSelectedMovieGenres((prev) => {
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
              {movieGenreOptions.length === 0 && (
                <span className="text-neutral-500 text-xs">{t('preferences.noCategories')}</span>
              )}
            </div>
          </div>
          <div className="hidden" />
        </div>
      </div>

      {/* 剧集分类多选 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">
          {t('preferences.seriesGenres')}
        </label>
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
          <div className="flex-1">
            <div className="text-neutral-400 text-xs mb-2">
              {t('preferences.itemsClickToSelect', { count: seriesGenreOptions.length })}
            </div>
            <div className="flex flex-wrap gap-2">
              {seriesGenreOptions.map((opt) => {
                const checked = selectedSeriesGenres.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    className={`px-2 py-1 rounded-md border text-xs transition-colors ${
                      checked
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-neutral-800/50 text-neutral-300 border-neutral-700 hover:bg-neutral-700/60"
                    }`}
                    onClick={() => {
                      setSelectedSeriesGenres((prev) => {
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
              {seriesGenreOptions.length === 0 && (
                <span className="text-neutral-500 text-xs">{t('preferences.noCategories')}</span>
              )}
            </div>
          </div>
          <div className="hidden" />
        </div>
      </div>
    </div>
  );
}
