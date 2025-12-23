/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutoUploadTorrentDto = {
    /**
     * 种子名称
     */
    name: string;
    /**
     * 分类
     */
    category?: string;
    title?: string;
    subTitle?: string;
    year?: number;
    standard?: string;
    videoCodec?: string;
    audioCodec?: string;
    productionTeam?: string;
    region?: string;
    subtitleType?: string;
    /**
     * 语言类型
     */
    language?: string;
    imdbUrl?: string;
    doubanUrl?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 封面URL或相对路径
     */
    cover?: string;
    mediaInfo?: string;
    /**
     * 剧照链接数组
     */
    stills?: Array<string>;
    source?: string;
    price?: number;
    /**
     * 标签数组
     */
    tags?: Array<string>;
    /**
     * 徽章数组：热门、典藏、推荐
     */
    badges?: Array<string>;
    /**
     * IMDb评分 0-10
     */
    imdbRating?: number;
    /**
     * 豆瓣评分 0-10
     */
    doubanRating?: number;
    /**
     * 子分类唯一键数组
     */
    subCategoryKeys?: Array<string>;
    /**
     * 子分类唯一键数组（兼容字段名：subCaterory）
     */
    subCaterory?: Array<string>;
    /**
     * 是否匿名，字符串true/false
     */
    isAnonymous?: string;
    /**
     * 剧照缩略图数组
     */
    stillsThumbs?: Array<string>;
    /**
     * torrent文件的Base64内容
     */
    fileBase64: string;
    accessToken?: string;
};

