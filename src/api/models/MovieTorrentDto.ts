/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MovieTorrentDto = {
    id: string;
    torrentId: string;
    title: string;
    subTitle?: string;
    size: string;
    seeders: number;
    leechers: number;
    completed: number;
    uploadedAt: string;
    standard?: string;
    videoCodec?: string;
    audioCodec?: string;
    productionTeam?: string;
    source?: string;
    language?: string;
    subtitleType?: string;
    tags?: Array<string>;
    badges?: Array<string>;
};

