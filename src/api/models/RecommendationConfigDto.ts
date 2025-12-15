/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecommendationConfigDto = {
    id: string;
    title: string;
    categoryKey?: string;
    type: RecommendationConfigDto.type;
    timeRange: number;
    limit: number;
    sort: number;
    enabled: boolean;
    style?: string;
    createdAt: string;
    updatedAt: string;
};
export namespace RecommendationConfigDto {
    export enum type {
        LATEST = 'latest',
        HOT_DOWNLOADS = 'hot_downloads',
        HOT_VIEWS = 'hot_views',
        MOST_SEEDED = 'most_seeded',
        RECENT_ACTIVE = 'recent_active',
    }
}

