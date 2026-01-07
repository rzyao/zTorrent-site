// @ts-nocheck
import { MusicSongsService } from "../services/MusicSongsService";
import { MusicAlbumsService } from "../services/MusicAlbumsService";
import { MusicPlaylistsService } from "../services/MusicPlaylistsService";
import { MusicLyricsService } from "../services/MusicLyricsService";
import { MusicCommentsService } from "../services/MusicCommentsService";
import { MusicRecommendService } from "../services/MusicRecommendService";

// @ts-ignore
export const listSongs = (data: any) => MusicSongsService.songsControllerList(data);
// @ts-ignore
export const listAlbums = (data: any) => MusicAlbumsService.albumsControllerList(data);
// @ts-ignore
export const listMyPlaylists = (data: any) => MusicPlaylistsService.playlistsControllerMy(data);
// @ts-ignore
export const getLyrics = (data: any) => MusicLyricsService.lyricsControllerGet(data);
// @ts-ignore
export const listComments = (data: any) => MusicCommentsService.commentsControllerList(data);
// @ts-ignore
export const getSimilarSongs = (data: any) =>
  MusicRecommendService.recommendControllerSimilar(data);
// @ts-ignore
export const likeSong = (data: any) => MusicSongsService.songsControllerLike(data);
// @ts-ignore
export const unlikeSong = (data: any) => MusicSongsService.songsControllerUnlike(data);
// @ts-ignore
export const createPlaylist = (data: any) => MusicPlaylistsService.playlistsControllerCreate(data);
// @ts-ignore
export const addSongToPlaylist = (data: any) =>
  MusicPlaylistsService.playlistsControllerAddSong(data);
// @ts-ignore
export const removeSongFromPlaylist = (data: any) =>
  MusicPlaylistsService.playlistsControllerRemoveSong(data);
// @ts-ignore
export const deletePlaylist = (data: any) => MusicPlaylistsService.playlistsControllerDelete(data);
