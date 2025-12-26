/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateNavigationItemDto } from './UpdateNavigationItemDto';
export type BatchUpdateNavigationDto = {
    /**
     * 平台类型
     */
    platform: BatchUpdateNavigationDto.platform;
    /**
     * 更新列表
     */
    items: Array<UpdateNavigationItemDto>;
};
export namespace BatchUpdateNavigationDto {
    /**
     * 平台类型
     */
    export enum platform {
        DESKTOP = 'desktop',
        MOBILE = 'mobile',
    }
}

