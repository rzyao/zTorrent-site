/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListSubtitlesDto = {
    /**
     * 搜索关键字（匹配 name/torrentName/uploader）
     */
    search?: string;
    /**
     * 语言代码：all|zh|en|jp|kr
     */
    language?: ListSubtitlesDto.language;
    /**
     * 排序字段
     */
    sortBy?: ListSubtitlesDto.sortBy;
    /**
     * 分页页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListSubtitlesDto {
    /**
     * 语言代码：all|zh|en|jp|kr
     */
    export enum language {
        ALL = 'all',
        ZH = 'zh',
        EN = 'en',
        JP = 'jp',
        KR = 'kr',
    }
    /**
     * 排序字段
     */
    export enum sortBy {
        LATEST = 'latest',
        DOWNLOADS = 'downloads',
        UPLOADS = 'uploads',
        RATING = 'rating',
    }
}

