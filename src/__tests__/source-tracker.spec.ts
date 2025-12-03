import { SOURCE_KEYS } from '@/hooks/useSourceTracker'

function buildNextQueryString(playListId: string, filmId: string) {
  const params = new URLSearchParams()
  if (playListId) params.set(SOURCE_KEYS.PLAYLIST, playListId)
  if (filmId) params.set(SOURCE_KEYS.FILM, filmId)
  return params.toString()
}

const q1 = buildNextQueryString('P1', 'F1')
console.assert(q1.includes('source_playlist_id=P1'))
console.assert(q1.includes('source_film_id=F1'))

const q2 = buildNextQueryString('', 'F1')
console.assert(!q2.includes('source_playlist_id='))
console.assert(q2.includes('source_film_id=F1'))

const q3 = buildNextQueryString('P1', '')
console.assert(q3.includes('source_playlist_id=P1'))
console.assert(!q3.includes('source_film_id='))

