/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateNavigationItemDto = {
    /**
     * 导航项 ID
     */
    id: string;
    /**
     * 排序权重
     */
    sortOrder?: number;
    /**
     * 是否可见
     */
    isVisible?: boolean;
    /**
     * 可见用户组
     */
    requiredRoles?: Array<string>;
};

