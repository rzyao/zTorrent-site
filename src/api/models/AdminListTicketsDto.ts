/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListTicketsDto = {
    page?: number;
    pageSize?: number;
    status?: AdminListTicketsDto.status;
    category?: AdminListTicketsDto.category;
    keyword?: string;
    assignedTo?: Record<string, any> | null;
};
export namespace AdminListTicketsDto {
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

