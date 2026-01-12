import React from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import AdvancedQueryBuilder from "@/modules/admin/components/AdvancedQueryBuilder";
import type { AdvRule } from "@/modules/admin/shared/users/types";

interface AdvancedSearchModalProps {
  advOpen: boolean;
  setAdvOpen: (v: boolean) => void;
  fetchList: () => void;
  fieldOptions: any[];
  advRules: AdvRule[];
  setAdvRules: (rules: AdvRule[]) => void;
  advLogic: "AND" | "OR";
  setAdvLogic: (logic: "AND" | "OR") => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  advOpen,
  setAdvOpen,
  fetchList,
  fieldOptions,
  advRules,
  setAdvRules,
  advLogic,
  setAdvLogic,
}) => {
  const handleOk = () => {
    setAdvOpen(false);
    fetchList();
  };

  return (
    <Modal
      title="高级搜索"
      open={advOpen}
      onClose={() => setAdvOpen(false)}
      onOk={handleOk}
      width={900}
      okText="应用筛选"
    >
      <AdvancedQueryBuilder
        fieldOptions={fieldOptions}
        rules={advRules}
        logic={advLogic}
        onChange={(nextRules: any, nextLogic: any) => {
          setAdvRules(nextRules);
          setAdvLogic(nextLogic);
        }}
      />
    </Modal>
  );
};
