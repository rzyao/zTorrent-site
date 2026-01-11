import { Modal } from "@/modules/admin/components/ui/modal";
import { Tag } from "@/modules/admin/components/ui/tag";
import type { StoreOrder } from "@/modules/admin/types/store";

interface OrderDeliveryDrawerProps {
  order: StoreOrder | null;
  onClose: () => void;
}

export function OrderDeliveryDrawer({ order, onClose }: OrderDeliveryDrawerProps) {
  return (
    <Modal
      open={!!order}
      onClose={onClose}
      title={`订单 ${order?.id} 交付详情`}
      width={600}
      footer={null}
    >
      {order?.status === "failed" && (
        <Tag color="error" className="mb-3">
          交付失败：{String((order?.deliveryResult as any)?.msg || "")}
        </Tag>
      )}
      {order && (
        <pre className="max-h-[480px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-700">
          {JSON.stringify(order.deliveryResult || {}, null, 2)}
        </pre>
      )}
    </Modal>
  );
}
