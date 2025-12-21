/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePlaylistDto = {
    /**
     * 片单标题
     */
    name: string;
    /**
     * 片单描述
     */
    description: string;
    /**
     * 封面图片URL
     */
    coverUrl: string;
    /**
     * 片单类型
     */
    type: CreatePlaylistDto.type;
    /**
     * 可见性
     */
    visibility: CreatePlaylistDto.visibility;
    /**
     * 标签
     */
    tags?: Array<string>;
    /**
     * 分类唯一键（categories.key，kind=playlist）
     */
    category: string;
};
export namespace CreatePlaylistDto {
    /**
     * 片单类型
     */
    export enum type {
        MOVIE = 'movie',
        SERIES = 'series',
        ADULT = 'adult',
        MUSIC = 'music',
    }
    /**
     * 可见性
     */
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
}

