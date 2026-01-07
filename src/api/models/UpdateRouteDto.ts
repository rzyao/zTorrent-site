/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateRouteDto = {
    /**
     * 路由ID
     */
    id: string;
    /**
     * 路由唯一标识符
     */
    routeKey?: string;
    /**
     * 路由路径
     */
    path?: string;
    /**
     * 前端组件标识符
     */
    component?: Record<string, any>;
    /**
     * 布局类型
     */
    layout?: UpdateRouteDto.layout;
    /**
     * 显示名称
     */
    name?: Record<string, any>;
    /**
     * 父路由ID (null 表示根节点)
     */
    parentId?: Record<string, any>;
    /**
     * 重定向路径
     */
    redirect?: Record<string, any>;
    /**
     * 排序权重
     */
    sortOrder?: number;
    /**
     * 是否在菜单显示
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
     * 是否在新标签页打开
     */
    openInNewTab?: boolean;
    /**
     * 所需权限列表 (完整替换)
     */
    permissions?: Array<string>;
};
export namespace UpdateRouteDto {
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

