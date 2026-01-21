import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Label } from "@/modules/admin/components/ui/label";
import { Checkbox } from "@/modules/admin/components/ui/checkbox";
import { STRATEGY_TYPE_OPTIONS, DISPLAY_STYLE_OPTIONS } from "../constants";
import type { RecommendationFormData } from "../types";

interface RecommendationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: RecommendationFormData;
  updateFormField: <K extends keyof RecommendationFormData>(
    field: K,
    value: RecommendationFormData[K],
  ) => void;
  tabOptions: { label: string; value: string }[];
  onFinish: () => Promise<void>;
  loading?: boolean;
}

/**
 * 推荐配置编辑弹窗
 * 使用受控表单模式
 */
export function RecommendationModal({
  open,
  onOpenChange,
  isEdit,
  formData,
  updateFormField,
  tabOptions,
  onFinish,
  loading,
}: RecommendationModalProps) {
  // 多选 Tab 的处理函数
  const handleTabToggle = (tabId: string, checked: boolean) => {
    const currentIds = formData.tabIds ?? [];
    if (checked) {
      updateFormField("tabIds", [...currentIds, tabId]);
    } else {
      updateFormField(
        "tabIds",
        currentIds.filter((id) => id !== tabId),
      );
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑推荐配置" : "新建推荐配置"}
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onFinish}
      confirmLoading={loading}
      width={560}
    >
      <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
        {/* 板块标题 */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <Label className="text-right">
            <span className="text-destructive">*</span> 板块标题
          </Label>
          <Input
            placeholder="例如：本周最热"
            value={formData.title ?? ""}
            onChange={(e) => updateFormField("title", e.target.value)}
          />
        </div>

        {/* 关联 Tab - 使用 Checkbox 列表替代多选 Select */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-2">
          <Label className="pt-2 text-right">
            <span className="text-destructive">*</span> 关联 Tab
          </Label>
          <div className="space-y-2">
            <div className="max-h-32 overflow-y-auto rounded border border-gray-200 p-2">
              {tabOptions.length === 0 ? (
                <span className="text-sm text-gray-400">暂无可选 Tab</span>
              ) : (
                <div className="space-y-1.5">
                  {tabOptions.map((tab) => (
                    <label key={tab.value} className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={(formData.tabIds ?? []).includes(tab.value)}
                        onCheckedChange={(checked) => handleTabToggle(tab.value, !!checked)}
                      />
                      <span className="text-sm">{tab.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-xs">此板块将展示在选中的所有 Tab 下</p>
          </div>
        </div>

        {/* 推荐策略 */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <Label className="text-right">
            <span className="text-destructive">*</span> 推荐策略
          </Label>
          <Select
            options={STRATEGY_TYPE_OPTIONS.filter((o) => o.value !== "all")}
            placeholder="请选择推荐逻辑"
            value={formData.type}
            onValueChange={(value) => updateFormField("type", value)}
          />
        </div>

        {/* 时间范围 */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-2">
          <Label className="pt-2 text-right">时间范围(天)</Label>
          <div className="space-y-1">
            <Input
              type="number"
              min={0}
              className="w-full"
              value={formData.timeRange ?? 0}
              onChange={(e) => updateFormField("timeRange", parseInt(e.target.value) || 0)}
            />
            <p className="text-muted-foreground text-xs">0 表示不限制时间范围</p>
          </div>
        </div>

        {/* 展示样式 */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <Label className="text-right">展示样式</Label>
          <Select
            options={DISPLAY_STYLE_OPTIONS}
            placeholder="选择前端展示样式"
            value={formData.style}
            onValueChange={(value) => updateFormField("style", value)}
            allowClear
          />
        </div>

        {/* 展示数量 */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <Label className="text-right">
            <span className="text-destructive">*</span> 展示数量
          </Label>
          <Input
            type="number"
            min={1}
            max={100}
            className="w-full"
            value={formData.limit ?? 10}
            onChange={(e) => updateFormField("limit", parseInt(e.target.value) || 10)}
          />
        </div>

        {/* 排序权重 */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-2">
          <Label className="pt-2 text-right">排序权重</Label>
          <div className="space-y-1">
            <Input
              type="number"
              className="w-full"
              value={formData.sort ?? 0}
              onChange={(e) => updateFormField("sort", parseInt(e.target.value) || 0)}
            />
            <p className="text-muted-foreground text-xs">数字越大越靠前</p>
          </div>
        </div>

        {/* 启用状态 */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <Label className="text-right">启用状态</Label>
          <Switch
            checked={formData.enabled ?? true}
            onCheckedChange={(checked) => updateFormField("enabled", checked)}
          />
        </div>
      </div>
    </Modal>
  );
}
