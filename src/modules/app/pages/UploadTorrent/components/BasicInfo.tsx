import React, { memo } from "react";
import { FileText } from "lucide-react";
import { Separator } from "@/modules/app/components/ui/separator";
import { Checkbox } from "@/modules/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/app/components/ui/select";
import { CategoryTree } from "@/modules/app/types/UploadTorrentPage";

/**
 * BasicInfo
 * 纯展示组件：负责渲染“基本信息”板块（种子选择、分类/标签、标题、副标题）。
 * - 所有数据通过 props 传入；
 * - 所有交互通过回调 props 传出；
 * - 不持有任何业务状态，便于复用与测试。
 */
export interface BasicInfoProps {
  mainCategories: CategoryTree;
  selectedCategory: string;
  selectedTags: string[];
  tags: { id: string; name: string }[];
  onChangeCategory: (val: string) => void;
  onClearTags: () => void;
  onToggleTag: (id: string) => void;
  onTorrentInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  onTitleChange: (val: string) => void;
  subTitle: string;
  onSubTitleChange: (val: string) => void;
}

export const BasicInfo = memo(function BasicInfo(props: BasicInfoProps) {
  const {
    mainCategories,
    selectedCategory,
    selectedTags,
    tags,
    onChangeCategory,
    onClearTags,
    onToggleTag,
    onTorrentInputChange,
    title,
    onTitleChange,
    subTitle,
    onSubTitleChange,
  } = props;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-700/50 bg-neutral-800/40 shadow-2xl backdrop-blur-sm">
      {/* 模块标题区域 */}
      <div className="border-b border-neutral-700/50 bg-linear-to-r from-amber-500/20 to-orange-500/20 px-6 py-3.5">
        <h2 className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-amber-400" />
          基本信息
        </h2>
      </div>

      <div className="space-y-3 px-6 py-3">
        {/* 选择种子文件 */}
        <div className="grid grid-cols-[160px_1fr] gap-2">
          <label className="flex items-center gap-1 text-sm text-neutral-300">
            选择种子 <span className="text-red-400">*</span>
          </label>
          <div>
            <input
              type="file"
              accept=".torrent"
              className="w-full cursor-pointer rounded-lg border border-neutral-700/60 bg-neutral-900/60 px-2 py-1.5 text-sm text-white transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-linear-to-r file:from-amber-500 file:to-orange-600 file:px-4 file:py-1.5 file:text-sm file:text-white hover:file:from-amber-600 hover:file:to-orange-700"
              onChange={onTorrentInputChange}
            />
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 分类选择 */}
        <div className="grid grid-cols-[160px_1fr] gap-2">
          <label className="flex items-center gap-1 text-sm text-neutral-300">
            分类 <span className="text-red-400">*</span>
          </label>
          <div>
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                onChangeCategory(val);
                onClearTags();
              }}
            >
              <SelectTrigger className="w-[160px] rounded-lg border border-neutral-700/60 bg-neutral-900/60 px-4 py-2 text-sm text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30">
                <SelectValue placeholder="请选择分类" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg">
                <SelectGroup>
                  {mainCategories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="text-white hover:bg-neutral-700 focus:bg-neutral-700"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 标签复选 */}
        <div className="grid grid-cols-[160px_1fr] gap-2 py-1">
          <label className="space-y-6 text-sm text-neutral-300">标签</label>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="group flex min-w-[80px] cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => onToggleTag(tag.id)}
                    className="border-neutral-600 data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500"
                  />
                  <span className="text-sm text-neutral-400 transition-colors group-hover:text-white">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 标题输入 */}
        <div className="grid grid-cols-[160px_1fr] gap-2">
          <label className="flex items-center gap-1 text-sm text-neutral-300">
            标题 <span className="text-red-400">*</span>
          </label>
          <div>
            <input
              type="text"
              placeholder="例如: 星际穿越 Interstellar (2014)"
              className="w-full rounded-lg border border-neutral-700/60 bg-neutral-900/60 px-4 py-2.5 text-sm text-white transition-all outline-none placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 副标题输入 */}
        <div className="grid grid-cols-[160px_1fr] gap-2">
          <label className="flex items-center gap-1 text-sm text-neutral-300">
            副标题 <span className="text-red-400">*</span>
          </label>
          <div>
            <input
              type="text"
              placeholder="例如: 4K HDR REMUX 国英双语 中英字幕 BluRay 杜比全景声"
              className="w-full rounded-lg border border-neutral-700/60 bg-neutral-900/60 px-4 py-2.5 text-sm text-white transition-all outline-none placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              value={subTitle}
              onChange={(e) => onSubTitleChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
