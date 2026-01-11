import { StoreItem } from "@/modules/admin/types/store";

export interface StoreItemsQuery {
  searchText: string;
}

export type StoreItemFormValues = {
  id?: string;
  key: string;
  title: string;
  type: StoreItem["type"];
  pricePoints: number;
  status: StoreItem["status"];
  stock?: number | null;
};
