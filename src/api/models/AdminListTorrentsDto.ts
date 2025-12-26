/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdvancedRuleDto } from './AdvancedRuleDto';
export type AdminListTorrentsDto = {
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
    /**
     * 按分类过滤
     */
    category?: string;
    /**
     * 按上传者ID过滤
     */
    uploaderId?: string;
    /**
     * 是否启用
     */
    isEnabled?: boolean;
    /**
     * 是否可见
     */
    visible?: boolean;
    /**
     * 是否被封禁
     */
    isBanned?: boolean;
    /**
     * 排序字段
     */
    sortBy?: AdminListTorrentsDto.sortBy;
    /**
     * 排序方向
     */
    order?: AdminListTorrentsDto.order;
    /**
     * 高级规则逻辑
     */
    logic?: AdminListTorrentsDto.logic;
    /**
     * 高级查询规则
     */
    rules?: Array<AdvancedRuleDto>;
};
export namespace AdminListTorrentsDto {
    /**
     * 排序字段
     */
    export enum sortBy {
        UPLOADED_AT = 'uploadedAt',
        UPDATED_AT = 'updatedAt',
        SIZE = 'size',
        SEEDERS = 'seeders',
        DOWNLOADS = 'downloads',
        APPROVED_AT = 'approvedAt',
        PRICE = 'price',
    }
    /**
     * 排序方向
     */
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
    /**
     * 高级规则逻辑
     */
    export enum logic {
        AND = 'AND',
        OR = 'OR',
    }
}

