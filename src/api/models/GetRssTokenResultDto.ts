/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetRssTokenResultDto = {
    token: string;
    createdAt: string;
    lastUsedAt?: string;
    status: GetRssTokenResultDto.status;
};
export namespace GetRssTokenResultDto {
    export enum status {
        ACTIVE = 'active',
        REVOKED = 'revoked',
    }
}

