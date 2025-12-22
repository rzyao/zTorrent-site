/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FollowActionDto = {
    /**
     * 目标资源ID
     */
    targetId: string;
    /**
     * 目标类型
     */
    targetType: FollowActionDto.targetType;
};
export namespace FollowActionDto {
    /**
     * 目标类型
     */
    export enum targetType {
        PLAYLIST = 'playlist',
        SERIES = 'series',
    }
}

