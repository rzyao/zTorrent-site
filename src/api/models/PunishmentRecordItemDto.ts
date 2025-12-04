/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PunishmentRecordItemDto = {
    id: string;
    userId: string;
    userUsername: Record<string, any> | null;
    type: string;
    typeLabel: string;
    reason: string;
    reasonLabel: string;
    detailReason: Record<string, any> | null;
    durationDays: number;
    startsAt: string;
    expiresAt: string;
    handlerId: string;
    handlerUsername: Record<string, any> | null;
    revoked: boolean;
    revokeReason: Record<string, any> | null;
    revokeReasonLabel: Record<string, any> | null;
    revokeDetailReason: Record<string, any> | null;
    createdAt: string;
    recordSource: PunishmentRecordItemDto.recordSource;
};
export namespace PunishmentRecordItemDto {
    export enum recordSource {
        ACTIVE = 'active',
        HISTORY = 'history',
    }
}

