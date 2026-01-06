// 断种页面业务逻辑 Hook：
// - 负责根据激活的 Tab 与排序规则返回可见列表
// - 同时计算当前 Tab 的统计数据（总数/总悬赏/平均悬赏）
// 设计原则：无副作用、纯计算；便于未来接入后端数据源

import { useMemo } from 'react';
import type { DeadTorrent, TabStats, TabType } from '../types';

export type SortBy = 'time' | 'bounty' | 'ratio';

export function useDeadTorrents(
  hallTorrents: DeadTorrent[],
  myPublishedTorrents: DeadTorrent[],
  myDownloadedTorrents: DeadTorrent[],
  activeTab: TabType,
  sortBy: SortBy,
) {
  // 根据当前 Tab 返回原始列表
  const rawList = useMemo(() => {
    switch (activeTab) {
      case 'myPublished':
        return myPublishedTorrents;
      case 'myDownloaded':
        return myDownloadedTorrents;
      case 'hall':
      default:
        return hallTorrents;
    }
  }, [activeTab, hallTorrents, myPublishedTorrents, myDownloadedTorrents]);

  // 排序逻辑：
  // - bounty：按悬赏总额降序
  // - ratio：按分享率降序
  // - time：按“断种时长”字面降序（示例数据为字符串，真实场景建议改为数值）
  const sortedList = useMemo(() => {
    const list = [...rawList];
    switch (sortBy) {
      case 'ratio':
        return list.sort((a, b) => b.ratio - a.ratio);
      case 'time':
        // 注意：示例数据 deadTime 为字符串（如“15天8小时”），此处仅按字符串倒序近似处理
        // 真实数据建议使用数值型时长字段，或在此处进行正则解析为分钟数
        return list.sort((a, b) => String(b.deadTime).localeCompare(String(a.deadTime)));
      case 'bounty':
      default:
        return list.sort((a, b) => b.bounty - a.bounty);
    }
  }, [rawList, sortBy]);

  // 统计数据计算
  const stats: TabStats = useMemo(() => {
    const total = sortedList.length;
    const totalBounty = sortedList.reduce((sum, t) => sum + t.bounty, 0);
    const avgBounty = total > 0 ? totalBounty / total : 0;
    return { total, totalBounty, avgBounty };
  }, [sortedList]);

  return { list: sortedList, stats };
}

