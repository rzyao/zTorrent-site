/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CollectFilmDto = {
    /**
     * 影片ID
     */
    filmId: string;
    /**
     * 操作类型：collect(收藏) 或 uncollect(取消收藏)
     */
    action: CollectFilmDto.action;
};
export namespace CollectFilmDto {
    /**
     * 操作类型：collect(收藏) 或 uncollect(取消收藏)
     */
    export enum action {
        COLLECT = 'collect',
        UNCOLLECT = 'uncollect',
    }
}

