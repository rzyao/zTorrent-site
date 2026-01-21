import { useState, useCallback, useEffect } from "react";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { Textarea } from "@/modules/admin/components/ui/textarea";

interface AdjustModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  isFrozen?: number;
  onDone?: () => void;
}

interface FormData {
  userId: string;
  delta: string;
  reason: string;
  externalRef?: string;
  correlationId?: string;
  refType?: string;
  refId?: string;
}

const INITIAL_FORM_DATA: FormData = {
  userId: "",
  delta: "",
  reason: "",
  externalRef: "",
  correlationId: "",
  refType: "",
  refId: "",
};

export function AdjustModal({ open, onClose, userId, isFrozen, onDone }: AdjustModalProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        ...INITIAL_FORM_DATA,
        userId: userId || "",
      });
      setErrors({});
    }
  }, [open, userId]);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.userId.trim()) newErrors.userId = "请输入用户ID";
    if (!formData.delta.trim()) newErrors.delta = "请输入变动值";
    if (!formData.reason.trim()) newErrors.reason = "请输入原因";

    // 冻结账户只允许正向入账
    if (isFrozen === 1 && formData.delta.trim().startsWith("-")) {
      newErrors.delta = "账户已冻结，禁止负向调账";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isFrozen]);

  const { execute: submitAction, loading } = useAsyncAction({
    successMessage: "调账成功",
    onSuccess: () => {
      onClose();
      onDone?.();
    },
  });

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    submitAction(async () => {
      await BonusAdminService.bonusAccountControllerAdminAdjust({
        userId: formData.userId,
        delta: formData.delta,
        reason: formData.reason,
        externalRef: formData.externalRef || undefined,
        correlationId: formData.correlationId || undefined,
        refType: formData.refType || undefined,
        refId: formData.refId || undefined,
      });
    });
  }, [formData, validate, submitAction]);

  return (
    <Modal
      title="手工调账"
      open={open}
      onClose={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="提交"
    >
      <div className="space-y-4">
        {/* 用户ID */}
        <div className="space-y-1.5">
          <Label>
            用户ID <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.userId}
            onChange={(e) => updateField("userId", e.target.value)}
            placeholder="目标用户ID"
            disabled={!!userId} // 如果是针对特定用户操作，则锁定
          />
          {errors.userId && <p className="text-xs text-red-500">{errors.userId}</p>}
        </div>

        {/* 变动值 */}
        <div className="space-y-1.5">
          <Label>
            变动值 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.delta}
            onChange={(e) => updateField("delta", e.target.value)}
            placeholder="字符串大整数，负数为扣减"
          />
          {errors.delta && <p className="text-xs text-red-500">{errors.delta}</p>}
        </div>

        {/* 原因 */}
        <div className="space-y-1.5">
          <Label>
            原因 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={formData.reason}
            onChange={(e) => updateField("reason", e.target.value)}
            placeholder="必填，用于审计与业务场景标识"
            rows={2}
          />
          {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
        </div>

        {/* 选填字段 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>幂等键 (externalRef)</Label>
            <Input
              value={formData.externalRef}
              onChange={(e) => updateField("externalRef", e.target.value)}
              placeholder="可选，唯一键"
            />
          </div>
          <div className="space-y-1.5">
            <Label>关联ID (correlationId)</Label>
            <Input
              value={formData.correlationId}
              onChange={(e) => updateField("correlationId", e.target.value)}
              placeholder="可选"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>引用类型 (refType)</Label>
            <Input
              value={formData.refType}
              onChange={(e) => updateField("refType", e.target.value)}
              placeholder="可选"
            />
          </div>
          <div className="space-y-1.5">
            <Label>引用ID (refId)</Label>
            <Input
              value={formData.refId}
              onChange={(e) => updateField("refId", e.target.value)}
              placeholder="可选"
            />
          </div>
        </div>

        {/* 冻结状态提示 */}
        {isFrozen === 1 && (
          <div className="rounded bg-yellow-50 p-2 text-sm text-yellow-700">
            ⚠ 当前账户已冻结，仅允许正向入账。
          </div>
        )}
      </div>
    </Modal>
  );
}
