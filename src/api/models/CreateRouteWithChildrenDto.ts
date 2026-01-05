/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateRouteWithChildrenDto = {
    /**
     * 路由唯一标识符
     */
    routeKey: string;
    /**
     * 路由路径
     */
    path: string;
    /**
     * 前端组件标识符
     */
    component?: string;
    layout?: CreateRouteWithChildrenDto.layout;
    /**
     * 显示名称
     */
    name?: string;
    /**
     * 重定向路径
     */
    redirect?: string;
    /**
     * 排序权重
     */
    sortOrder?: number;
    /**
     * 是否可见
     */
    isVisible?: boolean;
    /**
     * 是否启用
     */
    isEnabled?: boolean;
    /**
     * 是否为索引路由
     */
    isIndex?: boolean;
    /**
     * 所需权限列表
     */
    permissions?: Array<string>;
    /**
     * 子路由列表
     */
    children?: Array<CreateRouteWithChildrenDto>;
};
export namespace CreateRouteWithChildrenDto {
    export enum layout {
        APP = 'app',
        ADMIN = 'admin',
        FORUM = 'forum',
        NONE = 'none',
    }
}

