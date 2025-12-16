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
     * Film 分类列表
     */
    film: Array<CategoryShowItemDto>;
    /**
     * Playlist 分类列表
     */
    playlist: Array<CategoryShowItemDto>;
};

