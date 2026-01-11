import type { ListTicketsDto } from "@/api/models/ListTicketsDto";

export type TicketItem = any; // API response items

export interface TicketsQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  category?: string;
  keyword?: string;
}

export interface TicketStats {
  pending: number;
  processing: number;
  resolved: number;
  closed: number;
}
