/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserProfileDto = {
    /**
     * 用户名（2-20 字符）
     */
    username?: string;
    /**
     * 个性签名（≤100）
     */
    signature?: string;
    /**
     * 所在地区（≤50，当前接受自由字符串）
     */
    location?: string;
    /**
     * 个人简介（≤500）
     */
    bio?: string;
};

