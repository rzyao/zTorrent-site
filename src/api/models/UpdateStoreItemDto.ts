/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateStoreItemDto = {
    /**
     * 商品ID
     */
    id: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 类型
     */
    type?: UpdateStoreItemDto.type;
    /**
     * 价格（积分点数，字符串以兼容 bigint）
     */
    pricePoints?: string;
    /**
     * 交付参数 schema（用于前端生成表单）
     */
    payloadSchema?: Record<string, any>;
    /**
     * 状态
     */
    status?: UpdateStoreItemDto.status;
    /**
     * 库存（null 表示无限）
     */
    stock?: Record<string, any>;
};
export namespace UpdateStoreItemDto {
    /**
     * 类型
     */
    export enum type {
        VIRTUAL = 'virtual',
        PRIVILEGE = 'privilege',
        SERVICE = 'service',
    }
    /**
     * 状态
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
    }
}

