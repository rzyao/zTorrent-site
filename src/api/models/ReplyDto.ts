/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReplyAttachmentInput } from './ReplyAttachmentInput';
export type ReplyDto = {
    ticketId: string;
    content: string;
    attachments?: Array<ReplyAttachmentInput>;
    clientRequestId?: string;
};

