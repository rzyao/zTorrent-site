import {
  ListTodo,
  Clock,
  AlertCircle,
  User,
  Download,
  Flag,
  Info,
  Calendar,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/modules/app/components/ui/badge';
import { Button } from '@/modules/app/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { useTickets } from '@/modules/app/pages/Tickets/hooks/useTickets';

export function MyTodosView() {
  const { listTodos, todos } = useTickets();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { listTodos({ page: 1, pageSize: 20 }); }, []);
  useEffect(() => {
    const arr = (todos?.items ?? todos) || [];
    setItems(Array.isArray(arr) ? arr : []);
  }, [todos]);

  const categoryConfig = {
    technical: {
      label: '技术问题',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    account: {
      label: '账号问题',
      icon: <User className="w-4 h-4" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    resource: {
      label: '资源问题',
      icon: <Download className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    report: {
      label: '投诉举报',
      icon: <Flag className="w-4 h-4" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    other: {
      label: '其他问题',
      icon: <Info className="w-4 h-4" />,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-500/20',
    },
  };

  const priorityConfig = {
    low: { label: '低', color: 'text-neutral-400', bgColor: 'bg-neutral-500/20' },
    normal: { label: '中', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    high: { label: '高', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    urgent: { label: '紧急', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400">待处理</span>
            <ListTodo className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-white text-3xl">{items.length}</div>
          <p className="text-neutral-500 text-sm mt-2">分配给我的工单</p>
        </div>
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-400">高优先级</span>
            <AlertCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-white text-3xl">
            {items.filter((t: any) => t.priority === 'high' || t.priority === 'urgent').length}
          </div>
          <p className="text-neutral-500 text-sm mt-2">需要优先处理</p>
        </div>
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400">今日完成</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text白色 text-3xl">5</div>
          <p className="text-neutral-500 text-sm mt-2">已解决的工单</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 mb-6">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-amber-400" />
          我的待办工单
        </h3>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400">太棒了!暂无待处理工单</p>
            </div>
          ) : (
            items.map((todo: any) => {
              const categoryInfo = categoryConfig[todo.category as keyof typeof categoryConfig];
              const priorityInfo = priorityConfig[todo.priority as keyof typeof priorityConfig];

              return (
                <div
                  key={todo.id}
                  className="bg-linear-to-br from-neutral-700/30 to-neutral-800/30 rounded-xl border border-neutral-600/30 p-6 hover:border-amber-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-white group-hover:text-amber-400 transition-colors">
                          {todo.title}
                        </h3>
                        <Badge className="bg-neutral-700/50 text-neutral-300 text-xs">
                          {todo.id}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          className={`${categoryInfo.bgColor} ${categoryInfo.color} text-xs`}
                        >
                          {categoryInfo.icon}
                          <span className="ml-1">{categoryInfo.label}</span>
                        </Badge>
                        <Badge
                          className={`${priorityInfo.bgColor} ${priorityInfo.color} text-xs`}
                        >
                          优先级: {priorityInfo.label}
                        </Badge>
                        <Badge className="bg-neutral-700/50 text-neutral-300 text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {todo.user}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('处理工单:', todo.id);
                      }}
                      size="sm"
                      className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      立即处理
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      <span>分配于 {todo.assignedAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>{todo.messagesCount} 条消息</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-400">
                      <Clock className="w-4 h-4" />
                      <span>等待 {Math.round((todo.waitingTimeSec ?? 0) / 60)} 分钟</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          最近完成
        </h3>

        <div className="space-y-3">
          {[
            {
              id: 'TK-2024-002',
              title: '账号无法登录',
              user: 'UserName2',
              completedAt: '2024-11-25 16:45',
            },
            {
              id: 'TK-2024-005',
              title: '魔力值兑换问题',
              user: 'UserName5',
              completedAt: '2024-11-24 15:30',
            },
          ].map((completed) => (
            <div
              key={completed.id}
              className="flex items-center justify-between p-4 bg-neutral-700/20 rounded-xl border border-neutral-600/20"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <h4 className="text-white text-sm">{completed.title}</h4>
                  <p className="text-neutral-500 text-xs mt-1">
                    {completed.id} · {completed.user}
                  </p>
                </div>
              </div>
              <span className="text-neutral-500 text-xs">{completed.completedAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
