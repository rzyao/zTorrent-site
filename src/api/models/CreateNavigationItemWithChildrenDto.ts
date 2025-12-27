/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateNavigationItemWithChildrenDto = {
    /**
     * 平台类型
     */
    platform: CreateNavigationItemWithChildrenDto.platform;
    /**
     * 父菜单ID
     */
    parentId?: string | null;
    /**
     * 显示名称
     */
    label: string;
    /**
     * 路由路径
     */
    path: string;
    /**
     * 图标标识符
     */
    icon?: string;
    /**
     * 排序权重
     */
    sortOrder?: number;
    /**
     * 是否启用
     */
    isVisible?: boolean;
    /**
     * 链接打开方式
     */
    target?: string;
    /**
     * 所需权限
     */
    permissions?: Array<string>;
    /**
     * 子菜单
     */
    children?: Array<CreateNavigationItemWithChildrenDto>;
};
export namespace CreateNavigationItemWithChildrenDto {
    /**
     * 平台类型
     */
    export enum platform {
        DESKTOP = 'desktop',
        MOBILE = 'mobile',
    }
}

