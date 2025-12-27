import { NavigationItem } from "@/types/navigation";

export const MOCK_DESKTOP_NAV: NavigationItem[] = [
  { id: '1', label: '首页', path: '/home', platform: 'desktop', sortOrder: 1, isVisible: true },
  { id: '2', label: '种子', path: '/torrents', platform: 'desktop', sortOrder: 2, isVisible: true },
  { id: '3', label: '字幕', path: '/subtitles', platform: 'desktop', sortOrder: 3, isVisible: true },
  { id: '4', label: '排行榜', path: '/ranking', platform: 'desktop', sortOrder: 4, isVisible: true },
  { id: '5', label: '电影', path: '/movies', platform: 'desktop', sortOrder: 5, isVisible: true },
  { id: '6', label: '剧集', path: '/series', platform: 'desktop', sortOrder: 6, isVisible: true },
  { id: '7', label: '片单', path: '/playlists', platform: 'desktop', sortOrder: 7, isVisible: true },
  { 
    id: '8', label: '发布', path: '#', platform: 'desktop', sortOrder: 8, isVisible: true, permissions: ['upload'],
    children: [
        { id: '8-1', label: '发资源', path: '/upload', platform: 'desktop', sortOrder: 1, isVisible: true },
        { id: '8-2', label: '发字幕', path: '/subtitles', platform: 'desktop', sortOrder: 2, isVisible: true },
    ]
  },
  { id: '9', label: '候选', path: '/candidates', platform: 'desktop', sortOrder: 9, isVisible: true },
  {
    id: '10', label: '编辑', path: '#', platform: 'desktop', sortOrder: 10, isVisible: true,
    children: [
        { id: '10-1', label: '电影', path: '/edit/movie', platform: 'desktop', sortOrder: 1, isVisible: true, permissions: ['edit:movie'] },
        { id: '10-2', label: '剧集', path: '/edit/series', platform: 'desktop', sortOrder: 2, isVisible: true, permissions: ['edit:series'] },
        { id: '10-3', label: '片单', path: '/edit/playlist', platform: 'desktop', sortOrder: 3, isVisible: true, permissions: ['edit:playlist'] },
    ]
  },
  { id: '11', label: '论坛', path: '/forum', platform: 'desktop', sortOrder: 11, isVisible: true },
  { id: '12', label: '规则', path: '/rules', platform: 'desktop', sortOrder: 12, isVisible: true },
  { id: '13', label: '审核', path: '/review', platform: 'desktop', sortOrder: 13, isVisible: true, permissions: ['review:write', 'admin', 'superadmin'] },
  {
    id: '14', label: '其他', path: '#', platform: 'desktop', sortOrder: 14, isVisible: true,
    children: [
        { id: '14-1', label: '工单', path: '/tickets', platform: 'desktop', sortOrder: 1, isVisible: true, permissions: ['tickets'] },
        { id: '14-2', label: '求种', path: '/requests', platform: 'desktop', sortOrder: 2, isVisible: true },
        { id: '14-3', label: '制作组', path: '/groups', platform: 'desktop', sortOrder: 3, isVisible: true },
        { id: '14-4', label: 'RSS订阅', path: '/rss', platform: 'desktop', sortOrder: 4, isVisible: true },
        { id: '14-5', label: '管理组', path: '/staff', platform: 'desktop', sortOrder: 5, isVisible: true },
        { id: '14-6', label: '使用教程', path: '/tutorials', platform: 'desktop', sortOrder: 6, isVisible: true },
        { id: '14-7', label: '保种列表', path: '/seeding', platform: 'desktop', sortOrder: 7, isVisible: true },
        { id: '14-8', label: '断种大厅', path: '/dead-torrents', platform: 'desktop', sortOrder: 8, isVisible: true },
        { id: '14-9', label: '小游戏', path: '/games', platform: 'desktop', sortOrder: 9, isVisible: true },
        { id: '14-10', label: '站点公告', path: '/announcements', platform: 'desktop', sortOrder: 10, isVisible: true },
        { id: '14-11', label: '音乐', path: '/music', platform: 'desktop', sortOrder: 11, isVisible: true },
        { id: '14-12', label: '播放器', path: '/player', platform: 'desktop', sortOrder: 12, isVisible: true },
    ]
  }
];

export const MOCK_MOBILE_NAV: NavigationItem[] = [
    { id: 'm-1', label: '首页', path: '/home', platform: 'mobile', sortOrder: 1, isVisible: true },
    { id: 'm-2', label: '种子', path: '/torrents', platform: 'mobile', sortOrder: 2, isVisible: true },
    { id: 'm-3', label: '论坛', path: '/forum', platform: 'mobile', sortOrder: 3, isVisible: true },
    { id: 'm-4', label: '候选', path: '/candidates', platform: 'mobile', sortOrder: 4, isVisible: true },
    { id: 'm-5', label: '制作组', path: '/groups', platform: 'mobile', sortOrder: 5, isVisible: true },
    { id: 'm-6', label: '电影', path: '/movies', platform: 'mobile', sortOrder: 6, isVisible: true },
    { id: 'm-7', label: '剧集', path: '/series', platform: 'mobile', sortOrder: 7, isVisible: true },
    { id: 'm-8', label: '片单', path: '/playlists', platform: 'mobile', sortOrder: 8, isVisible: true },
    { id: 'm-9', label: '音乐', path: '/music', platform: 'mobile', sortOrder: 9, isVisible: true },
    { id: 'm-10', label: '播放器', path: '/player', platform: 'mobile', sortOrder: 10, isVisible: true },
    { id: 'm-11', label: '上传', path: '/upload', platform: 'mobile', sortOrder: 11, isVisible: true, permissions: ['upload'] },
    { id: 'm-12', label: '影片编辑', path: '/edit/movie', platform: 'mobile', sortOrder: 12, isVisible: true, permissions: ['edit:movie'] },
    { id: 'm-13', label: '片单编辑', path: '/edit/playlist', platform: 'mobile', sortOrder: 13, isVisible: true, permissions: ['edit:playlist'] },
    { id: 'm-14', label: '审核', path: '/review', platform: 'mobile', sortOrder: 14, isVisible: true, permissions: ['review:write'] },
    { id: 'm-15', label: '工单', path: '/tickets', platform: 'mobile', sortOrder: 15, isVisible: true, permissions: ['tickets'] },
    { id: 'm-16', label: '求种', path: '/requests', platform: 'mobile', sortOrder: 16, isVisible: true },
    { id: 'm-17', label: '规则', path: '/rules', platform: 'mobile', sortOrder: 17, isVisible: true },
    { id: 'm-18', label: 'RSS订阅', path: '/rss', platform: 'mobile', sortOrder: 18, isVisible: true },
    { id: 'm-19', label: '管理组', path: '/staff', platform: 'mobile', sortOrder: 19, isVisible: true },
    { id: 'm-20', label: '站点公告', path: '/announcements', platform: 'mobile', sortOrder: 20, isVisible: true },
];
