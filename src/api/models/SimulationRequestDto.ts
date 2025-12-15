/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonusConfigDto } from './BonusConfigDto';
export type SimulationRequestDto = {
    userDays: number;
    userCount: number;
    /**
     * GB
     */
    avgSize: number;
    dormantDays: number;
    peers: number;
    /**
     * Seeds Age(Years)
     */
    age: number;
    /**
     * GB
     */
    upload: number;
    configOverride?: BonusConfigDto;
    /**
     * Download size in GB for cost simulation
     */
    download?: number;
};

