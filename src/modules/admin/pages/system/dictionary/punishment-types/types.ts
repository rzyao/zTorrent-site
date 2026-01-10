import { CreatePunishmentDictDto } from "@/api/models/CreatePunishmentDictDto";

/**
 * 处罚类型字典项
 */
export interface PunishmentType extends Omit<CreatePunishmentDictDto, "category"> {
  id: string;
  category: CreatePunishmentDictDto.category;
  createdAt?: string;
  updatedAt?: string;
}

export interface PunishmentTypeQuery {
  page: number;
  limit: number;
  search?: string;
  enabled?: boolean;
}

export const PUNISHMENT_TYPE_CATEGORY = CreatePunishmentDictDto.category.PUNISHMENT_TYPE;

export const DEFAULT_QUERY: PunishmentTypeQuery = {
  page: 1,
  limit: 20,
  search: "",
};
