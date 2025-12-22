/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuditHistoryDto = {
    /**
     * 资源类型
     */
    type: AuditHistoryDto.type;
    /**
     * 资源ID
     */
    resourceId: string;
};
export namespace AuditHistoryDto {
    /**
     * 资源类型
     */
    export enum type {
        FILM = 'film',
        PLAYLIST = 'playlist',
        TORRENT = 'torrent',
    }
}

