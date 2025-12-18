/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EpisodeSeriesDetailDto } from './EpisodeSeriesDetailDto';
import type { EpisodeTorrentDetailDto } from './EpisodeTorrentDetailDto';
export type EpisodeDetailResponseDto = {
    /**
     * 分集ID
     */
    id: string;
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
    description?: string;
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
    /**
     * 启用状态
     */
    enabled: boolean;
    /**
     * 关联的剧集详情
     */
    series: EpisodeSeriesDetailDto;
    /**
     * 关联的种子列表
     */
    torrents: Array<EpisodeTorrentDetailDto>;
};

