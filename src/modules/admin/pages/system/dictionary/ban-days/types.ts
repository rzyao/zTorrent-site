import { CreatePunishmentDictDto } from "@/api/models/CreatePunishmentDictDto";

/**
 * 封禁时长字典项类型
 */
export interface BanDay extends Omit<CreatePunishmentDictDto, "category"> {
  id: string;
  category: CreatePunishmentDictDto.category;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 封禁时长查询参数
 */
export interface BanDayQuery {
  search?: string;
  enabled?: boolean;
  page: number;
  limit: number;
}

// 封禁时长分类常量
export const BAN_DAY_CATEGORY = CreatePunishmentDictDto.category.BAN_DAYS;

// 默认查询参数
export const DEFAULT_QUERY: BanDayQuery = {
  page: 1,
  limit: 20,
  search: "",
};
