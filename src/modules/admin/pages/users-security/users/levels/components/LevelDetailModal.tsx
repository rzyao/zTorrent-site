import React from "react";
import { Modal } from "antd";

interface LevelDetailModalProps {
  detailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  detailData: any;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  detailOpen,
  setDetailOpen,
  detailData,
}) => {
  return (
    <Modal
      open={detailOpen}
      title="等级详情"
      onCancel={() => setDetailOpen(false)}
      footer={null}
      destroyOnHidden
    >
      <pre style={{ margin: 0, maxHeight: "60vh", overflow: "auto" }}>
        {JSON.stringify(detailData ?? {}, null, 2)}
      </pre>
    </Modal>
  );
};
