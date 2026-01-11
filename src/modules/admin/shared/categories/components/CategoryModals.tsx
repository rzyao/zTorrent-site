import { useEffect, useState } from "react";
import { Form } from "antd";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Switch } from "@/modules/admin/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import type { CategoryItem } from "../types";

interface CategoryModalsProps {
  // Create
  createOpen: boolean;
  createForm: any;
  createInitial?: any;
  createKeyPrefix?: string;
  onCancelCreate: () => void;
  onSubmitCreate: () => void;
  // Edit
  editOpen: boolean;
  editForm: any;
  editInitial?: any;
  editing: CategoryItem | null;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
}

/**
 * 新增分类表单
 */
function CreateCategoryForm({
  form,
  initial,
  keyPrefix,
}: {
  form: any;
  initial?: any;
  keyPrefix?: string;
}) {
  const [formState, setFormState] = useState({
    key: "",
    keySuffix: "",
    label: "",
    description: "",
    sort: 0,
    enabled: true,
    genre: UpdateCategoryDto.genre.GENERAL,
  });

  // 同步初始值
  useEffect(() => {
    if (initial) {
      setFormState((prev) => ({
        ...prev,
        enabled: initial.enabled ?? true,
        sort: initial.sort ?? 0,
        genre: initial.genre ?? UpdateCategoryDto.genre.GENERAL,
      }));
      form.setFieldsValue(initial);
    }
  }, [initial, form]);

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    form.setFieldValue(field, value);
  };

  return (
    <div className="space-y-4">
      {/* 键 */}
      {keyPrefix ? (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">
            键后缀 <span className="text-neutral-400">(父类: {keyPrefix})</span>
          </label>
          <Input
            placeholder="如 action 或 classic"
            value={formState.keySuffix}
            onChange={(e) => handleChange("keySuffix", e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">
            唯一键 <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="如 movies"
            value={formState.key}
            onChange={(e) => handleChange("key", e.target.value)}
          />
        </div>
      )}

      {/* 名称 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">
          名称 <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="分类名称"
          value={formState.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />
      </div>

      {/* 排序和启用 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">排序</label>
          <Input
            type="number"
            min={0}
            value={formState.sort}
            onChange={(e) => handleChange("sort", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">启用</label>
          <div className="flex h-8 items-center">
            <Switch
              checked={formState.enabled}
              onCheckedChange={(v) => handleChange("enabled", v)}
            />
          </div>
        </div>
      </div>

      {/* 分区 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">
          分区 <span className="text-red-500">*</span>
        </label>
        <Select value={formState.genre} onValueChange={(v) => handleChange("genre", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择分区" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UpdateCategoryDto.genre.GENERAL}>普通</SelectItem>
            <SelectItem value={UpdateCategoryDto.genre.ADULT}>成人</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 描述 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">描述</label>
        <textarea
          className="focus:border-antd-primary flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="分类描述（可选）"
          value={formState.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}

/**
 * 编辑分类表单
 */
function EditCategoryForm({
  form,
  initial,
  editing,
}: {
  form: any;
  initial?: any;
  editing: CategoryItem | null;
}) {
  const [formState, setFormState] = useState({
    label: "",
    description: "",
    sort: 0,
    enabled: true,
    genre: UpdateCategoryDto.genre.GENERAL,
  });

  useEffect(() => {
    if (initial) {
      setFormState({
        label: initial.label ?? "",
        description: initial.description ?? "",
        sort: initial.sort ?? 0,
        enabled: initial.enabled ?? true,
        genre: initial.genre ?? UpdateCategoryDto.genre.GENERAL,
      });
      form.setFieldsValue(initial);
    }
  }, [initial, form]);

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    form.setFieldValue(field, value);
  };

  return (
    <div className="space-y-4">
      {/* 唯一键（只读） */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">唯一键</label>
        <Input value={editing?.key || ""} disabled />
      </div>

      {/* 名称 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">
          名称 <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="分类名称"
          value={formState.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />
      </div>

      {/* 排序和启用 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">排序</label>
          <Input
            type="number"
            min={0}
            value={formState.sort}
            onChange={(e) => handleChange("sort", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">启用</label>
          <div className="flex h-8 items-center">
            <Switch
              checked={formState.enabled}
              onCheckedChange={(v) => handleChange("enabled", v)}
            />
          </div>
        </div>
      </div>

      {/* 分区 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">分区</label>
        <Select value={formState.genre} onValueChange={(v) => handleChange("genre", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择分区" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UpdateCategoryDto.genre.GENERAL}>普通</SelectItem>
            <SelectItem value={UpdateCategoryDto.genre.ADULT}>成人</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 描述 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">描述</label>
        <textarea
          className="focus:border-antd-primary flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="分类描述（可选）"
          value={formState.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}

export function CategoryModals({
  createOpen,
  createForm,
  createInitial,
  createKeyPrefix,
  onCancelCreate,
  onSubmitCreate,
  editOpen,
  editForm,
  editInitial,
  editing,
  onCancelEdit,
  onSubmitEdit,
}: CategoryModalsProps) {
  return (
    <>
      {/* 新增分类弹窗 */}
      <Modal
        title={createKeyPrefix ? "新增子分类" : "新增分类"}
        open={createOpen}
        onClose={onCancelCreate}
        onOk={onSubmitCreate}
        okText="保存"
        cancelText="取消"
        width={480}
      >
        <CreateCategoryForm form={createForm} initial={createInitial} keyPrefix={createKeyPrefix} />
      </Modal>

      {/* 编辑分类弹窗 */}
      <Modal
        title="编辑分类"
        open={editOpen}
        onClose={onCancelEdit}
        onOk={onSubmitEdit}
        okText="保存"
        cancelText="取消"
        width={480}
      >
        <EditCategoryForm form={editForm} initial={editInitial} editing={editing} />
      </Modal>
    </>
  );
}
