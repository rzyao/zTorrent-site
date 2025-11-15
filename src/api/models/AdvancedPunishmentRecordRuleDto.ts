/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdvancedPunishmentRecordRuleDto = {
    /**
     * 字段名
     */
    field: AdvancedPunishmentRecordRuleDto.field;
    /**
     * 规则
     */
    op: AdvancedPunishmentRecordRuleDto.op;
    /**
     * 匹配值（除 range / is_null / is_not_null 外）
     */
    value?: Record<string, any>;
    /**
     * 范围值（两个元素），仅用于 range
     */
    range?: Array<string>;
};
export namespace AdvancedPunishmentRecordRuleDto {
    /**
     * 字段名
     */
    export enum field {
        USER_ID = 'userId',
        TYPE = 'type',
        REASON = 'reason',
        DETAIL_REASON = 'detailReason',
        DURATION_DAYS = 'durationDays',
        STARTS_AT = 'startsAt',
        EXPIRES_AT = 'expiresAt',
        HANDLER_ID = 'handlerId',
        REVOKED = 'revoked',
        REVOKE_REASON = 'revokeReason',
        REVOKE_DETAIL_REASON = 'revokeDetailReason',
        CREATED_AT = 'createdAt',
    }
    /**
     * 规则
     */
    export enum op {
        EQ = 'eq',
        NEQ = 'neq',
        LIKE = 'like',
        RANGE = 'range',
        CONTAINS = 'contains',
        GT = 'gt',
        GTE = 'gte',
        LT = 'lt',
        LTE = 'lte',
        LIKE_RIGHT = 'like_right',
        LIKE_LEFT = 'like_left',
        IS_NULL = 'is_null',
        IS_NOT_NULL = 'is_not_null',
    }
}

