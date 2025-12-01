/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListInvitesDto = {
    page: number;
    limit: number;
    status?: ListInvitesDto.status;
    type?: ListInvitesDto.type;
    email?: string;
    issuerId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: ListInvitesDto.sortBy;
    order?: ListInvitesDto.order;
};
export namespace ListInvitesDto {
    export enum status {
        SENT = 'sent',
        ACCEPTED = 'accepted',
        EXPIRED = 'expired',
        REVOKED = 'revoked',
    }
    export enum type {
        PRIVATE_INVITATION = 'private-invitation',
        OFFICE_INVITATION = 'office-invitation',
    }
    export enum sortBy {
        CREATED_AT = 'createdAt',
        EXPIRES_AT = 'expiresAt',
        ACCEPTED_AT = 'acceptedAt',
    }
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

