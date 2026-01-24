export function isValidUrl(url: string) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidYear(year: string) {
  if (!year) return false;
  return /^\d{4}(-\d{4})?$/.test(year);
}

export function isValidRating(r: number) {
  return r >= 0 && r <= 10;
}

export function stripBackticksAndTrim(s: any) {
  const raw = String(s ?? "").trim();
  if (!raw) return "";
  return raw.replace(/^`+|`+$/g, "").trim();
}

export function parseDurationToMinutes(text: string) {
  const t = String(text || "").trim();
  const m = t.match(/(\d+)(?=\s*分钟)/);
  return m ? m[1] : t;
}

export function validateFilmForm(form: any) {
  const errs: Record<string, string> = {};
  if (!form.title?.trim()) errs.title = "标题为必填项";
  if (!isValidYear(String(form.year || ""))) errs.year = "年份格式必须为YYYY或YYYY-YYYY";
  if (!Array.isArray(form.categories) || form.categories.length === 0)
    errs.categories = "请至少选择一个类别";
  if (!isValidRating(Number(form.rating ?? 0))) errs.rating = "评分需在0到10之间";
  if (!isValidUrl(String(form.poster || ""))) errs.poster = "海报URL必须以http/https开头";
  if (!isValidUrl(String(form.backdrop || ""))) errs.backdrop = "背景URL必须以http/https开头";
  if (form.doubanLink && !isValidUrl(String(form.doubanLink)))
    errs.doubanLink = "豆瓣链接必须为有效URL";
  if (form.imdbLink && !isValidUrl(String(form.imdbLink))) errs.imdbLink = "IMDb链接必须为有效URL";
  if (!isValidRating(Number(form.doubanRatingAverage ?? 0)))
    errs.doubanRatingAverage = "豆瓣平均分需在0到10之间";
  if (!isValidRating(Number(form.imdbRatingAverage ?? 0)))
    errs.imdbRatingAverage = "IMDb平均分需在0到10之间";
  return { valid: Object.keys(errs).length === 0, errs };
}

export function mapBackendTorrentToLocal(t: any) {
  return {
    id: String(t?.id ?? t?.torrentId ?? ""),
    title: t?.title ?? "",
    subTitle: t?.subTitle ?? "",
    version: t?.version ?? t?.name ?? t?.quality ?? "",
    size: t?.size ?? "",
    quality: t?.quality ?? "",
    standard: t?.standard ?? "",
    source: t?.source ?? "",
    codec: t?.codec ?? t?.videoCodec ?? "",
    audio: t?.audio ?? t?.audioCodec ?? "",
    seeders: t?.seeders ?? 0,
    leechers: t?.leechers ?? 0,
    uploadDate: t?.uploadedAt ?? t?.uploadDate ?? "",
    isFree: t?.isFree ?? false,
    isVip: t?.isVip ?? false,
  };
}

export function mapBackendFilmToLocal(detail: any) {
  const genres = Array.isArray(detail?.genre)
    ? detail.genre.filter(Boolean)
    : Array.isArray(detail?.genres)
      ? detail.genres.map((g: any) => (typeof g === "string" ? g : g?.name)).filter(Boolean)
      : [];
  const torrents = Array.isArray(detail?.torrents)
    ? detail.torrents.map(mapBackendTorrentToLocal)
    : [];
  return {
    id: String(detail?.id ?? ""),
    title: detail?.title ?? "",
    originalTitle: detail?.originalTitle ?? "",
    year: String(detail?.year ?? ""),
    poster: detail?.poster ?? detail?.posterUrl ?? detail?.coverUrl ?? "",
    posterAttachmentId: detail?.posterAttachmentId,
    backdrop: detail?.backdrop ?? detail?.backdropUrl ?? "",
    backdropAttachmentId: detail?.backdropAttachmentId,
    categories: Array.isArray(detail?.categories) ? detail.categories : [],
    genres,
    rating: Number(detail?.rating ?? 0),
    duration:
      typeof detail?.duration === "number" ? `${detail.duration}分钟` : (detail?.duration ?? ""),
    director: detail?.director ?? "",
    cast: Array.isArray(detail?.cast) ? detail.cast : [],
    description: detail?.description ?? "",
    torrents,
    createdAt: String(detail?.createdAt ?? ""),
    updatedAt: String(detail?.updatedAt ?? ""),
  };
}
