/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubscribeDto = {
    /**
     * 片单ID
     */
    playlistId: string;
    /**
     * 操作类型
     */
    action: SubscribeDto.action;
};
export namespace SubscribeDto {
    /**
     * 操作类型
     */
    export enum action {
        SUBSCRIBE = 'subscribe',
        UNSUBSCRIBE = 'unsubscribe',
    }
}

