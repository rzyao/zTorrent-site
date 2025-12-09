/**
 * 类型定义文件：用于声明页面所需的业务数据结构。
 *
 * 拆分理由：
 * - 将数据结构与 UI/逻辑分离，提升可复用性与可维护性。
 * - 统一类型出口，便于其他模块引入与代码提示。
 */

/** 媒体类型图标枚举（用于选择展示的图标） */
export type IconName = 'film' | 'music' | 'game' | 'book';

/** 制作组等级（用于渲染徽章与配色） */
export type Level = 'platinum' | 'gold' | 'silver' | 'bronze';

/** 制作组数据结构 */
export interface Group {
  id: string;
  name: string;
  icon: IconName;
  banner: string;
  avatar: string;
  description: string;
  specialties: string[];
  stats: {
    /** 成员数量 */
    members: number;
    /** 发布条目总数 */
    releases: number;
    /** 质量评分（0-100） */
    quality: number;
    /** 成立时间（YYYY-MM） */
    founded: string;
  };
  achievements: string[];
  /** 是否为精选 */
  featured: boolean;
  /** 是否正在招募 */
  recruiting: boolean;
  /** 等级 */
  level: Level;
}

