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
    /**
     * 子分类唯一键数组
     */
    subCategoryKeys?: Array<string>;
    /**
     * 子分类唯一键数组（兼容字段名：subCaterory）
     */
    subCaterory?: Array<string>;
    title?: string;
    subTitle?: string;
    year?: number;
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
    cover?: string;
    mediaInfo?: string;
    /**
     * 是否匿名，字符串true/false
     */
    isAnonymous?: string;
    /**
     * 剧照链接数组
     */
    stills?: Array<string>;
    /**
     * 剧照缩略图数组
     */
    stillsThumbs?: Array<string>;
    /**
     * torrent文件的Base64内容
     */
    fileBase64: string;
    source?: string;
    /**
     * 标签数组
     */
    tags?: Array<string>;
    accessToken?: string;
};

