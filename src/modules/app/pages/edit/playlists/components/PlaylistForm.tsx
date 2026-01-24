import { useEffect } from "react";
import { Button } from "@/modules/app/components/ui/button";
import { AccessControl } from "@/permissions/AccessControl";
import { Label } from "@/modules/app/components/ui/label";

import { Edit, X, Image as ImageIcon, Globe, Lock, Save, Layers } from "lucide-react";
import type { Visibility, PlaylistType } from "@/modules/app/pages/Edit/playlists/types";
import { PLAYLIST_TYPE_OPTIONS } from "@/modules/app/pages/Edit/playlists/types";
import { usePreferenceCategoriesStore } from "@/stores/preferenceCategoriesStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/app/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";

interface EditFormState {
  title: string;
  description: string;
  cover: string;
  coverAttachmentId?: string; // Add attachment ID
  visibility: Visibility;
  type: PlaylistType;
  category: string;
  tags: string[];
}

interface PlaylistFormProps {
  /** 是否为创建模式 */
  isCreating: boolean;
  /** 是否为编辑模式 */
  isEditing: boolean;
  /** 受控表单状态 */
  editForm: EditFormState;
  /** 表单变更回调（简化：直接回传新表单对象） */
  onChange: (next: EditFormState) => void;
  /** 触发保存 */
  onSave: () => void;
  /** 取消创建/编辑 */
  onCancel: () => void;
  // Removed manual file upload props
}

/**
 * 片单创建/编辑表单组件：纯展示与交互，逻辑委托给父层。
 */
export function PlaylistForm({
  isCreating,
  isEditing,
  editForm,
  onChange,
  onSave,
  onCancel,
}: PlaylistFormProps) {
  if (!isCreating && !isEditing) return null;

  const { playlist, fetchCategories, isLoaded } = usePreferenceCategoriesStore();

  // 确保分类数据加载
  useEffect(() => {
    if (!isLoaded) {
      fetchCategories();
    }
  }, [isLoaded, fetchCategories]);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600">
            <Edit className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl text-white">{isCreating ? "创建片单" : "编辑片单"}</h2>
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

      {/* 片单标题 */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-300">
          片单标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => onChange({ ...editForm, title: e.target.value })}
          placeholder="输入片单标题..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-10">
        {/* 片单类型 */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            片单类型 <span className="text-red-500">*</span>
          </label>
          <Select
            value={editForm.type}
            onValueChange={(val) => onChange({ ...editForm, type: val as PlaylistType })}
          >
            <SelectTrigger className="h-[42px] w-full border-neutral-700 bg-neutral-900/50 text-white">
              <SelectValue placeholder="选择片单类型" />
            </SelectTrigger>
            <SelectContent>
              {PLAYLIST_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 分类 */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-300">
            片单分类 <span className="text-red-500">*</span>
          </label>
          <Select
            value={editForm.category}
            onValueChange={(val) => onChange({ ...editForm, category: val })}
          >
            <SelectTrigger className="h-[42px] w-full border-neutral-700 bg-neutral-900/50 text-white">
              <SelectValue placeholder="选择片单分类" />
            </SelectTrigger>
            <SelectContent>
              {playlist.map((cat) => (
                <SelectItem key={cat.key} value={cat.key}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 片单描述 */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-300">
          片单描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={editForm.description}
          onChange={(e) => onChange({ ...editForm, description: e.target.value })}
          rows={4}
          placeholder="描述一下这个片单..."
          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
      </div>

      {/* 封面图片 */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-300">
          封面图片 <span className="text-red-500">*</span>
        </label>
        <ImageUpload
          value={editForm.coverAttachmentId}
          defaultPreview={editForm.cover}
          onChange={(id, url) => onChange({ ...editForm, coverAttachmentId: id, cover: url })}
          attachableType="playlist"
          field="cover"
          placeholder="输入图片URL..."
        />
      </div>

      {/* 可见性 */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-300">可见性</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onChange({ ...editForm, visibility: "public" })}
            className={`rounded-xl border p-4 transition-all ${
              editForm.visibility === "public"
                ? "border-green-500/50 bg-green-500/20 text-green-400"
                : "border-neutral-700 bg-neutral-900/30 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            <Globe className="mx-auto mb-2 h-5 w-5" />
            <p className="text-sm">公开</p>
          </button>
          <button
            onClick={() => onChange({ ...editForm, visibility: "private" })}
            className={`rounded-xl border p-4 transition-all ${
              editForm.visibility === "private"
                ? "border-red-500/50 bg-red-500/20 text-red-400"
                : "border-neutral-700 bg-neutral-900/30 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            <Lock className="mx-auto mb-2 h-5 w-5" />
            <p className="text-sm">私密</p>
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        {/* 保存片单按钮：需要片单更新权限 */}
        <AccessControl
          requiredPermissions={["playlist:update"]}
          name="保存片单"
          fallback={
            <Button disabled className="flex-1 bg-neutral-700 text-neutral-400">
              <Save className="mr-2 h-4 w-4" />
              保存片单
            </Button>
          }
        >
          <Button
            onClick={onSave}
            disabled={
              !editForm.title || !editForm.category || !editForm.description || !editForm.cover
            }
            className="flex-1 bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
          >
            <Save className="mr-2 h-4 w-4" />
            保存片单
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
