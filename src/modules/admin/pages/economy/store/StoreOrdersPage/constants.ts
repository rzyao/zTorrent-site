import type { StoreOrder } from "@/modules/admin/types/store";

export const STORE_ORDER_STATUS_OPTIONS = [
  { label: "Created", value: "created" },
  { label: "Paid", value: "paid" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
] as const;

export type StoreOrderStatus = StoreOrder["status"];
