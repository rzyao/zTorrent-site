/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListFollowsDto = {
    /**
     * 按目标类型过滤
     */
    targetType?: ListFollowsDto.targetType;
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListFollowsDto {
    /**
     * 按目标类型过滤
     */
    export enum targetType {
        PLAYLIST = 'playlist',
        SERIES = 'series',
    }
}

