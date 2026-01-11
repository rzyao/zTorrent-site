import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";

interface ReviewModalProps {
  /** Modal 是否打开 */
  open: boolean;
  /** 打开状态变更回调 */
  onOpenChange: (open: boolean) => void;
  /** 审核操作类型 */
  action: "approve" | "reject";
  /** 待审核的片单 ID 列表 */
  ids: string[];
  /** 是否加载中 */
  loading?: boolean;
  /** 确认回调 */
  onConfirm: (note?: string) => void;
}

/**
 * 审核弹窗组件（主要用于驳回时填写备注）
 */
export function ReviewModal({
  open,
  onOpenChange,
  action,
  ids,
  loading = false,
  onConfirm,
}: ReviewModalProps) {
  const [note, setNote] = useState("");

  // 打开时重置
  useEffect(() => {
    if (open) {
      setNote("");
    }
  }, [open]);

  const handleConfirm = useCallback(() => {
    onConfirm(note || undefined);
  }, [note, onConfirm]);

  const isReject = action === "reject";
  const title = isReject ? "审核驳回" : "审核通过";
  const description = isReject
    ? `确定要驳回 ${ids.length} 个片单吗？`
    : `确定要通过 ${ids.length} 个片单吗？`;

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      okText="提交"
      confirmLoading={loading}
      onOk={handleConfirm}
      okButtonProps={isReject ? { danger: true } : undefined}
      width={480}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>

        {/* 备注输入 */}
        <div className="space-y-1.5">
          <Label>备注（≤500字）</Label>
          <Textarea
            placeholder="请输入备注原因（可选）"
            rows={4}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="text-right text-xs text-gray-400">{note.length}/500</p>
        </div>
      </div>
    </Modal>
  );
}
