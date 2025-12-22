/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListStoreOrdersDto = {
    /**
     * 按用户ID筛选
     */
    userId?: string;
    /**
     * 按商品ID筛选
     */
    itemId?: string;
    /**
     * 按订单状态筛选
     */
    status?: ListStoreOrdersDto.status;
    /**
     * 页码（从 1 开始）
     */
    page?: number;
    /**
     * 每页数量
     */
    pageSize?: number;
    /**
     * 开始时间（ISO）
     */
    from?: string;
    /**
     * 结束时间（ISO）
     */
    to?: string;
};
export namespace ListStoreOrdersDto {
    /**
     * 按订单状态筛选
     */
    export enum status {
        CREATED = 'created',
        PAID = 'paid',
        DELIVERED = 'delivered',
        FAILED = 'failed',
        REFUNDED = 'refunded',
    }
}

