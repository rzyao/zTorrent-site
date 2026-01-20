export type FeaturedPlaylistsDto = {
  limit?: number;
  categoryKey?: string;
  type?: "movie" | "series" | "adult" | "music";
  orderBy?: "sort" | "views" | "follows" | "likes" | "subscribers";
  cacheTtlSeconds?: number;
};

