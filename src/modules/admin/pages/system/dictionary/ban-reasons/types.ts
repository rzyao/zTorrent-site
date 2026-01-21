import { CreatePunishmentDictDto } from "@/api/models/CreatePunishmentDictDto";

/**
 * 封禁原因字典项类型
 */
export interface BanReason extends Omit<CreatePunishmentDictDto, "category"> {
  id: string;
  category: CreatePunishmentDictDto.category;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 封禁原因查询参数
 */
export interface BanReasonQuery {
  search?: string;
  enabled?: boolean;
  page: number;
  limit: number;
}

// 封禁原因分类常量
export const BAN_REASON_CATEGORY = CreatePunishmentDictDto.category.BAN_REASON;

// 默认查询参数
export const DEFAULT_QUERY: BanReasonQuery = {
  page: 1,
  limit: 20,
  search: "",
};
