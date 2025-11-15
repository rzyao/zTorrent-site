/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListPermissionsDto = {
    /**
     * 按 key 模糊搜索
     */
    key?: string;
    /**
     * 按 name 模糊搜索
     */
    name?: string;
    /**
     * 类型过滤
     */
    type?: ListPermissionsDto.type;
    /**
     * 作用范围过滤
     */
    scope?: ListPermissionsDto.scope;
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListPermissionsDto {
    /**
     * 类型过滤
     */
    export enum type {
        API = 'api',
        PAGE = 'page',
        BUTTON = 'button',
    }
    /**
     * 作用范围过滤
     */
    export enum scope {
        WEB = 'web',
        ADMIN = 'admin',
    }
}

