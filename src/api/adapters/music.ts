import { getOpenAPI, getRequest } from '@/api/lazy';

export async function listSongs(body?: any) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/songs/list', body, mediaType: 'application/json' });
}

export async function likeSong(payload: { songId: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/songs/like', body: payload, mediaType: 'application/json' });
}

export async function unlikeSong(payload: { songId: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/songs/unlike', body: payload, mediaType: 'application/json' });
}

export async function reportPlay(payload: { songId: string; playedSeconds: number }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/songs/plays/report', body: payload, mediaType: 'application/json' });
}

export async function listAlbums(body?: any) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/albums/list', body, mediaType: 'application/json' });
}

export async function listArtists(body?: any) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/artists/list', body, mediaType: 'application/json' });
}

export async function listPublicPlaylists(body?: any) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/music/playlists/public/list', body, mediaType: 'application/json' });
}

export async function listMyPlaylists(body?: any) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/playlists/my', body, mediaType: 'application/json' });
}

export async function createPlaylist(payload: { title: string; description?: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/playlists/create', body: payload, mediaType: 'application/json' });
}

export async function updatePlaylist(payload: { id: string; title?: string; description?: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/playlists/update', body: payload, mediaType: 'application/json' });
}

export async function deletePlaylist(payload: { playlistId: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/playlists/delete', body: payload, mediaType: 'application/json' });
}

export async function addSongToPlaylist(payload: { playlistId: string; songId: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/music/playlists/songs/add', body: payload, mediaType: 'application/json' });
}

export async function removeSongFromPlaylist(payload: { playlistId: string; songId: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/music/playlists/songs/remove', body: payload, mediaType: 'application/json' });
}

export async function getLyrics(payload: { songId: string; lang?: string }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/music/songs/lyrics/detail', body: payload, mediaType: 'application/json' });
}

export async function listComments(payload: { songId: string; page?: number; pageSize?: number }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/comments/list', body: payload, mediaType: 'application/json' });
}

export async function getSimilarSongs(payload: { songId: string; limit?: number }) {
  const req = await getRequest();
  const api = await getOpenAPI();
  return req(api, { method: 'POST', url: '/api/songs/similar', body: payload, mediaType: 'application/json' });
}
