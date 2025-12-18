/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdatePlaylistDto = {
    /**
     * 片单ID
     */
    id: string;
    /**
     * 片单标题
     */
    name?: string;
    /**
     * 片单描述
     */
    description?: string;
    /**
     * 封面图片URL
     */
    coverUrl?: string;
    /**
     * 片单类型
     */
    type?: UpdatePlaylistDto.type;
    /**
     * 可见性
     */
    visibility?: UpdatePlaylistDto.visibility;
    /**
     * 标签
     */
    tags?: Array<string>;
    /**
     * 分类唯一键
     */
    category?: string;
};
export namespace UpdatePlaylistDto {
    /**
     * 片单类型
     */
    export enum type {
        GENERAL = 'general',
        TOPIC = 'topic',
        SERIES = 'series',
        DIRECTOR = 'director',
        CURATION = 'curation',
        ACTOR = 'actor',
    }
    /**
     * 可见性
     */
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
}

