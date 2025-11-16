/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdvancedRuleDto } from './AdvancedRuleDto';
export type AdminListTorrentsDto = {
    category?: string;
    uploaderId?: string;
    isEnabled?: boolean;
    visible?: boolean;
    isBanned?: boolean;
    sortBy?: AdminListTorrentsDto.sortBy;
    order?: AdminListTorrentsDto.order;
    logic?: AdminListTorrentsDto.logic;
    rules?: Array<AdvancedRuleDto>;
    page?: number;
    limit?: number;
};
export namespace AdminListTorrentsDto {
    export enum sortBy {
        UPLOADED_AT = 'uploadedAt',
        UPDATED_AT = 'updatedAt',
        SIZE = 'size',
        SEEDERS = 'seeders',
        DOWNLOADS = 'downloads',
        APPROVED_AT = 'approvedAt',
        PRICE = 'price',
    }
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
    export enum logic {
        AND = 'AND',
        OR = 'OR',
    }
}

