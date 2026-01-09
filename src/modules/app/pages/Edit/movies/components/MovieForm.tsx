import { useEffect } from "react";
import { Button } from "@/modules/app/components/ui/button";
import { AccessControl } from "@/components/AccessControl";
import { Checkbox } from "@/modules/app/components/ui/checkbox";
import { Edit, X, Image as ImageIcon, Save } from "lucide-react";
import type { MovieFormState } from "@/modules/app/pages/Edit/movies/types";
import { isValidUrl } from "@/modules/app/pages/Edit/movies/utils";
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
  const categories = usePreferenceCategoriesStore((state) => state.movie);
  const isLoaded = usePreferenceCategoriesStore((state) => state.isLoaded);
  const fetchCategories = usePreferenceCategoriesStore((state) => state.fetchCategories);

  // 确保编辑器挂载时如果分类数据未加载，则主动加载
  useEffect(() => {
    if (!isLoaded) {
      fetchCategories();
    }
  }, [isLoaded, fetchCategories]);

  if (!isCreating && !isEditing) return null;
  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600">
            <Edit className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl text-white">{isCreating ? "添加影片" : "编辑影片"}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-neutral-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-amber-500/30 bg-neutral-900/30 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={ptGenUrl}
              onChange={(e) => onPtGenUrlChange(e.target.value)}
              placeholder="输入 Douban/IMDb 页面链接，例：https://movie.douban.com/subject/4092781/"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
            <Button
              onClick={onFetchPtGen}
              disabled={ptGenLoading}
              className="bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
            >
              {ptGenLoading ? "获取中..." : "获取并填充"}
            </Button>
          </div>
          {ptGenError && <p className="mt-2 text-xs text-red-500">{ptGenError}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">
            中文标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="例如: 星际穿越"
            aria-invalid={Boolean(errors.title)}
            className={`w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
              errors.title ? "border-red-500" : "border-neutral-700"
            }`}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">原始标题</label>
          <input
            type="text"
            value={form.originalTitle}
            onChange={(e) => onChange({ ...form, originalTitle: e.target.value })}
            placeholder="例如: Interstellar"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">年份</label>
          <input
            type="text"
            value={form.year}
            onChange={(e) => onChange({ ...form, year: e.target.value })}
            placeholder="例如: 2014 或 2014-2020"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-neutral-300">
            分类 (多选) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-x-2 gap-y-3 rounded-lg border border-neutral-700 bg-neutral-900/50 p-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">
            {categories.map((cat) => {
              const isChecked = form.categories.includes(cat.label);
              return (
                <label key={cat.key} className="group flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange({
                          ...form,
                          categories: [...form.categories, cat.label],
                        });
                      } else {
                        onChange({
                          ...form,
                          categories: form.categories.filter((c) => c !== cat.label),
                        });
                      }
                    }}
                    className="border-neutral-600 data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500"
                  />
                  <span className="text-xs whitespace-nowrap text-neutral-300">{cat.label}</span>
                </label>
              );
            })}
          </div>
          {errors.categories && <p className="text-xs text-red-500">{errors.categories}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">评分</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.rating}
            onChange={(e) => onChange({ ...form, rating: parseFloat(e.target.value) })}
            placeholder="例如: 9.8"
            aria-invalid={Boolean(errors.rating)}
            className={`w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
              errors.rating ? "border-red-500" : "border-neutral-700"
            }`}
          />
          {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">时长/集数</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => onChange({ ...form, duration: e.target.value })}
            placeholder="例如: 169分钟 或 全8季"
            className={`w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">导演</label>
        <input
          type="text"
          value={form.director}
          onChange={(e) => onChange({ ...form, director: e.target.value })}
          placeholder="例如: 克里斯托弗·诺兰"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">主演（用逗号分隔）</label>
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
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">语言（用逗号分隔）</label>
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
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">地区（用逗号分隔）</label>
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
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">豆瓣链接</label>
          <input
            type="text"
            value={form.doubanLink}
            onChange={(e) => onChange({ ...form, doubanLink: e.target.value })}
            placeholder="例如: https://movie.douban.com/subject/4092781/"
            aria-invalid={Boolean(form.doubanLink && !isValidUrl(form.doubanLink))}
            className={`w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
              form.doubanLink && !isValidUrl(form.doubanLink)
                ? "border-red-500"
                : "border-neutral-700"
            }`}
          />
          {errors.doubanLink && <p className="text-xs text-red-500">{errors.doubanLink}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">IMDb 链接</label>
          <input
            type="text"
            value={form.imdbLink}
            onChange={(e) => onChange({ ...form, imdbLink: e.target.value })}
            placeholder="例如: https://www.imdb.com/title/tt1527793/"
            aria-invalid={Boolean(form.imdbLink && !isValidUrl(form.imdbLink))}
            className={`w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
              form.imdbLink && !isValidUrl(form.imdbLink) ? "border-red-500" : "border-neutral-700"
            }`}
          />
          {errors.imdbLink && <p className="text-xs text-red-500">{errors.imdbLink}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">豆瓣评分（平均）</label>
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
            className={`w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none`}
          />
          {errors.doubanRatingAverage && (
            <p className="text-xs text-red-500">{errors.doubanRatingAverage}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">IMDb 评分（平均）</label>
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
            className={`w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none`}
          />
          {errors.imdbRatingAverage && (
            <p className="text-xs text-red-500">{errors.imdbRatingAverage}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">获奖情况（每行一条）</label>
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
          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">简介</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          rows={4}
          placeholder="输入影片简介..."
          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">
          海报图片 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={form.poster}
            onChange={(e) => onChange({ ...form, poster: e.target.value })}
            placeholder="输入图片URL..."
            aria-invalid={Boolean(errors.poster)}
            className={`flex-1 rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
              errors.poster ? "border-red-500" : "border-neutral-700"
            }`}
          />
          {/* 上传海报按钮：默认权限，不做权限控制 */}
          <Button
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            上传
          </Button>
        </div>
        {errors.poster && <p className="text-xs text-red-500">{errors.poster}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">背景图片</label>
        <input
          type="text"
          value={form.backdrop}
          onChange={(e) => onChange({ ...form, backdrop: e.target.value })}
          placeholder="输入图片URL..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        {/* 保存影片按钮：需要影片更新权限 */}
        <AccessControl
          requiredPermissions={["movie:update"]}
          name="保存影片"
          fallback={
            <Button disabled className="flex-1 bg-neutral-700 text-neutral-400">
              <Save className="mr-2 h-4 w-4" />
              保存影片
            </Button>
          }
        >
          <Button
            onClick={onSave}
            disabled={
              !form.title ||
              form.categories.length === 0 ||
              !form.poster ||
              Object.keys(errors).length > 0
            }
            className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
          >
            <Save className="mr-2 h-4 w-4" />
            保存影片
          </Button>
        </AccessControl>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-700/30 hover:text-white"
        >
          取消
        </Button>
      </div>
    </div>
  );
}
