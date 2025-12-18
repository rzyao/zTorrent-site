/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EpisodeDTO = {
    /**
     * 所属剧集ID
     */
    seriesId: string;
    /**
     * 集号
     */
    episodeNumber: number;
    /**
     * 标题
     */
    title: string;
    /**
     * 原标题
     */
    originalTitle?: string;
    /**
     * 简介
     */
    overview?: string;
    /**
     * 播出日期
     */
    airDate?: string;
    /**
     * 剧照URL
     */
    stillUrl?: string;
    /**
     * 评分
     */
    voteAverage?: number;
    /**
     * 时长（分钟）
     */
    runtime?: number;
};

