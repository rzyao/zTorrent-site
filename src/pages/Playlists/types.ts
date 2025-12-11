export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creator: string;
  creatorAvatar: string;
  moviesCount: number;
  followersCount: number;
  viewsCount: number;
  rating: number;
  isFollowing: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

