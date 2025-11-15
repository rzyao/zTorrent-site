/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterDto = {
    username: string;
    password: string;
    email: string;
    /**
     * 注册类型：open（开放注册）/invite（邀请注册）
     */
    type: string;
    inviteCode: string;
};

