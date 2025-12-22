/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubscriptionActionDto = {
    /**
     * 目标资源ID
     */
    targetId: string;
    /**
     * 目标类型
     */
    targetType: SubscriptionActionDto.targetType;
};
export namespace SubscriptionActionDto {
    /**
     * 目标类型
     */
    export enum targetType {
        PLAYLIST = 'playlist',
        SERIES = 'series',
    }
}

