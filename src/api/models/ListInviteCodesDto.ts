/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListInviteCodesDto = {
    page: number;
    limit: number;
    status?: ListInviteCodesDto.status;
};
export namespace ListInviteCodesDto {
    export enum status {
        UNUSED = 'unused',
        USED = 'used',
        EXPIRED = 'expired',
    }
}

