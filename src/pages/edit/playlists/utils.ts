import type { Playlist, Movie, Visibility, PlaylistType, ApprovalStatus } from '@/pages/Edit/playlists/types';

/**
 * 从可能为对象或字符串的字段中提取分类 Key
 */
function safeExtractCategory(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  // 如果是对象，优先取 key，其次取 label/name/value
  if (typeof val === 'object') {
    return val.key || val.value || val.name || val.label || '';
  }
  return String(val);
}

/**
 * 将后端 Playlist 详情 DTO 映射为页面本地 Playlist 模型
 * 说明：后端字段名与前端展示所需字段不完全一致，统一在此做转换，
 * 保证 UI 层只依赖稳定的本地类型，降低耦合与后端变更的影响。
 */
export function mapBackendPlaylistToLocal(detail: any): Playlist {
  const movies: Movie[] = Array.isArray(detail?.films)
    ? detail.films.map((f: any) => ({
      id: String(f?.filmId ?? f?.id ?? ''),
      title: f?.title ?? '',
      originalTitle: f?.originalTitle ?? '',
      year: String(f?.year ?? ''),
      poster: f?.poster ?? f?.posterUrl ?? f?.coverUrl ?? '',
      category: f?.category ?? '',
      rating: Number(f?.rating ?? 0),
      torrentCount: Number(f?.torrentCount ?? 0),
    }))
    : [];
  return {
    id: String(detail?.id ?? ''),
    title: detail?.name ?? detail?.title ?? '',
    description: detail?.description ?? '',
    cover: detail?.coverUrl ?? '',
    visibility: (detail?.visibility ?? 'public') as Visibility,
    type: (detail?.type ?? 'general') as PlaylistType,
    tags: Array.isArray(detail?.tags) ? detail.tags : [],
    category: safeExtractCategory(detail?.category),
    movies,
    createdAt: String(detail?.meta?.createdAt ?? detail?.createdAt ?? ''),
    updatedAt: String(detail?.meta?.updatedAt ?? detail?.updatedAt ?? ''),
    views: Number(detail?.stats?.views ?? detail?.views ?? 0),
    likes: Number(detail?.stats?.likes ?? detail?.likes ?? 0),
    approvalStatus: (detail?.approvalStatus ?? 'pending') as ApprovalStatus,
  };
}

/**
 * 将后端 Playlist Summary DTO 映射为页面列表项的本地 Playlist 模型
 * 说明：左侧列表只需要基本信息与影片数量，影片数组用占位数量构造，
 * 以便在 UI 中直接展示“影片数”。
 */
export function mapBackendPlaylistSummaryToLocal(summary: any): Playlist {
  return {
    id: String(summary?.id ?? ''),
    title: summary?.name ?? '',
    description: '',
    cover: summary?.coverUrl ?? '',
    visibility: (summary?.visibility ?? 'public') as Visibility,
    type: (summary?.type ?? 'general') as PlaylistType,
    tags: Array.isArray(summary?.tags) ? summary.tags : [],
    category: safeExtractCategory(summary?.category),
    movies: new Array(Number(summary?.filmCount ?? 0)).fill(0).map((_, i) => ({
      id: String(i + 1),
      title: '',
      originalTitle: '',
      year: '',
      poster: '',
      category: '',
      rating: 0,
      torrentCount: 0,
    })),
    createdAt: String(summary?.meta?.createdAt ?? ''),
    updatedAt: String(summary?.meta?.updatedAt ?? ''),
    views: Number(summary?.stats?.views ?? 0),
    likes: Number(summary?.stats?.likes ?? 0),
    approvalStatus: (summary?.approvalStatus ?? 'pending') as ApprovalStatus,
  };
}

/**
 * 将后端影片列表项 DTO 映射为页面本地 Movie 模型
 */
export function mapFilmListItemToMovie(f: any): Movie {
  return {
    id: String(f?.id ?? ''),
    title: f?.title ?? '',
    originalTitle: f?.originalTitle ?? '',
    year: String(f?.year ?? ''),
    poster: f?.poster ?? f?.posterUrl ?? f?.coverUrl ?? '',
    category: f?.category ?? '',
    rating: Number(f?.rating ?? 0),
    torrentCount: Number(f?.torrentCount ?? 0),
  };
}

/**
 * 可见性中文文案映射，供 UI 展示使用
 */
export function getVisibilityText(visibility: Visibility): string {
  switch (visibility) {
    case 'public':
      return '公开';
    case 'private':
      return '私密';
    case 'friends':
      return '好友可见';
    default:
      return '公开';
  }
}

