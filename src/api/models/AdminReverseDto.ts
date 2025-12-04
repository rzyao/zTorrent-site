/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminReverseDto = {
    /**
     * 目标流水ID（将被冲正）
     */
    ledgerId: string;
    /**
     * 管理员用户ID（用于审计）
     */
    adminUserId: string;
    /**
     * 冲正原因
     */
    reason: string;
};

