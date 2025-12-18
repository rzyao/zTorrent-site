import { Series, SeriesFormState } from "./types";

export function stripBackticksAndTrim(str?: string) {
  if (!str) return '';
  return str.replace(/^`|`$/g, '').trim();
}

export function parseDurationToMinutes(durationStr: string): string {
  // 简单透传，如果需要逻辑（如将 "1h 30m" 转为 "90"）可在此实现
  // 目前 DTO 也是 string，所以保持原样
  return durationStr;
}

export function validateSeriesForm(form: SeriesFormState) {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = '标题不能为空';
  if (!form.poster.trim()) errs.poster = '海报不能为空';
  if (form.categories.length === 0) errs.categories = '请至少选择一个分类';
  
  return {
    valid: Object.keys(errs).length === 0,
    errs
  };
}

export function mapBackendSeriesToLocal(backend: any): Series {
  return {
    id: backend.id,
    title: backend.title || '',
    originalTitle: backend.originalTitle || '',
    year: backend.year ? String(backend.year) : '',
    poster: backend.posterUrl || '',
    backdrop: backend.backdropUrl || '',
    categories: backend.categories || [],
    genres: backend.genres || [],
    rating: Number(backend.rating || 0),
    duration: String(backend.episodeDuration || ''), // 剧集单集时长
    director: backend.director || '',
    cast: backend.cast || [],
    description: backend.description || '',
    seasonNumber: backend.seasonNumber || 1,
    episodeCount: backend.episodeCount || 0,
    status: backend.status || '',
    doubanLink: backend.doubanLink || '',
    imdbLink: backend.imdbLink || '',
    torrents: [], // No torrents API yet
    createdAt: backend.createdAt || '',
    updatedAt: backend.updatedAt || '',
  };
}
