/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdvancedRuleDto } from './AdvancedRuleDto';
export type ListUsersDto = {
    /**
     * 按用户名模糊查询
     */
    username?: string;
    /**
     * 按邮箱模糊查询
     */
    email?: string;
    /**
     * 按用户状态筛选
     */
    status?: ListUsersDto.status;
    /**
     * 按用户等级筛选
     */
    level?: ListUsersDto.level;
    /**
     * 是否为VIP用户
     */
    isVip?: boolean;
    /**
     * 按VIP等级筛选
     */
    vipLevel?: ListUsersDto.vipLevel;
    /**
     * 是否有下载权限
     */
    hasDownloadPermission?: boolean;
    /**
     * 最后登录开始时间（ISO）
     */
    lastLoginAtFrom?: string;
    /**
     * 最后登录结束时间（ISO）
     */
    lastLoginAtTo?: string;
    /**
     * 创建开始时间（ISO）
     */
    createdAtFrom?: string;
    /**
     * 创建结束时间（ISO）
     */
    createdAtTo?: string;
    /**
     * 排序字段
     */
    sortBy?: ListUsersDto.sortBy;
    /**
     * 排序方向
     */
    order?: ListUsersDto.order;
    /**
     * 高级查询规则逻辑组合
     */
    logic?: ListUsersDto.logic;
    /**
     * 高级查询规则列表
     */
    rules?: Array<AdvancedRuleDto>;
    /**
     * Page number (optional)
     */
    page?: number;
    /**
     * Items per page (optional)
     */
    limit?: number;
};
export namespace ListUsersDto {
    /**
     * 按用户状态筛选
     */
    export enum status {
        PENDING = 'pending',
        ACTIVE = 'active',
        BANNED = 'banned',
    }
    /**
     * 按用户等级筛选
     */
    export enum level {
        P1 = 'P1',
        P2 = 'P2',
        P3 = 'P3',
        P4 = 'P4',
        P5 = 'P5',
        P6 = 'P6',
        P7 = 'P7',
        P8 = 'P8',
        P9 = 'P9',
        P10 = 'P10',
    }
    /**
     * 按VIP等级筛选
     */
    export enum vipLevel {
        V0 = 'V0',
        V1 = 'V1',
        V2 = 'V2',
        V3 = 'V3',
        V4 = 'V4',
        V5 = 'V5',
    }
    /**
     * 排序字段
     */
    export enum sortBy {
        CREATED_AT = 'createdAt',
        UPDATED_AT = 'updatedAt',
        USERNAME = 'username',
        LAST_LOGIN_AT = 'lastLoginAt',
        LEVEL = 'level',
        VIP_LEVEL = 'vipLevel',
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

