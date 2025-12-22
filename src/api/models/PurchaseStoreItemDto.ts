/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PurchaseStoreItemDto = {
    /**
     * 商品 Key
     */
    itemKey: string;
    /**
     * 购买数量
     */
    quantity?: number;
    /**
     * 商品交付参数（不同商品不同结构）
     */
    payload?: Record<string, any>;
};

