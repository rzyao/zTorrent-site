export type TabType = "songs" | "artists" | "albums";
export type ModalType = "add" | "edit" | null;

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: string;
  cover: string;
  year: number;
  genre: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  country: string;
  debutYear: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  year: number;
  genre: string;
  tracks: number;
  description: string;
}

