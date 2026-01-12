import { Modal } from "@/modules/admin/components/ui/modal";
import AdvancedQueryBuilder from "@/modules/admin/components/AdvancedQueryBuilder";
import { TORRENT_FIELD_OPTIONS } from "../constants";

interface AdvancedSearchModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  rules: any[];
  logic: "AND" | "OR";
  onChange: (rules: any[], logic: "AND" | "OR") => void;
}

export const AdvancedSearchModal = ({
  open,
  onCancel,
  onOk,
  rules,
  logic,
  onChange,
}: AdvancedSearchModalProps) => {
  return (
    <Modal title="高级搜索" open={open} onCancel={onCancel} onOk={onOk} width={860}>
      <AdvancedQueryBuilder
        fieldOptions={TORRENT_FIELD_OPTIONS as any}
        rules={rules}
        logic={logic}
        onChange={onChange as any}
      />
    </Modal>
  );
};
