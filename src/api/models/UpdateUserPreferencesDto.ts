/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserPreferencesDto = {
    language?: UpdateUserPreferencesDto.language;
    theme?: UpdateUserPreferencesDto.theme;
    defaultView?: UpdateUserPreferencesDto.defaultView;
    showAdult?: boolean;
    defaultTorrentCategories?: Array<string>;
    defaultFilmGenres?: Array<string>;
};
export namespace UpdateUserPreferencesDto {
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

