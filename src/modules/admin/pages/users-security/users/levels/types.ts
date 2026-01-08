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
