/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListSubscriptionsDto = {
    /**
     * 按目标类型过滤
     */
    targetType?: ListSubscriptionsDto.targetType;
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListSubscriptionsDto {
    /**
     * 按目标类型过滤
     */
    export enum targetType {
        PLAYLIST = 'playlist',
        SERIES = 'series',
    }
}

