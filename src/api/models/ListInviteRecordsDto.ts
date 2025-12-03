/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListInviteRecordsDto = {
    page: number;
    limit: number;
    status?: ListInviteRecordsDto.status;
    email?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: ListInviteRecordsDto.sortBy;
    order?: ListInviteRecordsDto.order;
};
export namespace ListInviteRecordsDto {
    export enum status {
        PENDING = 'pending',
        REGISTERED = 'registered',
        EXPIRED = 'expired',
    }
    export enum sortBy {
        SENT_AT = 'sentAt',
        EXPIRES_AT = 'expiresAt',
    }
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

