/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RouteTreeNodeDto = {
    /**
     * 路由唯一标识符
     */
    id: string;
    /**
     * 路由路径
     */
    path: string;
    /**
     * 前端组件标识符
     */
    component?: Record<string, any>;
    /**
     * 布局类型
     */
    layout?: RouteTreeNodeDto.layout;
    /**
     * 显示名称
     */
    name?: Record<string, any>;
    /**
     * 是否为索引路由
     */
    index?: boolean;
    /**
     * 重定向路径
     */
    redirect?: Record<string, any>;
    /**
     * 排序权重
     */
    sortOrder?: number;
    /**
     * 是否可见（用于菜单渲染判断）
     */
    isVisible?: boolean;
    /**
     * 所需权限列表
     */
    permissions?: Array<string>;
    /**
     * 子路由
     */
    children?: Array<RouteTreeNodeDto>;
};
export namespace RouteTreeNodeDto {
    /**
     * 布局类型
     */
    export enum layout {
        APP = 'app',
        ADMIN = 'admin',
        FORUM = 'forum',
        NONE = 'none',
    }
}

