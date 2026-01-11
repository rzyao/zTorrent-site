import type { RecommendationConfigDto } from "@/api/models/RecommendationConfigDto";

export type RecommendationItem = RecommendationConfigDto;

export interface RecommendationsQuery {
  page?: number;
  limit?: number;
  title?: string;
  type?: string;
}

/** 表单数据类型 */
export interface RecommendationFormData {
  title?: string;
  tabIds?: string[];
  type?: string;
  timeRange?: number;
  limit?: number;
  sort?: number;
  enabled?: boolean;
  style?: string;
}
