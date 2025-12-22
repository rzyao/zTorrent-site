/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListStoreItemsDto = {
    /**
     * 页码（从 1 开始）
     */
    page?: number;
    /**
     * 每页数量
     */
    pageSize?: number;
    /**
     * 按状态过滤
     */
    status?: ListStoreItemsDto.status;
    /**
     * 关键字（按标题/Key 模糊匹配）
     */
    'q'?: string;
};
export namespace ListStoreItemsDto {
    /**
     * 按状态过滤
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
    }
}

