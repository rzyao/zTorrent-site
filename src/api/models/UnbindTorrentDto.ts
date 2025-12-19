/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UnbindTorrentDto = {
    /**
     * 剧集ID
     */
    seriesId: string;
    /**
     * 种子ID (string format)
     */
    torrentId: string;
    /**
     * 集号 (null表示解绑剧集级别)
     */
    episodeNumber?: number;
};

