/**
 * 常量/静态数据文件：提供页面使用的模拟数据。
 *
 * 拆分理由：
 * - 将静态数据从组件中剥离，避免组件文件臃肿。
 * - 后续可替换为真实 API 数据，而无需改动 UI 组件。
 */
import type { Group } from './types';

/** 页面使用的模拟制作组数据 */
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'HD-Sky 制作组',
    icon: 'film',
    banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    avatar: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=200',
    description:
      '专注于高清电影和剧集的压制与发布，以卓越的画质和音质著称。我们使用最先进的压制技术，为用户提供最佳观影体验。',
    specialties: ['4K UHD', 'HDR', 'Dolby Vision', 'Atmos音轨'],
    stats: { members: 45, releases: 1247, quality: 98, founded: '2018-03' },
    achievements: ['年度最佳制作组', '白金认证', '质量保证'],
    featured: true,
    recruiting: true,
    level: 'platinum',
  },
  {
    id: '2',
    name: 'MusicHaven',
    icon: 'music',
    banner: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    avatar: 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=200',
    description:
      '致力于高品质音乐的收集和分享。从古典到流行，从FLAC到DSD，我们追求极致的听觉享受。',
    specialties: ['FLAC 无损', 'Hi-Res', 'DSD', '黑胶转录'],
    stats: { members: 32, releases: 856, quality: 96, founded: '2019-07' },
    achievements: ['金牌认证', '音质标杆'],
    featured: true,
    recruiting: false,
    level: 'gold',
  },
  {
    id: '3',
    name: 'AnimeNova 字幕组',
    icon: 'film',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    avatar: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=200',
    description:
      '专业动画字幕组，提供精准翻译和精美特效字幕。新番跟进迅速，质量始终如一。',
    specialties: ['新番速递', '精翻字幕', '特效字幕', 'BD修正'],
    stats: { members: 28, releases: 634, quality: 94, founded: '2020-01' },
    achievements: ['银牌认证', '速度之星'],
    featured: false,
    recruiting: true,
    level: 'silver',
  },
  {
    id: '4',
    name: 'GameArchive',
    icon: 'game',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    avatar: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200',
    description:
      '游戏资源归档小组，收录经典与最新游戏，包含完整DLC和更新补丁。',
    specialties: ['完整版游戏', 'DLC整合', '中文汉化', '经典复刻'],
    stats: { members: 22, releases: 423, quality: 92, founded: '2020-09' },
    achievements: ['银牌认证', '归档先锋'],
    featured: false,
    recruiting: true,
    level: 'silver',
  },
  {
    id: '5',
    name: 'DocuVerse',
    icon: 'book',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    avatar: 'https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?w=200',
    description:
      '纪录片和知识类视频专业制作组，涵盖自然、历史、科技等多个领域。',
    specialties: ['4K纪录片', '双语字幕', '科普内容', '高码率'],
    stats: { members: 18, releases: 312, quality: 95, founded: '2021-03' },
    achievements: ['金牌认证', '知识传播者'],
    featured: false,
    recruiting: false,
    level: 'gold',
  },
  {
    id: '6',
    name: 'RetroMedia',
    icon: 'film',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    avatar: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
    description:
      '专注于经典老片的修复与重制，让经典永流传。使用AI技术进行4K修复。',
    specialties: ['AI修复', '胶片扫描', '经典重制', '收藏级画质'],
    stats: { members: 15, releases: 198, quality: 97, founded: '2021-11' },
    achievements: ['白金认证', '修复大师'],
    featured: true,
    recruiting: true,
    level: 'platinum',
  },
];

