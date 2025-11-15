/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdvancedRuleDto = {
    /**
     * 字段名
     */
    field: AdvancedRuleDto.field;
    /**
     * 规则
     */
    op: AdvancedRuleDto.op;
    /**
     * 匹配值（除 range / is_null / is_not_null 外）
     */
    value?: Record<string, any>;
    /**
     * 范围值（两个元素），仅用于 range
     */
    range?: Array<string>;
};
export namespace AdvancedRuleDto {
    /**
     * 字段名
     */
    export enum field {
        USERNAME = 'username',
        EMAIL = 'email',
        STATUS = 'status',
        LEVEL = 'level',
        IS_VIP = 'isVip',
        VIP_LEVEL = 'vipLevel',
        HAS_DOWNLOAD_PERMISSION = 'hasDownloadPermission',
        LAST_LOGIN_AT = 'lastLoginAt',
        CREATED_AT = 'createdAt',
        LAST_VISIT_AT = 'lastVisitAt',
        LAST_LOGIN_IP = 'lastLoginIp',
        ROLES = 'roles',
        PERMISSIONS = 'permissions',
        PASSKEY = 'passkey',
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

