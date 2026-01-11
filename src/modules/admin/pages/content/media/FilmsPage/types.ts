export interface MovieItem {
  id?: string;
  title?: string;
  originalTitle?: string;
  year?: string;
  categories?: string[];
  genres?: string[];
  rating?: number;
  posterUrl?: string;
  backdropUrl?: string;
  viewsCount?: number;
  collectionsCount?: number;
  enabled?: boolean;
  sort?: number;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  director?: string;
  cast?: string[];
  duration?: number;
}

export type SortOrderLocal = "asc" | "desc" | null;

export interface CategoryOption {
  label: string;
  value: string;
}
