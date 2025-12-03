import { TorrentsService } from '@/api'

async function mockCreateDownloadUrl(torrentId: string, source: { filmId: string; playListId: string }) {
  const body = { torrentId, source }
  console.assert(typeof body.torrentId === 'string')
  console.assert(typeof body.source.filmId === 'string')
  console.assert(typeof body.source.playListId === 'string')
  return TorrentsService.torrentsControllerCreateDownloadUrl(body as any)
}

// 仅做类型与结构校验示例
void mockCreateDownloadUrl('T123', { filmId: 'F1', playListId: 'P1' })
void mockCreateDownloadUrl('T123', { filmId: '', playListId: '' })

