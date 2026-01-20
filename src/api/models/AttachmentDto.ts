/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttachmentDto = {
    id: string;
    kind: AttachmentDto.kind;
    mime: string | null;
    size: string;
    url: string;
    storagePath: string;
    originalName: string | null;
    uploaderUserId: string | null;
    attachableType: string | null;
    attachableId: string | null;
    field: string | null;
    sortOrder: number | null;
    meta: Record<string, any> | null;
};
export namespace AttachmentDto {
    export enum kind {
        IMAGE = 'image',
        FILE = 'file',
        AUDIO = 'audio',
    }
}

