/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EpisodeSeriesDetailDto = {
    /**
     * 剧集ID
     */
    id: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 原标题
     */
    originalTitle?: string;
    /**
     * 年份
     */
    year?: string;
    /**
     * 总集数
     */
    episodeCount: number;
    /**
     * 状态
     */
    status: string;
    /**
     * 评分
     */
    rating?: number;
    /**
     * 单集时长（分钟）
     */
    episodeDuration?: number;
    /**
     * 导演
     */
    director?: string;
    /**
     * 海报URL
     */
    posterUrl: string;
    /**
     * 背景图URL
     */
    backdropUrl?: string;
    /**
     * 演员列表
     */
    cast?: Array<string>;
    /**
     * 类型标签
     */
    genres?: Array<string>;
    /**
     * 豆瓣链接
     */
    doubanLink?: string;
    /**
     * IMDb链接
     */
    imdbLink?: string;
    /**
     * 豆瓣评分
     */
    doubanRatingAverage?: number;
    /**
     * IMDb评分
     */
    imdbRatingAverage?: number;
};

