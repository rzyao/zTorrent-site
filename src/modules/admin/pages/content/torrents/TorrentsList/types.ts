import { AdminListTorrentsDto } from "@/api/models/AdminListTorrentsDto";

export interface TorrentItem {
  id?: string;
  key?: string;
  title?: string;
  category?: string;
  categoryId?: string;
  size?: number;
  seeders?: number;
  leechers?: number;
  completed?: number;
  createdAt?: string;
  uploader?: string;
  uploaderId?: string;
  enabled?: boolean;
  name?: string;
  description?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  approvedAt?: string;
  visible?: boolean;
}

export type SortOrderLocal = "ascend" | "descend" | null;

export interface CategoryOption {
  label: string;
  value: string;
}
