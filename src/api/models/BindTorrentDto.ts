/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BindTorrentDto = {
    /**
     * 剧集ID
     */
    seriesId: string;
    /**
     * 种子ID (string format)
     */
    torrentId: string;
    /**
     * 集号 (null表示不限集)
     */
    episodeNumber?: number;
};

