/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateMovieDto = {
    /**
     * 电影标题
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
     * 评分（0-10）
     */
    rating?: number;
    /**
     * 时长（分钟）
     */
    duration?: number;
    /**
     * 导演
     */
    director?: string;
    /**
     * 海报附件ID
     */
    posterAttachmentId?: string;
    /**
     * 背景图附件ID
     */
    backdropAttachmentId?: string;
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
     * 奖项信息
     */
    awards?: Array<string>;
};

