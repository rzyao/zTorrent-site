/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UploadAttachmentDto = {
    ticketId?: string;
    purpose: UploadAttachmentDto.purpose;
};
export namespace UploadAttachmentDto {
    export enum purpose {
        CREATE = 'create',
        REPLY = 'reply',
    }
}

