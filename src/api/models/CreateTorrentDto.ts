/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTorrentDto = {
    /**
     * 种子名称
     */
    name: string;
    /**
     * 分类
     */
    category?: string;
    title?: string;
    introduction?: string;
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
    mediaInfo?: string;
    /**
     * 是否匿名，字符串true/false
     */
    isAnonymous?: string;
};

