import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, X, Image as ImageIcon, Save } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { MovieFormState } from "@/pages/Edit/movies/types";
import { isValidUrl } from "@/pages/Edit/movies/utils";
import { usePreferenceCategoriesStore } from "@/stores/preferenceCategoriesStore";

interface MovieFormProps {
  isCreating: boolean;
  isEditing: boolean;
  form: MovieFormState;
  errors: Record<string, string>;
  onChange: (next: MovieFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  ptGenUrl: string;
  onPtGenUrlChange: (v: string) => void;
  ptGenLoading: boolean;
  ptGenError: string;
  onFetchPtGen: () => void;
}

export function MovieForm({
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
}: MovieFormProps) {
  // 从全局状态获取影片分类数据
  const categories = usePreferenceCategoriesStore((state) => state.film);

  if (!isCreating && !isEditing) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Edit className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-white text-xl">
            {isCreating ? "添加影片" : "编辑影片"}
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
              placeholder="输入 Douban/IMDb 页面链接，例：https://movie.douban.com/subject/4092781/"
              className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
            <Button
              onClick={onFetchPtGen}
              disabled={ptGenLoading}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
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
            placeholder="例如: 星际穿越"
            aria-invalid={Boolean(errors.title)}
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${
              errors.title ? "border-red-500" : "border-neutral-700"
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
            placeholder="例如: Interstellar"
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">
            年份 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.year}
            onChange={(e) => onChange({ ...form, year: e.target.value })}
            placeholder="例如: 2014"
            aria-invalid={Boolean(errors.year)}
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${
              errors.year ? "border-red-500" : "border-neutral-700"
            }`}
          />
          {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">
            类别 <span className="text-red-500">*</span>
          </label>
          <div>
            <Select
              value={form.category}
              onValueChange={(v) => onChange({ ...form, category: v })}
            >
              <SelectTrigger
                aria-invalid={Boolean(errors.category)}
                className="py-5 text-neutral-100 text-sm"
              >
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.label}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category}</p>
          )}
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
            placeholder="例如: 9.8"
            aria-invalid={Boolean(errors.rating)}
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${
              errors.rating ? "border-red-500" : "border-neutral-700"
            }`}
          />
          {errors.rating && (
            <p className="text-red-500 text-xs">{errors.rating}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">时长/集数</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => onChange({ ...form, duration: e.target.value })}
            placeholder="例如: 169分钟 或 全8季"
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border border-neutral-700`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">导演</label>
        <input
          type="text"
          value={form.director}
          onChange={(e) => onChange({ ...form, director: e.target.value })}
          placeholder="例如: 克里斯托弗·诺兰"
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
          placeholder="例如: 马修·麦康纳, 安妮·海瑟薇"
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">
          类型标签（用逗号分隔）
        </label>
        <input
          type="text"
          value={form.genres.join(", ")}
          onChange={(e) =>
            onChange({
              ...form,
              genres: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="例如: 科幻, 剧情, 冒险"
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">语言（用逗号分隔）</label>
          <input
            type="text"
            value={form.language.join(", ")}
            onChange={(e) =>
              onChange({
                ...form,
                language: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="例如: 韩语, 英语"
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">地区（用逗号分隔）</label>
          <input
            type="text"
            value={form.region.join(", ")}
            onChange={(e) =>
              onChange({
                ...form,
                region: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="例如: 韩国"
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">豆瓣链接</label>
          <input
            type="text"
            value={form.doubanLink}
            onChange={(e) => onChange({ ...form, doubanLink: e.target.value })}
            placeholder="例如: https://movie.douban.com/subject/4092781/"
            aria-invalid={Boolean(
              form.doubanLink && !isValidUrl(form.doubanLink)
            )}
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${
              form.doubanLink && !isValidUrl(form.doubanLink)
                ? "border-red-500"
                : "border-neutral-700"
            }`}
          />
          {errors.doubanLink && (
            <p className="text-red-500 text-xs">{errors.doubanLink}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">IMDb 链接</label>
          <input
            type="text"
            value={form.imdbLink}
            onChange={(e) => onChange({ ...form, imdbLink: e.target.value })}
            placeholder="例如: https://www.imdb.com/title/tt1527793/"
            aria-invalid={Boolean(form.imdbLink && !isValidUrl(form.imdbLink))}
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border ${
              form.imdbLink && !isValidUrl(form.imdbLink)
                ? "border-red-500"
                : "border-neutral-700"
            }`}
          />
          {errors.imdbLink && (
            <p className="text-red-500 text-xs">{errors.imdbLink}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">豆瓣评分（平均）</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.doubanRatingAverage}
            onChange={(e) =>
              onChange({
                ...form,
                doubanRatingAverage: parseFloat(e.target.value),
              })
            }
            placeholder="例如: 7.3"
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border`}
          />
          {errors.doubanRatingAverage && (
            <p className="text-red-500 text-xs">{errors.doubanRatingAverage}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-neutral-300 text-sm">IMDb 评分（平均）</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.imdbRatingAverage}
            onChange={(e) =>
              onChange({
                ...form,
                imdbRatingAverage: parseFloat(e.target.value),
              })
            }
            placeholder="例如: 7.6"
            className={`w-full bg-neutral-900/50 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 border`}
          />
          {errors.imdbRatingAverage && (
            <p className="text-red-500 text-xs">{errors.imdbRatingAverage}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">获奖情况（每行一条）</label>
        <textarea
          value={form.awards.join("\n")}
          onChange={(e) =>
            onChange({
              ...form,
              awards: e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          rows={4}
          placeholder="例如: 第82届威尼斯电影节 主竞赛单元 金狮奖(提名)"
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">简介</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          rows={4}
          placeholder="输入影片简介..."
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">海报图片</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={form.poster}
            onChange={(e) => onChange({ ...form, poster: e.target.value })}
            placeholder="输入图片URL..."
            className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
          <Button
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            上传
          </Button>
        </div>
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
        <Button
          onClick={onSave}
          disabled={!form.title || Object.keys(errors).length > 0}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
        >
          <Save className="w-4 h-4 mr-2" />
          保存影片
        </Button>
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
