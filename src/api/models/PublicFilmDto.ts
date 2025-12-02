/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PublicFilmDto = {
    /**
     * 影片ID
     */
    id: string;
    /**
     * 影片标题
     */
    title: string;
    /**
     * 原始标题
     */
    originalTitle: string;
    /**
     * 上映年份
     */
    year: number;
    /**
     * 导演
     */
    director: string;
    /**
     * 海报图片URL
     */
    poster: string;
    /**
     * 背景图片URL
     */
    backdrop: string;
    /**
     * 评分 (0-10)
     */
    rating: number;
    /**
     * 类型列表
     */
    genre: Array<string>;
    /**
     * 时长（分钟）
     */
    duration: number;
    /**
     * 制片国家
     */
    country: string;
    /**
     * 语言
     */
    language: string;
    /**
     * 简介
     */
    description: string;
    /**
     * 种子数量
     */
    torrentsCount: number;
    /**
     * 浏览次数
     */
    viewsCount: number;
    /**
     * 收藏次数
     */
    collectionsCount: number;
    /**
     * 当前用户是否已收藏
     */
    isCollected: boolean;
};

