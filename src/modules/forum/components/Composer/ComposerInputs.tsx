import React from "react";
import { useComposerStore } from "./ComposerStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForumsCategories } from "../../hooks/useForumsCategories";
import { useForumsTagsQuery } from "../../hooks/useForumsTagsQuery";
import { cn } from "@/components/ui/utils";
import { Hash, Tag, Plus, X } from "lucide-react";
import { useForumTheme } from "../../context/ForumThemeContext";

/**
 * Composer 输入区域
 * 参考 Discourse composer-container.gjs 第 240-306 行的布局：
 * - 第一行：标题输入 (全宽)
 * - 第二行：分类选择 + 标签选择
 */
export const ComposerInputs: React.FC = () => {
  const { colors, theme } = useForumTheme();
  const { draft, updateDraft } = useComposerStore();

  // 获取分类列表 (hook 返回的 data 直接是数组)
  const { data: categories = [] } = useForumsCategories();

  // 获取标签列表 (hook 返回的 data 直接是数组)
  const { data: tags = [] } = useForumsTagsQuery();

  // 处理标签选择
  const handleTagToggle = (tagId: string) => {
    const currentTags = draft.tags || [];
    if (currentTags.includes(tagId)) {
      updateDraft({ tags: currentTags.filter((t) => t !== tagId) });
    } else {
      updateDraft({ tags: [...currentTags, tagId] });
    }
  };

  // 移除标签
  const handleTagRemove = (tagId: string) => {
    updateDraft({ tags: (draft.tags || []).filter((t) => t !== tagId) });
  };

  return (
    <div className="composer-fields flex flex-col gap-3">
      {/* 第一行：标题输入 - 参考 Discourse .title-input */}
      <div className="title-input">
        <Input
          id="reply-title"
          placeholder="输入标题，或在此处粘贴链接"
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          className={cn(
            "h-auto rounded-md border border-gray-200 bg-transparent px-3 py-2 text-lg font-medium shadow-none focus-visible:ring-1 focus-visible:ring-[#0088CC] dark:border-neutral-700",
            colors.textPrimary,
            "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
          )}
          autoComplete="off"
        />
      </div>

      {/* 第二行：分类 + 标签 - 参考 Discourse .title-and-category */}
      <div className="title-and-category flex flex-wrap items-center gap-2">
        {/* 分类选择 - 参考 Discourse .category-input */}
        <div className="category-input">
          <Select
            value={draft.categoryId}
            onValueChange={(val) => updateDraft({ categoryId: val })}
          >
            <SelectTrigger
              className={cn("h-8 min-w-[150px] gap-2 text-sm")}
              style={{
                border: draft.categoryId
                  ? theme === "dark"
                    ? "1px solid #525252"
                    : "1px solid #d1d5db"
                  : theme === "dark"
                    ? "1px solid #525252"
                    : "1px solid #d1d5db",
                backgroundColor: draft.categoryId
                  ? `#${categories.find((c) => String((c as any).id) === draft.categoryId)?.color || "333"}30`
                  : theme === "dark"
                    ? "#262626"
                    : "#ffffff",
                color: theme === "dark" ? "#A6A6A6" : "#5F5F5F",
              }}
            >
              <Hash
                className="h-3.5 w-3.5"
                style={{ color: theme === "dark" ? "#a3a3a3" : "#6b7280" }}
              />
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent className={cn(colors.borderColor, colors.inputBg)}>
              {categories.map((cat) => (
                <SelectItem
                  key={cat.slug}
                  value={String((cat as any).id)}
                  className={cn(
                    colors.textSecondary,
                    "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-neutral-700 dark:focus:text-white",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded"
                      style={{ backgroundColor: `#${cat.color}` }}
                    />
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 标签选择 - 参考 Discourse .tags-input */}
        <div className="tags-input flex flex-1 flex-wrap items-center gap-1.5">
          {/* 已选中的标签 */}
          {(draft.tags || []).map((tagName) => {
            const tag = tags.find((t) => t.name === tagName);
            return tag ? (
              <span
                key={tagName}
                className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
                <button
                  onClick={() => handleTagRemove(tagName)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-sky-500/30"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ) : null;
          })}

          {/* 添加标签选择器 */}
          <Select onValueChange={handleTagToggle}>
            <SelectTrigger
              className={cn("h-8 w-auto min-w-[120px] gap-1 border-dashed px-2 text-sm")}
              style={{
                border: theme === "dark" ? "1px dashed #525252" : "1px dashed #9ca3af",
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#A6A6A6" : "#5F5F5F",
              }}
            >
              <Plus
                className="h-3 w-3"
                style={{ color: theme === "dark" ? "#a3a3a3" : "#6b7280" }}
              />
              <span>可选标签</span>
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              {tags
                .filter((tag) => !(draft.tags || []).includes(tag.name))
                .map((tag) => (
                  <SelectItem
                    key={tag.name}
                    value={tag.name}
                    className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 dark:text-neutral-200 dark:focus:bg-neutral-700 dark:focus:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3 text-neutral-400" />
                      <span>{tag.name}</span>
                    </div>
                  </SelectItem>
                ))}
              {tags.filter((tag) => !(draft.tags || []).includes(tag.name)).length === 0 && (
                <div className="px-2 py-1.5 text-xs text-neutral-500">没有更多标签</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-px w-full bg-neutral-700/50" />
    </div>
  );
};
