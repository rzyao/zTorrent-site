/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicFilmTorrentDto } from './PublicFilmTorrentDto';
export type PublicFilmDetailDto = {
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
     * 语言列表
     */
    language: Array<string>;
    /**
     * 地区标签
     */
    region: Array<string>;
    /**
     * 获奖列表
     */
    awards: Array<string>;
    /**
     * 豆瓣链接（http/https）
     */
    doubanLink: string;
    /**
     * IMDb 链接（http/https）
     */
    imdbLink: string;
    /**
     * 豆瓣平均分（0–10）
     */
    doubanRatingAverage: number;
    /**
     * IMDb 平均分（0–10）
     */
    imdbRatingAverage: number;
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
    /**
     * 影片所有者用户ID
     */
    ownerId: string;
    /**
     * 影片所有者用户名
     */
    ownerName: string;
    /**
     * 种子列表
     */
    torrents: Array<PublicFilmTorrentDto>;
};

