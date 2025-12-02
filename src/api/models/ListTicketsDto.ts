/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListTicketsDto = {
    page: number;
    pageSize: number;
    status?: ListTicketsDto.status;
    category?: ListTicketsDto.category;
    keyword?: string;
};
export namespace ListTicketsDto {
    export enum status {
        PENDING = 'pending',
        PROCESSING = 'processing',
        RESOLVED = 'resolved',
        CLOSED = 'closed',
    }
    export enum category {
        TECHNICAL = 'technical',
        ACCOUNT = 'account',
        RESOURCE = 'resource',
        REPORT = 'report',
        OTHER = 'other',
    }
}

