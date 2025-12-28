/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuditOperatorDto } from './AuditOperatorDto';
export type AuditHistoryItemDto = {
    /**
     * 审核记录ID
     */
    id: string;
    /**
     * 操作类型
     */
    action: AuditHistoryItemDto.action;
    /**
     * 旧状态
     */
    oldStatus: string;
    /**
     * 新状态
     */
    newStatus: string;
    /**
     * 备注
     */
    note: Record<string, any> | null;
    /**
     * 原因代码
     */
    reasonCode: Record<string, any> | null;
    /**
     * 操作时间
     */
    createdAt: string;
    /**
     * 操作人信息
     */
    operator: AuditOperatorDto | null;
};
export namespace AuditHistoryItemDto {
    /**
     * 操作类型
     */
    export enum action {
        APPROVE = 'approve',
        REJECT = 'reject',
    }
}

