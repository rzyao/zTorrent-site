/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApplyBonusRuleDto = {
    /**
     * 规则 Key
     */
    ruleKey: string;
    /**
     * 目标用户ID
     */
    userId: string;
    /**
     * 规则参数
     */
    params?: Record<string, any>;
    /**
     * 幂等键/外部引用（用于防重复发放）
     */
    externalRef?: string;
};

