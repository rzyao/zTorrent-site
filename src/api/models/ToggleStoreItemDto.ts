/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ToggleStoreItemDto = {
    /**
     * 商品ID
     */
    id: string;
    /**
     * 目标状态
     */
    status: ToggleStoreItemDto.status;
};
export namespace ToggleStoreItemDto {
    /**
     * 目标状态
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
    }
}

