/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MovieDetailDto = {
    id: string;
    title: string;
    originalTitle?: string;
    year?: string;
    rating?: number;
    posterUrl?: string;
    genres?: Array<string>;
    categories?: Array<string>;
    viewsCount?: number;
    collectionsCount?: number;
    description?: string;
    duration?: number;
    director?: string;
    backdropUrl?: string;
    cast?: Array<string>;
    doubanLink?: string;
    imdbLink?: string;
    doubanRatingAverage?: number;
    imdbRatingAverage?: number;
    creatorId?: string;
    creator?: string;
    ownerId?: string;
    owner?: string;
    createdAt?: string;
    updatedAt?: string;
    /**
     * 是否已收藏
     */
    isFavorited?: boolean;
};

