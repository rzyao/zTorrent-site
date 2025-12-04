/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PermissionTreeRequestDto = {
    scope?: PermissionTreeRequestDto.scope;
    type?: PermissionTreeRequestDto.type;
};
export namespace PermissionTreeRequestDto {
    export enum scope {
        WEB = 'web',
        ADMIN = 'admin',
    }
    export enum type {
        API = 'api',
        PAGE = 'page',
        BUTTON = 'button',
    }
}

