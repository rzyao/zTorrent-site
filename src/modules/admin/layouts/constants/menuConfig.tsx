import React from "react";
import {
  HomeOutlined,
  SettingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  CloudDownloadOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  ToolOutlined,
  LayoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";

/**
 * 菜单项原始配置接口
 * 将路径和标签分离，避免在组件内部创建 React 元素
 */
export interface RawMenuItem {
  key: string;
  label: string;
  path?: string; // 可点击的菜单项需要 path
  perm?: string;
  icon?: React.ReactNode;
  children?: RawMenuItem[];
}

/**
 * 菜单图标映射（静态，只创建一次）
 * 原因：将图标实例化移到模块顶层，避免每次渲染都创建新的 React 元素
 */
export const MENU_ICONS: Record<string, React.ReactNode> = {
  dashboard: <HomeOutlined />,
  system: <SettingOutlined />,
  "recommendation-config": <LayoutOutlined />,
  "navigation-settings": <MenuOutlined />,
  categories: <TagsOutlined />,
  torrents: <CloudDownloadOutlined />,
  content: <AppstoreOutlined />,
  store: <AppstoreOutlined />,
  bonus: <AppstoreOutlined />,
  users: <TeamOutlined />,
  dictionary: <BookOutlined />,
  invites: <SafetyCertificateOutlined />,
  tickets: <ToolOutlined />,
};

/**
 * 原始菜单配置（静态数据）
 * 优化点：
 * 1. 不包含 React 元素（如 <Link>），只保留纯数据
 * 2. icon 通过 key 从 MENU_ICONS 映射获取
 * 3. 渲染时再动态生成 onClick 导航
 */
export const RAW_MENU_ITEMS: RawMenuItem[] = [
  {
    key: "dashboard",
    label: "首页",
    path: "/",
    perm: "admin/dashboard",
  },
  {
    key: "system",
    label: "系统设置",
    path: "/system",
    perm: "admin/system",
  },
  {
    key: "recommendation-config",
    label: "推荐配置",
    path: "/recommendation-config",
    perm: "admin/recommendations",
  },
  {
    key: "navigation-settings",
    label: "导航管理",
    perm: "admin/navigation",
    children: [
      {
        key: "navigation-desktop",
        label: "桌面导航",
        path: "/navigation/desktop",
        perm: "admin/navigation",
      },
      {
        key: "navigation-mobile",
        label: "手机导航",
        path: "/navigation/mobile",
        perm: "admin/navigation",
      },
    ],
  },
  {
    key: "categories",
    label: "分类设置",
    perm: "admin/categories",
    children: [
      {
        key: "categories-general",
        label: "通用分类",
        perm: "admin/categories",
        children: [
          {
            key: "categories-torrent",
            label: "种子分类",
            path: "/categories/torrent",
            perm: "admin/categories",
          },
          {
            key: "categories-movie",
            label: "电影分类",
            path: "/categories/movie",
            perm: "admin/categories",
          },
          {
            key: "categories-series",
            label: "剧集分类",
            path: "/categories/series",
            perm: "admin/categories",
          },
          {
            key: "categories-playlist",
            label: "片单分类",
            path: "/categories/playlist",
            perm: "admin/categories",
          },
        ],
      },
      {
        key: "categories-adult",
        label: "成人分类",
        perm: "admin/categories",
        children: [
          {
            key: "categories-adult-torrent",
            label: "种子分类",
            path: "/categories/adult/torrent",
            perm: "admin/categories",
          },
          {
            key: "categories-adult-movie",
            label: "电影分类",
            path: "/categories/adult/movie",
            perm: "admin/categories",
          },
          {
            key: "categories-adult-series",
            label: "剧集分类",
            path: "/categories/adult/series",
            perm: "admin/categories",
          },
          {
            key: "categories-adult-playlist",
            label: "片单分类",
            path: "/categories/adult/playlist",
            perm: "admin/categories",
          },
        ],
      },
    ],
  },
  {
    key: "torrents",
    label: "种子管理",
    perm: "admin/torrents",
    children: [
      {
        key: "torrents-list",
        label: "种子列表",
        path: "/torrents",
        perm: "admin/torrents",
      },
      {
        key: "torrents-records",
        label: "种子记录",
        path: "/torrents/records",
        perm: "admin/torrents",
      },
      {
        key: "torrents-user-records",
        label: "用户记录",
        path: "/torrents/user-records",
        perm: "admin/torrents",
      },
    ],
  },
  {
    key: "content",
    label: "内容管理",
    perm: "manage_content",
    children: [
      {
        key: "content-general",
        label: "通用内容",
        perm: "manage_content_general",
        children: [
          {
            key: "movies",
            label: "电影管理",
            path: "/movies",
            perm: "manage_torrents",
          },
          {
            key: "playlists",
            label: "片单管理",
            path: "/playlists",
            perm: "manage_playlists",
          },
        ],
      },
      {
        key: "content-music",
        label: "音乐内容",
        perm: "manage_content_music",
        children: [],
      },
      {
        key: "content-adult",
        label: "成人内容",
        perm: "manage_content_adult",
        children: [],
      },
    ],
  },
  {
    key: "store",
    label: "商城管理",
    perm: "manage_store",
    children: [
      {
        key: "store-items",
        label: "商品管理",
        path: "/store/items",
        perm: "manage_store",
      },
      {
        key: "store-orders",
        label: "订单列表",
        path: "/store/orders",
        perm: "manage_store",
      },
    ],
  },
  {
    key: "bonus",
    label: "魔力管理",
    perm: "manage_bonus",
    children: [
      {
        key: "bonus-balances",
        label: "余额列表",
        path: "/bonus/balances",
        perm: "manage_bonus",
      },
      {
        key: "bonus-ledger",
        label: "流水列表",
        path: "/bonus/ledger",
        perm: "manage_bonus",
      },
      {
        key: "bonus-batch-adjust",
        label: "批量调账",
        path: "/bonus/batch-adjust",
        perm: "manage_bonus",
      },
      {
        key: "bonus-rules",
        label: "规则配置",
        path: "/bonus/rules",
        perm: "manage_bonus",
      },
      {
        key: "bonus-adjust",
        label: "人工调账",
        path: "/bonus/adjust",
        perm: "manage_bonus",
      },
    ],
  },
  {
    key: "users",
    label: "用户管理",
    perm: "admin/users",
    children: [
      {
        key: "users-list",
        label: "用户列表",
        path: "/users",
        perm: "admin/users",
      },
      {
        key: "users-punishments",
        label: "处罚记录",
        path: "/users/punishments",
        perm: "admin/users/punishments",
      },
      {
        key: "users-levels",
        label: "级别管理",
        path: "/users/levels",
        perm: "admin/levels",
      },
      {
        key: "users-roles",
        label: "角色管理",
        path: "/users/roles",
        perm: "admin/roles",
      },
      {
        key: "users-permissions",
        label: "权限管理",
        perm: "admin/permissions",
        children: [
          {
            key: "permissions-web",
            label: "网页权限",
            path: "/users/permissions/web",
            perm: "admin/permissions",
          },
          {
            key: "permissions-admin",
            label: "后台权限",
            path: "/users/permissions/admin",
            perm: "admin/permissions",
          },
        ],
      },
    ],
  },
  {
    key: "dictionary",
    label: "字典管理",
    perm: "admin/dictionary",
    children: [
      {
        key: "punishment-types",
        label: "处罚类型",
        path: "/dictionary/punishment-types",
        perm: "admin/dictionary/punishment-types",
      },
      {
        key: "ban-reasons",
        label: "处罚原因",
        path: "/dictionary/ban-reasons",
        perm: "admin/dictionary/ban-reasons",
      },
      {
        key: "unban-reasons",
        label: "解除处罚",
        path: "/dictionary/unban-reasons",
        perm: "admin/dictionary/unban-reasons",
      },
      {
        key: "ban-days",
        label: "处罚时长",
        path: "/dictionary/ban-days",
        perm: "admin/dictionary/ban-days",
      },
    ],
  },
  {
    key: "invites",
    label: "邀请管理",
    perm: "manage-invites",
    children: [
      {
        key: "invites-list",
        label: "邀请记录",
        path: "/invites/list",
        perm: "manage-invites",
      },
      {
        key: "invites-quota",
        label: "邀请名额",
        path: "/invites/quota",
        perm: "manage-invites",
      },
      {
        key: "invites-statistics",
        label: "邀请统计",
        path: "/invites/statistics",
        perm: "manage-invites",
      },
      {
        key: "invites-send",
        label: "发送邀请",
        path: "/invites/send",
        perm: "send-official-invite",
      },
    ],
  },
  {
    key: "tickets",
    label: "工单管理",
    path: "/tickets",
    perm: "manage-tickets",
  },
];
