import type { StoreOrder } from "@/modules/admin/types/store";

export type OrderStatus = StoreOrder["status"];

export interface StoreOrderFilter {
  userId?: string;
  itemId?: string;
  status?: OrderStatus;
  dateRange?: [string, string];
}
