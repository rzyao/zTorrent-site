/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAttachmentInput } from './CreateAttachmentInput';
export type CreateTicketDto = {
    title: string;
    category: CreateTicketDto.category;
    priority: CreateTicketDto.priority;
    content: string;
    attachments?: Array<CreateAttachmentInput>;
    clientRequestId?: string;
};
export namespace CreateTicketDto {
    export enum category {
        TECHNICAL = 'technical',
        ACCOUNT = 'account',
        RESOURCE = 'resource',
        REPORT = 'report',
        OTHER = 'other',
    }
    export enum priority {
        LOW = 'low',
        NORMAL = 'normal',
        HIGH = 'high',
        URGENT = 'urgent',
    }
}

