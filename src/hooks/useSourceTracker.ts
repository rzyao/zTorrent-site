import { useSearchParams } from 'react-router-dom'

export const SOURCE_KEYS = {
  PLAYLIST: 'source_playlist_id',
  FILM: 'source_film_id',
}

export type SourcePayload = {
  filmId: string
  playListId: string
}

export function useSourceTracker(currentFilmId: string = '') {
  const [searchParams] = useSearchParams()

  const sourceFilmId = currentFilmId || searchParams.get(SOURCE_KEYS.FILM) || ''
  const sourcePlaylistId = searchParams.get(SOURCE_KEYS.PLAYLIST) || ''

  const sourcePayload: SourcePayload = {
    filmId: sourceFilmId,
    playListId: sourcePlaylistId,
  }

  const getNextQueryString = () => {
    const params = new URLSearchParams()
    if (sourcePlaylistId) params.set(SOURCE_KEYS.PLAYLIST, sourcePlaylistId)
    if (sourceFilmId) params.set(SOURCE_KEYS.FILM, sourceFilmId)
    return params.toString()
  }

  return {
    sourcePayload,
    getNextQueryString,
    playListId: sourcePlaylistId,
  }
}
