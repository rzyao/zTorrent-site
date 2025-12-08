import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, MessageSquare, FileText, Image, Clock } from 'lucide-react';

interface DisputeCase {
  id: string;
  requestId: string;
  requestTitle: string;
  category: string;
  bounty: number;
  requester: string;
  responder: string;
  claimedAt: string;
  submittedAt: string;
  rejectedAt: string;
  disputeCreatedAt: string;
  requesterStatement: string;
  responderStatement: string;
  submittedResource: string;
  chatHistory: string[];
  evidence: {
    type: 'image' | 'file' | 'text';
    content: string;
    uploader: 'requester' | 'responder';
  }[];
  priority: 'low' | 'medium' | 'high';
}

const mockDisputes: DisputeCase[] = [
  {
    id: 'dispute-1',
    requestId: 'req-5',
    requestTitle: '求Taylor Swift最新演唱会蓝光版',
    category: '音乐',
    bounty: 2500,
    requester: 'MusicLover',
    responder: 'ResourceHunter',
    claimedAt: '2025-11-25 15:30',
    submittedAt: '2025-12-01 20:00',
    rejectedAt: '2025-12-02 10:30',
    disputeCreatedAt: '2025-12-02 14:00',
    requesterStatement: '提交的资源音质不达标，有明显的压缩痕迹，不是蓝光原盘的无损音轨。我要求的是完整的蓝光版本，应该是LPCM或DTS-HD MA音轨。',
    responderStatement: '我提供的资源是从蓝光原盘提取的，音频格式为DTS-HD MA 5.1，完全符合蓝光标准。我已经提供了MediaInfo截图作为证据，证明音轨是无损的。需求方可能对音频格式理解有误。',
    submittedResource: 'Taylor.Swift.The.Eras.Tour.2023.1080p.BluRay.Remux.mkv (45.6 GB)',
    chatHistory: [
      '需求方: 请问能提供MediaInfo信息吗？',
      '应答方: 好的，我会在提交时一并提供',
      '需求方: 收到资源了，但是音质感觉不对',
      '应答方: 这是原盘提取的，应该没问题',
    ],
    evidence: [
      { type: 'image', content: 'MediaInfo截图显示DTS-HD MA 5.1', uploader: 'responder' },
      { type: 'text', content: '音频采样率48kHz，比特率3850kbps', uploader: 'responder' },
      { type: 'file', content: '对比音频分析报告', uploader: 'requester' },
    ],
    priority: 'high',
  },
  {
    id: 'dispute-2',
    requestId: 'req-8',
    requestTitle: '求《奥本海默》IMAX版本',
    category: '电影',
    bounty: 12000,
    requester: 'IMAXFan',
    responder: 'MovieMaster',
    claimedAt: '2025-11-28 10:00',
    submittedAt: '2025-12-05 16:00',
    rejectedAt: '2025-12-06 09:00',
    disputeCreatedAt: '2025-12-06 15:30',
    requesterStatement: '提交的不是IMAX Enhanced版本，只是普通的16:9画幅，并没有IMAX的1.43:1或1.90:1画幅部分。这不符合我的要求。',
    responderStatement: '我提供的是目前市面上能找到的最佳版本，IMAX Enhanced版本尚未发布蓝光。需求描述中并未明确要求是Enhanced版本，只说了IMAX版本。',
    submittedResource: 'Oppenheimer.2023.2160p.UHD.BluRay.Remux.mkv (78.2 GB)',
    chatHistory: [
      '需求方: 一定要IMAX画幅的版本',
      '应答方: 明白，我会尽力找',
      '应答方: 资源已提交，请查收',
      '需求方: 这个画幅不对啊',
    ],
    evidence: [
      { type: 'text', content: '原始需求描述截图', uploader: 'responder' },
      { type: 'image', content: '画幅对比截图', uploader: 'requester' },
    ],
    priority: 'high',
  },
  {
    id: 'dispute-3',
    requestId: 'req-12',
    requestTitle: '求某冷门纪录片',
    category: '纪录片',
    bounty: 1500,
    requester: 'DocuFan',
    responder: 'Archivist',
    claimedAt: '2025-12-01 08:00',
    submittedAt: '2025-12-04 12:00',
    rejectedAt: '2025-12-05 10:00',
    disputeCreatedAt: '2025-12-05 14:00',
    requesterStatement: '字幕文件损坏，无法正常显示',
    responderStatement: '我这边测试正常，可能是播放器兼容性问题',
    submittedResource: 'Documentary.2023.1080p.WEB-DL.mkv (8.5 GB)',
    chatHistory: [],
    evidence: [
      { type: 'image', content: '字幕显示异常截图', uploader: 'requester' },
    ],
    priority: 'medium',
  },
];

export function ModerationCenter() {
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredDisputes = mockDisputes.filter(
    dispute => priorityFilter === 'all' || dispute.priority === priorityFilter
  );

  const getPriorityConfig = (priority: DisputeCase['priority']) => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: '高优先级' };
      case 'medium':
        return { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', label: '中优先级' };
      case 'low':
        return { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: '低优先级' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-purple-300 mb-1">仲裁中心</div>
            <div className="text-purple-200/70 text-sm">
              作为管理员，您需要公正地处理用户之间的争议。请仔细审查双方提供的证据，做出公平的裁决。
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '待处理', value: filteredDisputes.length, color: 'amber' },
          { label: '高优先级', value: mockDisputes.filter(d => d.priority === 'high').length, color: 'red' },
          { label: '本月已处理', value: '23', color: 'green' },
          { label: '平均处理时长', value: '2.5天', color: 'orange' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4"
          >
            <div className="text-amber-400/60 mb-1">{stat.label}</div>
            <div className="text-amber-50">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Priority Filter */}
      <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className={`px-4 py-2 rounded-lg transition-all ${
                priorityFilter === priority
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              {priority === 'all' ? '全部' : priority === 'high' ? '高优先级' : priority === 'medium' ? '中优先级' : '低优先级'}
              <span className="ml-2 text-xs opacity-70">
                ({priority === 'all' ? mockDisputes.length : mockDisputes.filter(d => d.priority === priority).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Disputes Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          <h3 className="text-amber-50">争议队列</h3>
          {filteredDisputes.map((dispute) => {
            const priorityConfig = getPriorityConfig(dispute.priority);
            
            return (
              <div
                key={dispute.id}
                onClick={() => setSelectedCase(dispute)}
                className={`bg-gradient-to-br from-amber-600/5 to-orange-600/5 border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCase?.id === dispute.id
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-amber-500/20 hover:border-amber-400/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-amber-50 flex-1">{dispute.requestTitle}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${priorityConfig.bg} ${priorityConfig.border} border ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                  </div>
                  
                  <div className="text-sm text-amber-300/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400">
                        {dispute.category}
                      </span>
                      <span>{dispute.bounty.toLocaleString()} 积分</span>
                    </div>
                    <div>需求方: {dispute.requester}</div>
                    <div>应答方: {dispute.responder}</div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <Clock className="w-3 h-3" />
                      争议发起于 {dispute.disputeCreatedAt}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:sticky lg:top-24 h-fit">
          {selectedCase ? (
            <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-amber-50 mb-4">案件详情</h3>
                
                {/* Basic Info */}
                <div className="bg-[#0F171E]/50 rounded-lg p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-amber-400/60">求种标题</span>
                    <span className="text-amber-50">{selectedCase.requestTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400/60">悬赏金额</span>
                    <span className="text-amber-50">{selectedCase.bounty.toLocaleString()} 积分</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400/60">提交资源</span>
                    <span className="text-amber-50 text-right">{selectedCase.submittedResource}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-[#0F171E]/50 rounded-lg p-4 mb-4">
                  <div className="text-amber-400/60 mb-2 text-sm">时间线</div>
                  <div className="space-y-2 text-sm text-amber-300/60">
                    <div>认领: {selectedCase.claimedAt}</div>
                    <div>提交: {selectedCase.submittedAt}</div>
                    <div>拒绝: {selectedCase.rejectedAt}</div>
                    <div className="text-purple-400">发起仲裁: {selectedCase.disputeCreatedAt}</div>
                  </div>
                </div>

                {/* Statements */}
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">需求方陈述</span>
                    </div>
                    <p className="text-blue-200/70 text-sm">{selectedCase.requesterStatement}</p>
                  </div>

                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <span className="text-green-300">应答方陈述</span>
                    </div>
                    <p className="text-green-200/70 text-sm">{selectedCase.responderStatement}</p>
                  </div>
                </div>

                {/* Evidence */}
                {selectedCase.evidence.length > 0 && (
                  <div className="bg-[#0F171E]/50 rounded-lg p-4">
                    <div className="text-amber-400/60 mb-3 text-sm">证据材料</div>
                    <div className="space-y-2">
                      {selectedCase.evidence.map((ev, index) => {
                        const Icon = ev.type === 'image' ? Image : ev.type === 'file' ? FileText : MessageSquare;
                        return (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-amber-300/60">{ev.content}</div>
                              <div className="text-amber-400/40 text-xs">
                                上传者: {ev.uploader === 'requester' ? selectedCase.requester : selectedCase.responder}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chat History */}
                {selectedCase.chatHistory.length > 0 && (
                  <div className="bg-[#0F171E]/50 rounded-lg p-4">
                    <div className="text-amber-400/60 mb-3 text-sm">聊天记录</div>
                    <div className="space-y-2">
                      {selectedCase.chatHistory.map((msg, index) => (
                        <div key={index} className="text-sm text-amber-300/60">
                          {msg}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    裁决：通过验收（发放悬赏）
                  </button>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    裁决：拒绝验收（退款）
                  </button>

                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    处罚违规方
                  </button>

                  <button className="w-full py-3 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all">
                    请求更多证据
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-12 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-amber-400/40" />
              <p className="text-amber-300/60">请从左侧选择一个案件查看详情</p>
            </div>
          )}
        </div>
      </div>

      {filteredDisputes.length === 0 && (
        <div className="text-center py-12 text-amber-300/60">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>暂无待处理的争议案件</p>
        </div>
      )}
    </div>
  );
}
