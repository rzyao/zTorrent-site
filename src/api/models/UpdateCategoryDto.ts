/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCategoryDto = {
    /**
     * 显示名称
     */
    label?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 排序值
     */
    sort?: number;
    /**
     * 是否默认展示
     */
    isDefault?: boolean;
    /**
     * 分级
     */
    genre?: UpdateCategoryDto.genre;
    /**
     * 所属模块类型
     */
    kind?: UpdateCategoryDto.kind;
    /**
     * 层级（根=0）
     */
    level?: number;
    /**
     * 父分类ID（level>0时建议提供）
     */
    parentId?: string;
    /**
     * 备用样式类名
     */
    class?: string;
    /**
     * 备用样式
     */
    style?: string;
};
export namespace UpdateCategoryDto {
    /**
     * 分级
     */
    export enum genre {
        GENERAL = 'General',
        ADULT = 'Adult',
    }
    /**
     * 所属模块类型
     */
    export enum kind {
        TORRENT = 'torrent',
        MOVIE = 'movie',
        SERIES = 'series',
        PLAYLIST = 'playlist',
    }
}

