/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSeriesDto = {
    /**
     * 剧集标题（如"xxx第一季"）
     */
    title: string;
    /**
     * 原标题
     */
    originalTitle?: string;
    /**
     * 简介
     */
    description?: string;
    /**
     * 年份
     */
    year?: string;
    /**
     * 总集数
     */
    episodeCount?: number;
    /**
     * 剧集状态
     */
    status?: CreateSeriesDto.status;
    /**
     * 评分（0-10）
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
     * 分类
     */
    categories?: Array<string>;
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
    /**
     * 启用状态
     */
    enabled?: boolean;
    /**
     * 排序
     */
    sort?: number;
};
export namespace CreateSeriesDto {
    /**
     * 剧集状态
     */
    export enum status {
        AIRING = 'airing',
        ENDED = 'ended',
        UPCOMING = 'upcoming',
    }
}

