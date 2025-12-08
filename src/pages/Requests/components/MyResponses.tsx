import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Upload, MessageSquare, Award } from 'lucide-react';

interface MyResponse {
  id: string;
  requestId: string;
  requestTitle: string;
  category: string;
  bounty: number;
  claimedAt: string;
  deadline: string;
  status: 'claimed' | 'submitted' | 'approved' | 'rejected' | 'disputed';
  requester: string;
  submittedAt?: string;
  rejectionReason?: string;
  timeRemaining: string;
}

const mockMyResponses: MyResponse[] = [
  {
    id: '1',
    requestId: 'req-1',
    requestTitle: '求权力的游戏第八季蓝光原盘',
    category: '剧集',
    bounty: 8000,
    claimedAt: '2025-12-05 10:30',
    deadline: '2025-12-12',
    status: 'claimed',
    requester: 'SeriesFan',
    timeRemaining: '4天23小时',
  },
  {
    id: '2',
    requestId: 'req-2',
    requestTitle: '求《沙丘》导演剪辑版4K',
    category: '电影',
    bounty: 6000,
    claimedAt: '2025-12-06 14:20',
    deadline: '2025-12-13',
    status: 'submitted',
    requester: 'MovieCollector',
    submittedAt: '2025-12-07 09:15',
    timeRemaining: '5天9小时',
  },
  {
    id: '3',
    requestId: 'req-3',
    requestTitle: '求BBC地球脉动III 4K完整版',
    category: '纪录片',
    bounty: 4000,
    claimedAt: '2025-12-01 08:00',
    deadline: '2025-12-08',
    status: 'approved',
    requester: 'NatureLover',
    submittedAt: '2025-12-05 16:30',
    timeRemaining: '已完成',
  },
  {
    id: '4',
    requestId: 'req-4',
    requestTitle: '求某部冷门电影蓝光',
    category: '电影',
    bounty: 3000,
    claimedAt: '2025-11-28 12:00',
    deadline: '2025-12-05',
    status: 'rejected',
    requester: 'FilmBuff',
    submittedAt: '2025-12-04 10:00',
    rejectionReason: '提供的资源不是蓝光原盘，而是压制版本，不符合要求',
    timeRemaining: '已结束',
  },
  {
    id: '5',
    requestId: 'req-5',
    requestTitle: '求某演唱会完整版',
    category: '音乐',
    bounty: 2500,
    claimedAt: '2025-11-25 15:30',
    deadline: '2025-12-02',
    status: 'disputed',
    requester: 'MusicLover',
    submittedAt: '2025-12-01 20:00',
    rejectionReason: '发布者认为音质不达标',
    timeRemaining: '仲裁中',
  },
];

type StatusFilter = 'all' | 'claimed' | 'submitted' | 'approved' | 'rejected' | 'disputed';

export function MyResponses() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredResponses = mockMyResponses.filter(
    response => statusFilter === 'all' || response.status === statusFilter
  );

  const getStatusConfig = (status: MyResponse['status']) => {
    switch (status) {
      case 'claimed':
        return { 
          icon: Clock, 
          text: '待提交', 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/30'
        };
      case 'submitted':
        return { 
          icon: AlertTriangle, 
          text: '待审核', 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30'
        };
      case 'approved':
        return { 
          icon: CheckCircle2, 
          text: '已通过', 
          color: 'text-green-400', 
          bg: 'bg-green-500/20',
          border: 'border-green-500/30'
        };
      case 'rejected':
        return { 
          icon: XCircle, 
          text: '已拒绝', 
          color: 'text-red-400', 
          bg: 'bg-red-500/20',
          border: 'border-red-500/30'
        };
      case 'disputed':
        return { 
          icon: MessageSquare, 
          text: '争议中', 
          color: 'text-purple-400', 
          bg: 'bg-purple-500/20',
          border: 'border-purple-500/30'
        };
    }
  };

  const activeTasks = mockMyResponses.filter(r => ['claimed', 'submitted', 'disputed'].includes(r.status));
  const completedTasks = mockMyResponses.filter(r => r.status === 'approved');
  const totalEarned = completedTasks.reduce((sum, r) => sum + r.bounty, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: '进行中任务', 
            value: activeTasks.length, 
            color: 'amber',
            description: '需要跟进'
          },
          { 
            label: '已完成', 
            value: completedTasks.length, 
            color: 'green',
            description: '成功交付'
          },
          { 
            label: '总收入', 
            value: totalEarned.toLocaleString(), 
            color: 'orange',
            description: '积分'
          },
          { 
            label: '被拒绝', 
            value: mockMyResponses.filter(r => r.status === 'rejected').length, 
            color: 'red',
            description: '需改进'
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4"
          >
            <div className="text-amber-400/60 mb-1">{stat.label}</div>
            <div className="text-amber-50 mb-1">{stat.value}</div>
            <div className="text-xs text-amber-300/50">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {([
            { value: 'all', label: '全部' },
            { value: 'claimed', label: '待提交' },
            { value: 'submitted', label: '待审核' },
            { value: 'approved', label: '已通过' },
            { value: 'rejected', label: '已拒绝' },
            { value: 'disputed', label: '争议中' },
          ] as { value: StatusFilter; label: string }[]).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === filter.value
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              {filter.label}
              {filter.value !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({mockMyResponses.filter(r => r.status === filter.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Important Alert */}
      {activeTasks.some(r => r.status === 'claimed' && r.timeRemaining.includes('小时')) && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-red-300 mb-1">紧急提醒</div>
              <div className="text-red-200/70">
                您有任务即将到期，请尽快提交资源，避免影响信用评分
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredResponses.map((response) => {
          const statusConfig = getStatusConfig(response.status);
          const StatusIcon = statusConfig.icon;
          const isUrgent = response.status === 'claimed' && response.timeRemaining.includes('小时');
          
          return (
            <div
              key={response.id}
              className={`bg-gradient-to-br from-amber-600/5 to-orange-600/5 border rounded-lg p-6 hover:border-amber-400/40 transition-all ${
                isUrgent ? 'border-red-400/40' : 'border-amber-500/20'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-amber-50 mb-2">{response.requestTitle}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-amber-300/60">
                      <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400">
                        {response.category}
                      </span>
                      <span>需求方: {response.requester}</span>
                      <span>认领于 {response.claimedAt}</span>
                    </div>
                  </div>
                  
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm whitespace-nowrap ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.text}
                  </span>
                </div>

                {/* Progress Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#0F171E]/50 rounded-lg border border-amber-500/10">
                  <div>
                    <div className="text-amber-400/60 text-sm mb-1">悬赏金额</div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-50">{response.bounty.toLocaleString()} 积分</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-amber-400/60 text-sm mb-1">截止时间</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-50">{response.deadline}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-amber-400/60 text-sm mb-1">剩余时间</div>
                    <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-400' : 'text-amber-50'}`}>
                      <Clock className="w-4 h-4" />
                      <span>{response.timeRemaining}</span>
                    </div>
                  </div>
                </div>

                {/* Submission Info */}
                {response.submittedAt && (
                  <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="text-blue-300 text-sm mb-1">提交时间: {response.submittedAt}</div>
                    {response.status === 'submitted' && (
                      <div className="text-blue-200/70 text-sm">等待需求方验收中...</div>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {response.rejectionReason && (
                  <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                    <div className="text-red-300 mb-1">拒绝原因</div>
                    <div className="text-red-200/70 text-sm">{response.rejectionReason}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {response.status === 'claimed' && (
                    <>
                      <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        提交资源
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm">
                        联系需求方
                      </button>
                      <button className="px-4 py-2 bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        放弃任务
                      </button>
                    </>
                  )}

                  {response.status === 'submitted' && (
                    <>
                      <button className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm">
                        查看提交详情
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm">
                        联系需求方
                      </button>
                    </>
                  )}

                  {response.status === 'rejected' && (
                    <>
                      <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all text-sm">
                        重新提交
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        发起仲裁
                      </button>
                    </>
                  )}

                  {response.status === 'disputed' && (
                    <>
                      <button className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm">
                        查看仲裁进度
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm">
                        补充证据
                      </button>
                    </>
                  )}

                  {response.status === 'approved' && (
                    <button className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm">
                      查看详情
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResponses.length === 0 && (
        <div className="text-center py-12 text-amber-300/60">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>暂无符合条件的应答记录</p>
        </div>
      )}
    </div>
  );
}
