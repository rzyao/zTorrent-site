/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateStoreItemDto = {
    /**
     * 商品 Key（全局唯一）
     */
    key: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 类型
     */
    type: CreateStoreItemDto.type;
    /**
     * 价格（积分点数，字符串以兼容 bigint）
     */
    pricePoints: string;
    /**
     * 交付参数 schema（用于前端生成表单）
     */
    payloadSchema?: Record<string, any>;
    /**
     * 状态
     */
    status?: CreateStoreItemDto.status;
    /**
     * 库存（null 表示无限）
     */
    stock?: Record<string, any>;
};
export namespace CreateStoreItemDto {
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

