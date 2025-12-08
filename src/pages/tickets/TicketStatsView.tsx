import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TicketStatsView() {
  // 模拟统计数据
  const stats = {
    overview: {
      total: 156,
      trend: '+12%',
      trendUp: true,
      resolved: 98,
      resolvedRate: '62.8%',
      avgResponseTime: '2.3小时',
      avgResolutionTime: '8.5小时',
    },
    byCategory: [
      { name: '技术问题', count: 58, percentage: 37.2, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
      { name: '账号问题', count: 42, percentage: 26.9, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
      { name: '资源问题', count: 28, percentage: 17.9, color: 'text-green-400', bgColor: 'bg-green-500/20' },
      { name: '投诉举报', count: 18, percentage: 11.5, color: 'text-red-400', bgColor: 'bg-red-500/20' },
      { name: '其他问题', count: 10, percentage: 6.4, color: 'text-neutral-400', bgColor: 'bg-neutral-500/20' },
    ],
    byStaff: [
      { name: 'TechSupport', assigned: 45, resolved: 38, avgTime: '6.2小时' },
      { name: 'AdminTeam', assigned: 38, resolved: 32, avgTime: '7.8小时' },
      { name: 'SupportTeam', assigned: 29, resolved: 28, avgTime: '5.5小时' },
    ],
    recentTrend: [
      { date: '11-20', created: 18, resolved: 12 },
      { date: '11-21', created: 22, resolved: 15 },
      { date: '11-22', created: 15, resolved: 19 },
      { date: '11-23', created: 20, resolved: 17 },
      { date: '11-24', created: 25, resolved: 20 },
      { date: '11-25', created: 19, resolved: 22 },
      { date: '11-26', created: 23, resolved: 16 },
    ],
  };

  return (
    <div>
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">总工单数</span>
            <BarChart3 className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-white text-3xl mb-1">{stats.overview.total}</div>
          <div className={`flex items-center gap-1 text-sm ${stats.overview.trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {stats.overview.trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{stats.overview.trend} vs 上周</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400">已解决</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-white text-3xl mb-1">{stats.overview.resolved}</div>
          <div className="text-sm text-neutral-400">
            解决率 {stats.overview.resolvedRate}
          </div>
        </div>

        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400">平均响应</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-white text-3xl mb-1">{stats.overview.avgResponseTime}</div>
          <div className="text-sm text-neutral-400">
            首次响应时间
          </div>
        </div>

        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400">平均解决</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-white text-3xl mb-1">{stats.overview.avgResolutionTime}</div>
          <div className="text-sm text-neutral-400">
            工单解决时间
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 分类统计 */}
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
          <h3 className="text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            工单分类统计
          </h3>
          <div className="space-y-4">
            {stats.byCategory.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${category.color}`}>
                    {category.name}
                  </span>
                  <span className="text-white">{category.count}</span>
                </div>
                <div className="relative h-2 bg-neutral-700/30 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${category.bgColor} transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <div className="text-neutral-500 text-xs mt-1">
                  {category.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 人员统计 */}
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
          <h3 className="text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            人员工作统计
          </h3>
          <div className="space-y-4">
            {stats.byStaff.map((staff) => (
              <div
                key={staff.name}
                className="bg-neutral-700/20 rounded-xl p-4 border border-neutral-600/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">{staff.name}</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {((staff.resolved / staff.assigned) * 100).toFixed(0)}% 完成率
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-neutral-500">分配</div>
                    <div className="text-white">{staff.assigned}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">解决</div>
                    <div className="text-green-400">{staff.resolved}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">平均时间</div>
                    <div className="text-blue-400">{staff.avgTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 趋势图 */}
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          7日趋势
        </h3>
        <div className="space-y-4">
          {/* 简化版图表 - 使用条形图 */}
          <div className="grid grid-cols-7 gap-2">
            {stats.recentTrend.map((day) => {
              const maxValue = Math.max(
                ...stats.recentTrend.map((d) => Math.max(d.created, d.resolved))
              );
              const createdHeight = (day.created / maxValue) * 100;
              const resolvedHeight = (day.resolved / maxValue) * 100;

              return (
                <div key={day.date} className="flex flex-col items-center gap-2">
                  <div className="flex items-end justify-center gap-1 h-32 w-full">
                    <div className="relative flex-1 flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-amber-500 to-orange-600 rounded-t transition-all duration-500"
                        style={{ height: `${createdHeight}%` }}
                        title={`创建: ${day.created}`}
                      />
                    </div>
                    <div className="relative flex-1 flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-green-500 to-emerald-600 rounded-t transition-all duration-500"
                        style={{ height: `${resolvedHeight}%` }}
                        title={`解决: ${day.resolved}`}
                      />
                    </div>
                  </div>
                  <div className="text-neutral-400 text-xs">{day.date}</div>
                </div>
              );
            })}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-700/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-amber-500 to-orange-600" />
              <span className="text-neutral-400 text-sm">创建</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-green-500 to-emerald-600" />
              <span className="text-neutral-400 text-sm">解决</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
