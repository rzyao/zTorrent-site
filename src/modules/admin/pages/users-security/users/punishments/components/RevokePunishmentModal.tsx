import { useState, useEffect } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Label } from "@/modules/admin/components/ui/label";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { PunishmentRecord, SelectOption } from "../types";

interface RevokePunishmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: PunishmentRecord | null;
  reasonOptions: SelectOption[];
  loading: boolean;
  onConfirm: (data: { reason: string; detailReason?: string }) => void;
}

export function RevokePunishmentModal({
  open,
  onOpenChange,
  record,
  reasonOptions,
  loading,
  onConfirm,
}: RevokePunishmentModalProps) {
  const [reason, setReason] = useState("");
  const [detailReason, setDetailReason] = useState("");

  // 重置表单
  useEffect(() => {
    if (open) {
      setReason("");
      setDetailReason("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm({ reason, detailReason });
  };

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="撤销处罚"
      onOk={handleConfirm}
      confirmLoading={loading}
      okButtonProps={{ variant: "primary", danger: true }}
      okText="确定撤销"
      width={480}
    >
      <div className="space-y-4 py-2">
        {record && (
          <div className="rounded-md bg-gray-50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">用户名：</span>
              <span className="font-medium text-gray-900">{record.userUsername}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-gray-500">处罚类型：</span>
              <span className="font-medium text-gray-900">{record.typeLabel || record.type}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="revoke-reason" className="required">
            撤销原因
          </Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger id="revoke-reason">
              <SelectValue placeholder="请选择撤销原因" />
            </SelectTrigger>
            <SelectContent>
              {reasonOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revoke-detail">撤销说明 (可选)</Label>
          <Textarea
            id="revoke-detail"
            placeholder="请输入撤销说明，详细描述撤销原因..."
            value={detailReason}
            onChange={(e) => setDetailReason(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </Modal>
  );
}
