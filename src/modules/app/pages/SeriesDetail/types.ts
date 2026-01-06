import type { SeriesDetailDto } from "@/api/models/SeriesDetailDto";
import type { EpisodeDTO } from "@/api/models/EpisodeDTO";

// 剧集类型定义，扩展 API 模型以支持前端展示
export interface SeriesDetail extends SeriesDetailDto {
  // 可能需要的扩展字段
}

// 分集类型定义，添加 id 用于路由导航
export interface EpisodeItem extends EpisodeDTO {
  id: string;
}

// 季度信息（待 API 支持后启用）
export interface Season {
  number: number;
  name: string;
  episodeCount: number;
}
