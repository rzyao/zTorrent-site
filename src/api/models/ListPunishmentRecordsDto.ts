/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdvancedPunishmentRecordRuleDto } from './AdvancedPunishmentRecordRuleDto';
export type ListPunishmentRecordsDto = {
    /**
     * 按用户ID筛选
     */
    userId?: string;
    /**
     * 按处罚类型筛选，如 ban_login、ban_upload 等
     */
    type?: string;
    /**
     * 按处罚原因模糊查询
     */
    reason?: string;
    /**
     * 按处理人ID筛选
     */
    handlerId?: string;
    /**
     * 是否撤销
     */
    revoked?: boolean;
    /**
     * 特殊条件：active=true 查询未到期且未撤销；active=false 查询已到期或已撤销
     */
    active?: boolean;
    /**
     * 处罚开始时间（起，ISO）
     */
    startsAtFrom?: string;
    /**
     * 处罚开始时间（止，ISO）
     */
    startsAtTo?: string;
    /**
     * 处罚过期时间（起，ISO）
     */
    expiresAtFrom?: string;
    /**
     * 处罚过期时间（止，ISO）
     */
    expiresAtTo?: string;
    /**
     * 创建时间（起，ISO）
     */
    createdAtFrom?: string;
    /**
     * 创建时间（止，ISO）
     */
    createdAtTo?: string;
    /**
     * 排序字段
     */
    sortBy?: ListPunishmentRecordsDto.sortBy;
    /**
     * 排序方向
     */
    order?: ListPunishmentRecordsDto.order;
    /**
     * 高级查询规则逻辑组合
     */
    logic?: ListPunishmentRecordsDto.logic;
    /**
     * 高级查询规则列表
     */
    rules?: Array<AdvancedPunishmentRecordRuleDto>;
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListPunishmentRecordsDto {
    /**
     * 排序字段
     */
    export enum sortBy {
        STARTS_AT = 'startsAt',
        EXPIRES_AT = 'expiresAt',
        CREATED_AT = 'createdAt',
        DURATION_DAYS = 'durationDays',
    }
    /**
     * 排序方向
     */
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
    /**
     * 高级查询规则逻辑组合
     */
    export enum logic {
        AND = 'AND',
        OR = 'OR',
    }
}

