/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackerReportDto = {
    /**
     * Info Hash
     */
    infohash: string;
    /**
     * User Passkey
     */
    passkey: string;
    /**
     * Peer ID
     */
    peer_id: string;
    /**
     * Port
     */
    port?: Record<string, any>;
    /**
     * Uploaded (Total)
     */
    uploaded?: Record<string, any>;
    /**
     * Downloaded (Total)
     */
    downloaded?: Record<string, any>;
    /**
     * Left (Remaining)
     */
    left?: Record<string, any>;
    /**
     * Compact
     */
    compact?: Record<string, any>;
    /**
     * No Peer ID
     */
    no_peer_id?: Record<string, any>;
    /**
     * Event
     */
    event?: string;
    /**
     * IP Address
     */
    ip?: string;
    /**
     * Delta Upload (Internal)
     */
    du?: Record<string, any>;
    /**
     * Delta Download (Internal)
     */
    dd?: Record<string, any>;
    /**
     * Timestamp (Internal)
     */
    ts?: number;
    /**
     * Film ID (Internal)
     */
    fd?: string;
    /**
     * Playlist ID (Internal)
     */
    pd?: string;
};

