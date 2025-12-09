export const unwrapResponse = (resp: any) => {
  const body = resp?.code !== undefined ? resp : resp?.data;
  return body?.data ?? body;
};

export const extractErrorMessage = (e: any) => {
  const msg = e?.body?.message || e?.message || '操作失败，请稍后重试';
  return String(msg);
};

export const getVisibilityLabel = (visibility?: string) => {
  switch (visibility) {
    case 'public': return '公开';
    case 'members': return '会员可见';
    case 'private': return '私有';
    default: return '-';
  }
};

export const getTypeLabel = (type: 'movie' | 'playlist' | 'torrent') => {
  switch (type) {
    case 'movie': return '影片';
    case 'playlist': return '片单';
    case 'torrent': return '种子';
  }
};

