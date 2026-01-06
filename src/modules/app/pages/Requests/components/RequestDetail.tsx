import { useState } from 'react';
import { Clock, Award, User, MessageSquare, TrendingUp, Upload, CheckCircle2, XCircle, AlertTriangle, Flag, Calendar, Eye } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'claimed' | 'submitted' | 'approved' | 'rejected' | 'disputed' | 'bounty_added';
  user: string;
  description: string;
  timestamp: string;
}

export function RequestDetail() {
  // 模拟用户身份: 'visitor' | 'requester' | 'responder' | 'admin'
  const [userRole] = useState<'visitor' | 'requester' | 'responder' | 'admin'>('visitor');
  const [requestStatus] = useState<'active' | 'claimed' | 'submitted' | 'completed' | 'disputed'>('active');
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [comment, setComment] = useState('');

  // 模拟数据
  const requestData = {
    id: 'req-001',
    title: '求《星际穿越》4K HDR REMUX版本',
    category: '电影',
    description: `需要完整版本的《星际穿越》4K HDR REMUX，具体要求如下：

1. 视频要求：
   - 格式：4K UHD (2160p)
   - HDR：支持HDR10或Dolby Vision
   - 编码：保持原盘REMUX，不要压制版本
   
2. 音轨要求：
   - 至少包含DTS-HD MA 5.1或更高规格
   - 保留原始无损音轨
   
3. 字幕要求：
   - 中英双语字幕
   - PGS格式优先
   
4. 其他说明：
   - 文件完整性必须通过校验
   - 提供MediaInfo截图
   
感谢各位大佬的帮助！悬赏丰厚，请放心认领。`,
    requester: 'MovieLover',
    requesterLevel: 'VIP',
    createdAt: '2025-12-06 10:30',
    deadline: '2025-12-13 10:30',
    baseBounty: 5000,
    additionalBounty: 2000,
    totalBounty: 7000,
    claimedBy: null,
    viewsCount: 328,
    commentsCount: 12,
    votesCount: 28,
    attachments: [
      'interstellar_poster.jpg',
      'requirement_screenshot.png',
    ],
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      author: 'TechGuru',
      content: '这个要求很明确，我手上有这个资源，准备认领',
      createdAt: '2025-12-06 11:00',
    },
    {
      id: '2',
      author: 'ResourceHunter',
      content: '请问对码率有要求吗？',
      createdAt: '2025-12-06 12:30',
    },
    {
      id: '3',
      author: 'MovieLover',
      content: '@ResourceHunter 码率只要是原盘REMUX就行，不用特别高',
      createdAt: '2025-12-06 13:00',
    },
  ];

  const mockTimeline: TimelineEvent[] = [
    {
      id: '1',
      type: 'created',
      user: 'MovieLover',
      description: '发布了求种需求',
      timestamp: '2025-12-06 10:30',
    },
    {
      id: '2',
      type: 'bounty_added',
      user: 'AnotherUser',
      description: '追加了 2000 积分悬赏',
      timestamp: '2025-12-06 14:00',
    },
  ];

  const getStatusConfig = () => {
    switch (requestStatus) {
      case 'active':
        return { color: 'amber', text: '等待认领', icon: Clock };
      case 'claimed':
        return { color: 'blue', text: '已认领', icon: User };
      case 'submitted':
        return { color: 'purple', text: '待验收', icon: Upload };
      case 'completed':
        return { color: 'green', text: '已完成', icon: CheckCircle2 };
      case 'disputed':
        return { color: 'red', text: '争议中', icon: AlertTriangle };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const renderActionButtons = () => {
    // 路人访客
    if (userRole === 'visitor') {
      if (requestStatus === 'active') {
        return (
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              立即认领
            </button>
            <button className="px-6 py-3 bg-linear-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all flex items-center gap-2">
              <Award className="w-5 h-5" />
              追加悬赏
            </button>
          </div>
        );
      }
      return (
        <button className="w-full py-3 bg-linear-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all flex items-center justify-center gap-2">
          <Award className="w-5 h-5" />
          追加悬赏
        </button>
      );
    }

    // 发布者（甲方）
    if (userRole === 'requester') {
      if (requestStatus === 'submitted') {
        return (
          <div className="space-y-3">
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-center text-green-300">
              有新的资源提交等待您验收
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                通过验收
              </button>
              <button 
                onClick={() => setShowRejectModal(true)}
                className="flex-1 py-3 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                拒绝验收
              </button>
            </div>
          </div>
        );
      }
      if (requestStatus === 'active' || requestStatus === 'claimed') {
        return (
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-linear-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all flex items-center justify-center gap-2">
              <Award className="w-5 h-5" />
              追加悬赏
            </button>
            <button className="px-6 py-3 bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              取消求种
            </button>
          </div>
        );
      }
    }

    // 认领者（乙方）
    if (userRole === 'responder') {
      if (requestStatus === 'claimed') {
        return (
          <div className="space-y-3">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg p-4 text-center text-amber-300">
              您已认领此任务，请在截止时间前提交资源
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubmitModal(true)}
                className="flex-1 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                提交资源
              </button>
              <button className="px-6 py-3 bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                放弃任务
              </button>
            </div>
          </div>
        );
      }
      if (requestStatus === 'submitted') {
        return (
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 text-center text-blue-300">
            您已提交资源，等待需求方验收中...
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-linear-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-sm">
                  {requestData.category}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                  statusConfig.color === 'amber' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400' :
                  statusConfig.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' :
                  statusConfig.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' :
                  statusConfig.color === 'green' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                  'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig.text}
                </span>
              </div>
              <h1 className="text-amber-50 mb-3">{requestData.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-amber-300/60">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {requestData.requester}
                  {requestData.requesterLevel && (
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 text-xs">
                      {requestData.requesterLevel}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {requestData.createdAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {requestData.viewsCount} 浏览
                </span>
              </div>
            </div>
          </div>

          {/* Bounty Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg p-4">
              <div className="text-amber-400/70 text-sm mb-1">总悬赏</div>
              <div className="text-amber-50 text-xl mb-1">{requestData.totalBounty.toLocaleString()} 积分</div>
              {requestData.additionalBounty > 0 && (
                <div className="text-xs text-orange-400">
                  含追加 {requestData.additionalBounty.toLocaleString()}
                </div>
              )}
            </div>

            <div className="bg-linear-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
              <div className="text-amber-400/70 text-sm mb-1">截止时间</div>
              <div className="text-amber-50">{requestData.deadline}</div>
              <div className="text-xs text-amber-400 mt-1">
                剩余 6天 23小时
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
              <div className="text-amber-400/70 text-sm mb-1">互动</div>
              <div className="flex items-center gap-4 text-sm text-amber-300">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {requestData.commentsCount}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {requestData.votesCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6">
          {renderActionButtons()}
        </div>

        {/* Description */}
        <div className="bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-amber-50 mb-4">详细描述</h3>
          <div className="text-amber-200/70 whitespace-pre-wrap leading-relaxed">
            {requestData.description}
          </div>

          {/* Attachments */}
          {requestData.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-amber-500/20">
              <div className="text-amber-400/70 mb-3">参考附件</div>
              <div className="flex flex-wrap gap-2">
                {requestData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-300 text-sm hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    📎 {file}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-amber-50 mb-4">时间线</h3>
          <div className="space-y-4">
            {mockTimeline.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center ${
                    index === 0 ? 'ring-4 ring-amber-500/20' : ''
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  {index < mockTimeline.length - 1 && (
                    <div className="w-0.5 h-full bg-amber-500/20 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="text-amber-50 mb-1">{event.description}</div>
                  <div className="text-sm text-amber-300/60">
                    {event.user} · {event.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-amber-50 mb-4">评论讨论 ({mockComments.length})</h3>
          
          {/* Comment Input */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="发表您的看法或提问..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
            <div className="flex justify-end mt-2">
              <button className="px-6 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all">
                发表评论
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="bg-[#0F171E]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                    {comment.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-300">{comment.author}</span>
                      <span className="text-amber-400/40 text-sm">{comment.createdAt}</span>
                    </div>
                    <p className="text-amber-200/70">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals would go here - simplified for this example */}
    </div>
  );
}