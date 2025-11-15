/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutoUploadTorrentDto = {
    /**
     * 种子名称
     */
    name: string;
    category?: string;
    title?: string;
    introduction?: string;
    standard?: string;
    videoCodec?: string;
    audioCodec?: string;
    productionTeam?: string;
    region?: string;
    /**
     * 语言类型
     */
    language?: string;
    subtitleType?: string;
    imdbUrl?: string;
    doubanUrl?: string;
    description?: string;
    mediaInfo?: string;
    /**
     * 是否匿名，字符串true/false
     */
    isAnonymous?: string;
    /**
     * torrent文件的Base64内容
     */
    fileBase64: string;
    /**
     * 原始文件名
     */
    originalName?: string;
};

