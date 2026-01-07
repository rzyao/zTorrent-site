/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateRouteDto = {
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
    /**
     * 布局类型
     */
    layout?: CreateRouteDto.layout;
    /**
     * 显示名称
     */
    name?: string;
    /**
     * 父路由ID
     */
    parentId?: string;
    /**
     * 重定向路径
     */
    redirect?: string;
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
     * 所需权限列表
     */
    permissions?: Array<string>;
};
export namespace CreateRouteDto {
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

