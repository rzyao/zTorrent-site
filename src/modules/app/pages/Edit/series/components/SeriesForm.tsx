import { useEffect, useRef, useState } from "react";
import { Button } from "@/modules/app/components/ui/button";
import { AccessControl } from "@/permissions/AccessControl";
import { Checkbox } from "@/modules/app/components/ui/checkbox";
import { Edit, X, Image as ImageIcon, Save } from "lucide-react";
import type { SeriesFormState } from "@/modules/app/pages/Edit/series/types";
import { isValidUrl } from "@/modules/app/pages/Edit/movies/utils"; // reuse validUrl
import { usePreferenceCategoriesStore } from "@/stores/preferenceCategoriesStore";
import { ImagesService } from "@/api/services/ImagesService";

interface SeriesFormProps {
  isCreating: boolean;
  isEditing: boolean;
  form: SeriesFormState;
  errors: Record<string, string>;
  onChange: (next: SeriesFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  ptGenUrl: string;
  onPtGenUrlChange: (v: string) => void;
  ptGenLoading: boolean;
  ptGenError: string;
  onFetchPtGen: () => void;
}

const GENRE_OPTIONS = [
  "剧情",
  "喜剧",
  "动作",
  "冒险",
  "奇幻",
  "科幻",
  "悬疑",
  "惊悚",
  "恐怖",
  "犯罪",
  "历史",
  "战争",
  "纪录片",
  "传记",
  "家庭",
  "动画",
  "武侠",
  "古装",
  "真人秀",
  "嘉年华",
];

export function SeriesForm({
  isCreating,
  isEditing,
  form,
  errors,
  onChange,
  onSave,
  onCancel,
  ptGenUrl,
  onPtGenUrlChange,
  ptGenLoading,
  ptGenError,
  onFetchPtGen,
}: SeriesFormProps) {
  const { series, fetchCategories, isLoaded } = usePreferenceCategoriesStore();
  const categories = series;

  useEffect(() => {
    if (!isLoaded) {
      fetchCategories();
    }
  }, [isLoaded, fetchCategories]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const content = reader.result as string;
        try {
          const res = await ImagesService.imagesControllerUpload({
            content,
            filename: file.name,
            mimeType: file.type,
          });
          if (res?.data?.url) {
            onChange({ ...form, poster: res.data.url });
          }
        } catch (error) {
          console.error("Upload failed", error);
          alert("上传失败，请重试");
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
    }
  };

  if (!isCreating && !isEditing) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Edit className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-white text-xl">
            {isCreating ? "添加剧集" : "编辑剧集"}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {isCreating && (
        <div className="p-4 rounded-xl bg-neutral-900/30 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={ptGenUrl}
              onChange={(e) => onPtGenUrlChange(e.target.value)}
              placeholder="输入 Douban/IMDb 页面链接"
              className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
            <Button
              onClick={onFetchPtGen}
              disabled={ptGenLoading}
              className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              {ptGenLoading ? "获取中..." : "获取并填充"}
            </Button>
          </div>
          {ptGenError && (
            <p className="text-red-500 text-xs mt-2">{ptGenError}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">
            中文标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="例如: 权力的游戏"
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${errors.title ? "border-red-500" : "border-neutral-700"
              }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">原始标题</label>
          <input
            type="text"
            value={form.originalTitle}
            onChange={(e) =>
              onChange({ ...form, originalTitle: e.target.value })
            }
            placeholder="例如: Game of Thrones"
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-neutral-300 text-sm">
            分类 (单选) <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3 p-3 bg-neutral-900/50 border border-neutral-700 rounded-lg">
            {categories.map((cat) => {
              const isChecked = form.categories.includes(cat.label);
              return (
                <label
                  key={cat.key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isChecked
                        ? "border-amber-500 bg-amber-500"
                        : "border-neutral-600 group-hover:border-neutral-500"
                      }`}
                  >
                    {isChecked && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="category"
                    className="hidden"
                    checked={isChecked}
                    onChange={() => {
                      onChange({
                        ...form,
                        categories: [cat.label],
                      });
                    }}
                  />
                  <span className="text-neutral-300 text-sm">{cat.label}</span>
                </label>
              );
            })}
          </div>
          {errors.categories && (
            <p className="text-red-500 text-xs">{errors.categories}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-neutral-300 text-sm">类型 (多选)</label>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-x-2 gap-y-3 p-3 bg-neutral-900/50 border border-neutral-700 rounded-lg">
            {GENRE_OPTIONS.map((genre) => {
              const isChecked = form.genres.includes(genre);
              return (
                <label
                  key={genre}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange({
                          ...form,
                          genres: [...form.genres, genre],
                        });
                      } else {
                        onChange({
                          ...form,
                          genres: form.genres.filter((g) => g !== genre),
                        });
                      }
                    }}
                    className="border-neutral-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <span className="text-neutral-300 text-xs whitespace-nowrap">
                    {genre}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">发行年份</label>
          <input
            type="text"
            value={form.year}
            onChange={(e) => onChange({ ...form, year: e.target.value })}
            placeholder="例如: 2011"
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">总集数</label>
          <input
            type="number"
            min="0"
            value={form.episodeCount}
            onChange={(e) =>
              onChange({ ...form, episodeCount: parseInt(e.target.value) || 0 })
            }
            placeholder="例如: 10"
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">状态</label>
          <select
            value={form.status}
            onChange={(e) => onChange({ ...form, status: e.target.value })}
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="airing">连载中 (Airing)</option>
            <option value="ended">已完结 (Ended)</option>
            <option value="upcoming">即将上映 (Upcoming)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">单集时长</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => onChange({ ...form, duration: e.target.value })}
            placeholder="例如: 60分钟"
            className="w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border border-neutral-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">评分</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.rating}
            onChange={(e) =>
              onChange({ ...form, rating: parseFloat(e.target.value) })
            }
            placeholder="例如: 9.3"
            className="w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border border-neutral-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">导演</label>
        <input
          type="text"
          value={form.director}
          onChange={(e) => onChange({ ...form, director: e.target.value })}
          placeholder="例如: 艾伦·泰勒"
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">主演（用逗号分隔）</label>
        <input
          type="text"
          value={form.cast.join(", ")}
          onChange={(e) =>
            onChange({
              ...form,
              cast: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="例如: 艾米莉亚·克拉克, 基特·哈灵顿"
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">简介</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          rows={4}
          placeholder="输入剧集简介..."
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">
          海报图片 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={form.poster}
            onChange={(e) => onChange({ ...form, poster: e.target.value })}
            placeholder="输入图片URL..."
            aria-invalid={Boolean(errors.poster)}
            className={`flex-1 bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${errors.poster ? "border-red-500" : "border-neutral-700"
              }`}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          {/* 上传海报按钮：默认权限，不做权限控制 */}
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            {uploading ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <ImageIcon className="w-4 h-4 mr-2" />
            )}
            {uploading ? "上传中" : "上传"}
          </Button>
        </div>
        {errors.poster && (
          <p className="text-red-500 text-xs">{errors.poster}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">背景图片</label>
        <input
          type="text"
          value={form.backdrop}
          onChange={(e) => onChange({ ...form, backdrop: e.target.value })}
          placeholder="输入图片URL..."
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="flex gap-3 pt-4">
        {/* 保存剧集按钮：需要剧集更新权限 */}
        <AccessControl
          requiredPermissions={["series:update"]}
          name="保存剧集"
          fallback={
            <Button disabled className="flex-1 bg-neutral-700 text-neutral-400">
              <Save className="w-4 h-4 mr-2" />
              保存剧集
            </Button>
          }
        >
          <Button
            onClick={onSave}
            disabled={!form.title || form.categories.length === 0 || !form.poster}
            className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Save className="w-4 h-4 mr-2" />
            保存剧集
          </Button>
        </AccessControl>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700/30"
        >
          取消
        </Button>
      </div>
    </div>
  );
}
