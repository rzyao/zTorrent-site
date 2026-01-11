import { useEffect, useState, useCallback } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Label } from "@/modules/admin/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { PlaylistsService } from "@/api/services/PlaylistsService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import {
  PlaylistItem,
  PlaylistType,
  PlaylistVisibility,
  TYPE_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../types";

interface PlaylistModalProps {
  /** Modal 是否打开 */
  open: boolean;
  /** 打开状态变更回调 */
  onOpenChange: (open: boolean) => void;
  /** 编辑记录，null 表示新增模式 */
  record: PlaylistItem | null;
  /** 操作成功后的回调 */
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  description: string;
  coverUrl: string;
  type: PlaylistType | "";
  visibility: PlaylistVisibility | "";
  enabled: boolean;
  sort: number;
}

const INITIAL_FORM_DATA: FormData = {
  title: "",
  description: "",
  coverUrl: "",
  type: "",
  visibility: "",
  enabled: true,
  sort: 0,
};

/**
 * 片单新增/编辑弹窗组件
 */
export function PlaylistModal({ open, onOpenChange, record, onSuccess }: PlaylistModalProps) {
  const isEdit = !!record;
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // 表单验证错误
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // 编辑模式时填充数据
  useEffect(() => {
    if (open && record) {
      setFormData({
        title: record.title || "",
        description: "",
        coverUrl: record.coverUrl || "",
        type: record.type || "",
        visibility: record.visibility || "",
        enabled: record.enabled ?? true,
        sort: record.sort || 0,
      });
      setErrors({});
    } else if (open && !record) {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
    }
  }, [open, record]);

  // 字段更新
  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // 表单验证
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.title.trim()) {
      newErrors.title = "请输入标题";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 提交操作
  const { execute: executeSubmit, loading: submitting } = useAsyncAction({
    successMessage: isEdit ? "更新片单成功" : "新增片单成功",
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    executeSubmit(async () => {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        coverUrl: formData.coverUrl || undefined,
        type: formData.type || undefined,
        visibility: formData.visibility || undefined,
        enabled: formData.enabled,
        sort: formData.sort || undefined,
      };

      if (isEdit && record) {
        await PlaylistsService.playlistCoreControllerUpdate({
          id: record.id,
          data: payload,
        } as any);
      } else {
        await PlaylistsService.playlistCoreControllerCreate(payload as any);
      }
    });
  }, [isEdit, record, formData, validate, executeSubmit]);

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEdit ? "编辑片单" : "新增片单"}
      okText="保存"
      confirmLoading={submitting}
      onOk={handleSubmit}
      width={520}
    >
      <div className="space-y-4">
        {/* ID (仅编辑时显示) */}
        {isEdit && record && (
          <div className="space-y-1.5">
            <Label>ID</Label>
            <Input value={record.id} disabled />
          </div>
        )}

        {/* 标题 */}
        <div className="space-y-1.5">
          <Label>
            标题 <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="请输入片单标题"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* 描述 */}
        <div className="space-y-1.5">
          <Label>描述</Label>
          <Textarea
            placeholder="请输入描述"
            rows={3}
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        {/* 封面 URL */}
        <div className="space-y-1.5">
          <Label>封面 URL</Label>
          <Input
            placeholder="https://..."
            value={formData.coverUrl}
            onChange={(e) => updateField("coverUrl", e.target.value)}
          />
        </div>

        {/* 类型 */}
        <div className="space-y-1.5">
          <Label>类型</Label>
          <Select
            value={formData.type}
            onValueChange={(val) => updateField("type", val as PlaylistType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="请选择类型" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 可见性 */}
        <div className="space-y-1.5">
          <Label>可见性</Label>
          <Select
            value={formData.visibility}
            onValueChange={(val) => updateField("visibility", val as PlaylistVisibility)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="请选择可见性" />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 排序 */}
        <div className="space-y-1.5">
          <Label>排序</Label>
          <Input
            type="number"
            className="w-40"
            value={formData.sort}
            onChange={(e) => updateField("sort", parseInt(e.target.value) || 0)}
          />
        </div>

        {/* 启用 */}
        <div className="flex items-center gap-3">
          <Label>启用</Label>
          <Switch
            checked={formData.enabled}
            onCheckedChange={(checked) => updateField("enabled", checked)}
          />
        </div>
      </div>
    </Modal>
  );
}
