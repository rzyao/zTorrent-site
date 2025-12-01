/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExportInvitesDto = {
    status?: ExportInvitesDto.status;
    type?: ExportInvitesDto.type;
    email?: string;
    issuerId?: string;
    dateFrom?: string;
    dateTo?: string;
    /**
     * 导出列选择
     */
    columns?: Array<string>;
};
export namespace ExportInvitesDto {
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
}

