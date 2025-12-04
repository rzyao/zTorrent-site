/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BanRecordDto = {
    id: string;
    userId: string;
    type: string;
    reason: string;
    detailReason?: string;
    durationDays: number;
    startsAt: string;
    expiresAt: string;
    handlerId: string;
    revoked: boolean;
    revokeReason?: string;
    revokeDetailReason?: string;
    revokerId?: string;
    isInvalid: boolean;
    createdAt: string;
    updatedAt: string;
};

