import React from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import AdvancedQueryBuilder from "@/modules/admin/components/AdvancedQueryBuilder";
import type { AdvRule } from "../types";

interface AdvancedSearchModalProps {
  open: boolean;
  onClose: (v: boolean) => void;
  onSuccess: () => void;
  fieldOptions: any[];
  rules: AdvRule[];
  setRules: (rules: AdvRule[]) => void;
  logic: "AND" | "OR";
  setLogic: (logic: "AND" | "OR") => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  open,
  onClose,
  onSuccess,
  fieldOptions,
  rules,
  setRules,
  logic,
  setLogic,
}) => {
  const handleOk = () => {
    onClose(false);
    onSuccess();
  };

  return (
    <Modal
      title="高级搜索"
      open={open}
      onClose={() => onClose(false)}
      onOk={handleOk}
      width={900}
      okText="应用筛选"
    >
      <AdvancedQueryBuilder
        fieldOptions={fieldOptions}
        rules={rules}
        logic={logic}
        onChange={(nextRules: any, nextLogic: any) => {
          setRules(nextRules);
          setLogic(nextLogic);
        }}
      />
    </Modal>
  );
};
