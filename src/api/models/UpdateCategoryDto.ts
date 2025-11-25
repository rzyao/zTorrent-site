/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCategoryDto = {
    /**
     * 显示名称
     */
    label?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 排序值
     */
    sort?: number;
    /**
     * 是否默认展示
     */
    isDefault?: boolean;
    /**
     * 类型
     */
    type?: UpdateCategoryDto.type;
    /**
     * 父分类ID（type=sub时必填）
     */
    parentId?: string;
};
export namespace UpdateCategoryDto {
    /**
     * 类型
     */
    export enum type {
        CATEGORY = 'category',
        SUB = 'sub',
    }
}

