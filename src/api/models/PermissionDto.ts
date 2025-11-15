/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PermissionDto = {
    /**
     * 权限ID
     */
    id: string;
    /**
     * 权限唯一键
     */
    key: string;
    /**
     * 显示名称
     */
    name: string;
    /**
     * 类型
     */
    type: PermissionDto.type;
    /**
     * 作用范围
     */
    scope: PermissionDto.scope;
    /**
     * 描述
     */
    description: string | null;
    /**
     * 父权限ID
     */
    parentId: string | null;
    /**
     * 父ID链
     */
    parentIds: string | null;
    /**
     * 排序值
     */
    sort: number;
    /**
     * 排序链
     */
    sorts: string | null;
    /**
     * 创建人ID
     */
    creatorId: string;
    /**
     * 更新人ID
     */
    updaterId: string;
    /**
     * 关联URL（逗号分隔）
     */
    urls: string | null;
    /**
     * 创建时间
     */
    createdAt: string;
    /**
     * 更新时间
     */
    updatedAt: string;
};
export namespace PermissionDto {
    /**
     * 类型
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

