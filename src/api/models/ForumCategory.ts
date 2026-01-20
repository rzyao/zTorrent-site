/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForumCategory = {
    /**
     * 分类名称
     */
    name: string;
    /**
     * 分类 Key
     */
    key: string;
    /**
     * 分类描述
     */
    description: string;
    /**
     * 图标 (如 FontAwesome 类名)
     */
    icon: string;
    /**
     * 颜色 (Hex)
     */
    color: string;
    /**
     * 排序权重
     */
    sortOrder: number;
    /**
     * 是否激活
     */
    isActive: boolean;
    /**
     * 允许其他公共标签
     */
    allowOtherTags: boolean;
    /**
     * 是否锁定（锁定后禁止修改 key）
     */
    isLocked: boolean;
};

