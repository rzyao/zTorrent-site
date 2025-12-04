/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserPreferencesDto = {
    language: UserPreferencesDto.language;
    theme: UserPreferencesDto.theme;
    defaultView: UserPreferencesDto.defaultView;
    showAdult: boolean;
    /**
     * 默认展示的种子分类 key 列表
     */
    defaultTorrentCategories: Array<string>;
    /**
     * 默认展示的影片类型 name 列表
     */
    defaultFilmGenres: Array<string>;
};
export namespace UserPreferencesDto {
    export enum language {
        ZH_CN = 'zh-CN',
        ZH_TW = 'zh-TW',
        EN_US = 'en-US',
        JA_JP = 'ja-JP',
    }
    export enum theme {
        DARK = 'dark',
        LIGHT = 'light',
        AUTO = 'auto',
    }
    export enum defaultView {
        GRID = 'grid',
        LIST = 'list',
    }
}

