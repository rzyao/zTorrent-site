import React, { memo } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";

interface LevelDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

const LevelDetailModalComponent: React.FC<LevelDetailModalProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  return (
    <Modal
      title="等级详情"
      open={open}
      onClose={() => onOpenChange(false)}
      footer={null}
      width={600}
    >
      <div className="py-4">
        <pre className="max-h-[60vh] overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs text-neutral-800">
          {JSON.stringify(data ?? {}, null, 2)}
        </pre>
      </div>
    </Modal>
  );
};

export const LevelDetailModal = memo(LevelDetailModalComponent);
