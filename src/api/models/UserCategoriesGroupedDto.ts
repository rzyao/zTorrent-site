/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryShowItemDto } from './CategoryShowItemDto';
export type UserCategoriesGroupedDto = {
    /**
     * Torrent 分类列表
     */
    torrent: Array<CategoryShowItemDto>;
    /**
     * Movie 分类列表
     */
    movie: Array<CategoryShowItemDto>;
    /**
     * Series 分类列表
     */
    series: Array<CategoryShowItemDto>;
    /**
     * Playlist 分类列表
     */
    playlist: Array<CategoryShowItemDto>;
};

