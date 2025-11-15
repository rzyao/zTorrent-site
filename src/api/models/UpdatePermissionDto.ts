/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdatePermissionDto = {
    /**
     * 显示名称
     */
    name?: string;
    /**
     * 权限类型
     */
    type?: UpdatePermissionDto.type;
    /**
     * 作用范围
     */
    scope?: UpdatePermissionDto.scope;
    /**
     * 描述
     */
    description?: string;
    /**
     * 父权限ID
     */
    parentId?: string;
    /**
     * 父ID链（逗号分隔）
     */
    parentIds?: string;
    /**
     * 排序值
     */
    sort?: number;
    /**
     * 排序链（逗号分隔）
     */
    sorts?: string;
    /**
     * 关联的URL（逗号分隔）
     */
    urls?: string;
};
export namespace UpdatePermissionDto {
    /**
     * 权限类型
     */
    export enum type {
        API = 'api',
        PAGE = 'page',
        BUTTON = 'button',
    }
    /**
     * 作用范围
     */
    export enum scope {
        WEB = 'web',
        ADMIN = 'admin',
    }
}

