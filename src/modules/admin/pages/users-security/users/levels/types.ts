export type LevelItem = {
  id: string;
  key: string;
  label: string;
  rank?: number;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export interface LevelsQuery {
  page: number;
  limit: number;
  key?: string;
  label?: string;
}

export const DEFAULT_QUERY: LevelsQuery = {
  page: 1,
  limit: 10,
};

export interface SelectOption {
  label: string;
  value: string;
}
