import { CreatePunishmentDictDto } from "@/api/models/CreatePunishmentDictDto";

export interface UnbanReason extends Omit<CreatePunishmentDictDto, "category"> {
  id: string;
  category: CreatePunishmentDictDto.category;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnbanReasonQuery {
  search?: string;
  enabled?: boolean;
  page: number;
  limit: number;
}

export const UNBAN_REASON_CATEGORY = CreatePunishmentDictDto.category.UNBAN_REASON;

export const DEFAULT_QUERY: UnbanReasonQuery = {
  page: 1,
  limit: 20,
  search: "",
};
