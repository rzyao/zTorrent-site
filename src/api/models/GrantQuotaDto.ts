/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GrantQuotaDto = {
    /**
     * 目标用户ID
     */
    userId: string;
    /**
     * 增加永久名额数量
     */
    permanent?: number;
    /**
     * 增加临时名额数量
     */
    temporaryCount?: number;
    /**
     * 临时名额过期时间
     */
    temporaryExpiresAt?: string;
};

