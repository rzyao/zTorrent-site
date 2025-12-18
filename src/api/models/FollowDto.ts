/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FollowDto = {
    /**
     * 片单ID
     */
    playlistId: string;
    /**
     * 操作类型
     */
    action: FollowDto.action;
};
export namespace FollowDto {
    /**
     * 操作类型
     */
    export enum action {
        FOLLOW = 'follow',
        UNFOLLOW = 'unfollow',
    }
}

