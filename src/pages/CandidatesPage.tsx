import { useState } from 'react';
import {
  Vote,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageCircle,
  Plus,
  Filter,
  Calendar,
  Users,
  AlertTriangle,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Candidate {
  id: string;
  title: string;
  type: string;
  year: string;
  poster: string;
  category: string;
  quality: string;
  description: string;
  mediainfo: string;
  submittedBy: string;
  submittedAt: string;
  status: 'voting' | 'approved' | 'rejected';
  votesUp: number;
  votesDown: number;
  views: number;
  comments: number;
  deadline: string;
  reason?: string;
}

export function CandidatesPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'voting' | 'approved' | 'rejected'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userVotes, setUserVotes] = useState<{ [key: string]: 'up' | 'down' }>({});

  // 模拟数据
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      title: '沙丘2',
      type: 'Dune: Part Two',
      year: '2024',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HEVC',
      description: '《沙丘2》是丹尼斯·维伦纽瓦执导的史诗科幻巨制，改编自弗兰克·赫伯特的同名小说。影片延续前作故事，讲述保罗·厄崔迪与弗雷曼人联手对抗哈克南家族的复仇之旅。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps\nAudio: DTS-HD MA 7.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'MovieFan2024',
      submittedAt: '2024-12-08 10:30',
      status: 'voting',
      votesUp: 45,
      votesDown: 3,
      views: 128,
      comments: 12,
      deadline: '2024-12-09 10:30',
    },
    {
      id: '2',
      title: '奥本海默',
      type: 'Oppenheimer',
      year: '2023',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
      category: '剧情',
      quality: '4K UHD BluRay REMUX',
      description: '克里斯托弗·诺兰执导的传记片，讲述"原子弹之父"罗伯特·奥本海默的传奇一生。',
      mediainfo: 'Video: AVC 3840x2160 23.976fps\nAudio: DTS-HD MA 5.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'NolanFan',
      submittedAt: '2024-12-07 15:20',
      status: 'approved',
      votesUp: 89,
      votesDown: 2,
      views: 256,
      comments: 34,
      deadline: '2024-12-08 15:20',
    },
    {
      id: '3',
      title: '蜘蛛侠：英雄无归',
      type: 'Spider-Man: No Way Home',
      year: '2021',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
      category: '动作',
      quality: '1080p WEB-DL',
      description: '漫威宇宙蜘蛛侠系列第三部，三代蜘蛛侠同框...',
      mediainfo: 'Video: H.264 1920x1080 23.976fps\nAudio: AAC 5.1 48kHz',
      submittedBy: 'SpideyFan',
      submittedAt: '2024-12-06 20:15',
      status: 'rejected',
      votesUp: 12,
      votesDown: 28,
      views: 89,
      comments: 8,
      deadline: '2024-12-07 20:15',
      reason: '已存在更高质量版本',
    },
    {
      id: '4',
      title: '瞬息全宇宙',
      type: 'Everything Everywhere All at Once',
      year: '2022',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HDR',
      description: '获得奥斯卡最佳影片的科幻喜剧片，讲述华裔女性在多元宇宙中的冒险故事。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps HDR10\nAudio: Atmos 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'CinemaLover',
      submittedAt: '2024-12-08 14:00',
      status: 'voting',
      votesUp: 67,
      votesDown: 5,
      views: 145,
      comments: 18,
      deadline: '2024-12-09 14:00',
    },
  ];

  const filteredCandidates = mockCandidates.filter((candidate) => {
    if (selectedTab === 'all') return true;
    return candidate.status === selectedTab;
  });

  const handleVote = (candidateId: string, voteType: 'up' | 'down') => {
    setUserVotes((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === voteType ? undefined : voteType,
    }));
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return '已截止';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 24) {
      return `${Math.floor(hours / 24)}天${hours % 24}小时`;
    }
    return `${hours}小时${minutes}分钟`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'voting':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            投票中
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            已通过
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            已驳回
          </Badge>
        );
      default:
        return null;
    }
  };

  const getVotePercentage = (candidate: Candidate) => {
    const total = candidate.votesUp + candidate.votesDown;
    if (total === 0) return 0;
    return Math.round((candidate.votesUp / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">候选资源</h1>
              <p className="text-neutral-400 text-sm mt-1">
                社区投票决定资源上传，确保内容质量
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30"
          >
            <Plus className="w-4 h-4" />
            提交候选
          </button>
        </div>

        {/* 说明卡片 */}
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400 mb-2">候选机制说明</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-neutral-300 text-sm">
                <div>
                  <p className="text-amber-400/80 mb-1">📝 提交候选</p>
                  <p className="text-xs text-neutral-400">发布资源预告，包含详细信息和截图</p>
                </div>
                <div>
                  <p className="text-amber-400/80 mb-1">🗳️ 社区投票</p>
                  <p className="text-xs text-neutral-400">24小时内，用户投票支持或反对</p>
                </div>
                <div>
                  <p className="text-amber-400/80 mb-1">✅ 自动审核</p>
                  <p className="text-xs text-neutral-400">支持率{'>'} 70% 自动通过，获得上传权限</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="mb-6 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
              }`}
          >
            <Filter className="w-4 h-4" />
            全部 ({mockCandidates.length})
          </button>
          <button
            onClick={() => setSelectedTab('voting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'voting'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
              }`}
          >
            <Clock className="w-4 h-4" />
            投票中 ({mockCandidates.filter((c) => c.status === 'voting').length})
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'approved'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            已通过 ({mockCandidates.filter((c) => c.status === 'approved').length})
          </button>
          <button
            onClick={() => setSelectedTab('rejected')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'rejected'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
              }`}
          >
            <XCircle className="w-4 h-4" />
            已驳回 ({mockCandidates.filter((c) => c.status === 'rejected').length})
          </button>
        </div>

        {/* 候选列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => {
            const votePercentage = getVotePercentage(candidate);
            const userVote = userVotes[candidate.id];

            return (
              <div
                key={candidate.id}
                className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/30 transition-all group"
              >
                {/* 海报 */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={candidate.poster}
                    alt={candidate.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(candidate.status)}
                  </div>
                  {candidate.status === 'voting' && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeRemaining(candidate.deadline)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge className="bg-neutral-900/70 text-amber-400 text-xs">
                      {candidate.quality}
                    </Badge>
                  </div>
                </div>

                {/* 信息 */}
                <div className="p-4">
                  <h3 className="text-white mb-1 line-clamp-1">{candidate.title}</h3>
                  <p className="text-neutral-400 text-sm mb-3 line-clamp-1">
                    {candidate.type} ({candidate.year})
                  </p>

                  {/* 投票进度条 */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                      <span>支持率</span>
                      <span className={`${votePercentage >= 70 ? 'text-green-400' : 'text-amber-400'}`}>
                        {votePercentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${votePercentage >= 70
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600'
                          }`}
                        style={{ width: `${votePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 投票按钮 */}
                  {candidate.status === 'voting' && (
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => handleVote(candidate.id, 'up')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${userVote === 'up'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                            : 'bg-neutral-700/50 text-neutral-400 hover:bg-green-500/20 hover:text-green-400'
                          }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{candidate.votesUp}</span>
                      </button>
                      <button
                        onClick={() => handleVote(candidate.id, 'down')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${userVote === 'down'
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                            : 'bg-neutral-700/50 text-neutral-400 hover:bg-red-500/20 hover:text-red-400'
                          }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">{candidate.votesDown}</span>
                      </button>
                    </div>
                  )}

                  {candidate.status === 'rejected' && candidate.reason && (
                    <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {candidate.reason}
                      </p>
                    </div>
                  )}

                  {candidate.status === 'approved' && (
                    <div className="mb-3">
                      <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30">
                        <Upload className="w-4 h-4" />
                        立即上传
                      </button>
                    </div>
                  )}

                  <Separator className="bg-neutral-700/50 my-3" />

                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {candidate.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {candidate.comments}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-16">
            <Vote className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">暂无候选资源</p>
          </div>
        )}
      </div>

      {/* 候选详情模态框 */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* 头部 */}
            <div className="sticky top-0 bg-gradient-to-br from-neutral-800 to-stone-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white text-2xl mb-1">{selectedCandidate.title}</h2>
                <p className="text-neutral-400 text-sm">
                  {selectedCandidate.type} ({selectedCandidate.year})
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 状态和投票 */}
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedCandidate.status)}
                {selectedCandidate.status === 'voting' && (
                  <div className="text-right">
                    <p className="text-neutral-400 text-xs mb-1">剩余时间</p>
                    <p className="text-amber-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getTimeRemaining(selectedCandidate.deadline)}
                    </p>
                  </div>
                )}
              </div>

              {/* 海报和基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <img
                    src={selectedCandidate.poster}
                    alt={selectedCandidate.title}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-amber-400 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      资源描述
                    </h3>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      {selectedCandidate.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-amber-400 mb-2">基本信息</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-neutral-400">分类：</span>
                        <span className="text-white">{selectedCandidate.category}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">质量：</span>
                        <span className="text-white">{selectedCandidate.quality}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">提交者：</span>
                        <span className="text-white">{selectedCandidate.submittedBy}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">提交时间：</span>
                        <span className="text-white">{selectedCandidate.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* 投票统计 */}
                  <div>
                    <h3 className="text-amber-400 mb-2">投票统计</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <ThumbsUp className="w-4 h-4 text-green-400" />
                          <span className="text-neutral-400 text-sm">支持</span>
                        </div>
                        <span className="text-white">{selectedCandidate.votesUp}</span>
                        <div className="w-32 h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            style={{
                              width: `${(selectedCandidate.votesUp / (selectedCandidate.votesUp + selectedCandidate.votesDown)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <ThumbsDown className="w-4 h-4 text-red-400" />
                          <span className="text-neutral-400 text-sm">反对</span>
                        </div>
                        <span className="text-white">{selectedCandidate.votesDown}</span>
                        <div className="w-32 h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-rose-600"
                            style={{
                              width: `${(selectedCandidate.votesDown / (selectedCandidate.votesUp + selectedCandidate.votesDown)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MediaInfo */}
              <div>
                <h3 className="text-amber-400 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  MediaInfo
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-400">
                  <pre className="whitespace-pre-wrap">{selectedCandidate.mediainfo}</pre>
                </div>
              </div>

              {/* 投票按钮 */}
              {selectedCandidate.status === 'voting' && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(selectedCandidate.id, 'up')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${userVotes[selectedCandidate.id] === 'up'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-neutral-700/50 text-neutral-300 hover:bg-green-500/20 hover:text-green-400 border border-neutral-600'
                      }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    支持上传
                  </button>
                  <button
                    onClick={() => handleVote(selectedCandidate.id, 'down')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${userVotes[selectedCandidate.id] === 'down'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-neutral-700/50 text-neutral-300 hover:bg-red-500/20 hover:text-red-400 border border-neutral-600'
                      }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    反对上传
                  </button>
                </div>
              )}

              {selectedCandidate.status === 'approved' && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white transition-all shadow-lg shadow-green-500/30">
                  <Upload className="w-5 h-5" />
                  获取上传链接
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 创建候选模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-br from-neutral-800 to-stone-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-white text-2xl">提交候选资源</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">资源标题</label>
                <input
                  type="text"
                  placeholder="请输入中文标题"
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-sm mb-2 block">英文标题</label>
                <input
                  type="text"
                  placeholder="请输入英文标题"
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-sm mb-2 block">年份</label>
                  <input
                    type="text"
                    placeholder="2024"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-sm mb-2 block">分类</label>
                  <select className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500">
                    <option>动作</option>
                    <option>科幻</option>
                    <option>剧情</option>
                    <option>喜剧</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-sm mb-2 block">质量参数</label>
                <input
                  type="text"
                  placeholder="4K UHD BluRay HEVC"
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-sm mb-2 block">资源描述</label>
                <textarea
                  rows={4}
                  placeholder="请详细描述资源内容..."
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-sm mb-2 block">MediaInfo</label>
                <textarea
                  rows={6}
                  placeholder="请粘贴MediaInfo信息..."
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 resize-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-sm mb-2 block">海报URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                  <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors"
                >
                  取消
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30">
                  提交候选
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
