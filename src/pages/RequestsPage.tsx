import { useState } from 'react';
import {
  Search as SearchIcon,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Calendar,
  User,
  MessageCircle,
  TrendingUp,
  Award,
  ChevronDown,
  Film,
  Tv,
  Music,
  Book,
  Package,
  Send,
  ThumbsUp,
  Star,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RequestComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isUploader?: boolean;
}

interface Request {
  id: string;
  title: string;
  description: string;
  category: 'movie' | 'tv' | 'music' | 'book' | 'other';
  author: string;
  createdAt: string;
  status: 'pending' | 'filled' | 'expired';
  bounty: number;
  votes: number;
  comments: RequestComment[];
  filledBy?: string;
  filledAt?: string;
}

export function RequestsPage() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'bounty' | 'votes'>('latest');

  // 新求种表单
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestCategory, setNewRequestCategory] = useState('movie');
  const [newRequestDescription, setNewRequestDescription] = useState('');
  const [newRequestBounty, setNewRequestBounty] = useState('100');

  const [newComment, setNewComment] = useState('');

  const requests: Request[] = [
    {
      id: 'REQ-001',
      title: '求《沙丘：第三部》4K UHD版本',
      description:
        '寻找《沙丘：第三部》的4K UHD版本，最好是REMUX或者高码率的，希望有中英双字幕。如果有杜比视界版本更好。愿意出500魔力值作为奖励。',
      category: 'movie',
      author: 'MovieFan2024',
      createdAt: '2024-11-26 10:30',
      status: 'pending',
      bounty: 500,
      votes: 23,
      comments: [
        {
          id: '1',
          author: 'Helper1',
          content: '电影还没上映吧？',
          timestamp: '2024-11-26 11:00',
        },
        {
          id: '2',
          author: 'MovieFan2024',
          content: '抱歉打错了，是《沙丘2》',
          timestamp: '2024-11-26 11:15',
        },
      ],
    },
    {
      id: 'REQ-002',
      title: '求 Taylor Swift - The Eras Tour 演唱会',
      description:
        '寻找Taylor Swift最新的The Eras Tour演唱会完整版，最好是1080p或以上画质，希望有多个城市的版本。音频质量要好，FLAC更佳。',
      category: 'music',
      author: 'SwiftFan',
      createdAt: '2024-11-25 15:20',
      status: 'filled',
      bounty: 300,
      votes: 45,
      filledBy: 'MusicUploader',
      filledAt: '2024-11-25 18:30',
      comments: [
        {
          id: '1',
          author: 'MusicUploader',
          content: '我有资源，正在制作中，稍后上传。',
          timestamp: '2024-11-25 16:00',
          isUploader: true,
        },
        {
          id: '2',
          author: 'MusicUploader',
          content: '已上传，种子ID #45678，请查收！',
          timestamp: '2024-11-25 18:30',
          isUploader: true,
        },
        {
          id: '3',
          author: 'SwiftFan',
          content: '太棒了！非常感谢！',
          timestamp: '2024-11-25 19:00',
        },
      ],
    },
    {
      id: 'REQ-003',
      title: '求《三体》电视剧完整版',
      description:
        '寻找腾讯版《三体》电视剧全30集，要求4K HDR版本，最好是WEB-DL格式，带中文字幕。如果有幕后花絮更好。',
      category: 'tv',
      author: 'SciFiLover',
      createdAt: '2024-11-26 09:00',
      status: 'pending',
      bounty: 400,
      votes: 67,
      comments: [
        {
          id: '1',
          author: 'TVCollector',
          content: '我可以制作，但需要几天时间。',
          timestamp: '2024-11-26 10:00',
        },
        {
          id: '2',
          author: 'SciFiLover',
          content: '没问题，等你好消息！',
          timestamp: '2024-11-26 10:30',
        },
      ],
    },
    {
      id: 'REQ-004',
      title: '求村上春树全集 EPUB格式',
      description:
        '寻找村上春树的所有作品，EPUB或MOBI格式，最好是简体中文版，质量要好，排版清晰。如果有英文原版也可以。',
      category: 'book',
      author: 'BookWorm',
      createdAt: '2024-11-24 14:00',
      status: 'pending',
      bounty: 200,
      votes: 34,
      comments: [
        {
          id: '1',
          author: 'Reader123',
          content: '我有一部分，但不全。',
          timestamp: '2024-11-24 15:00',
        },
      ],
    },
    {
      id: 'REQ-005',
      title: '求《怪奇物语》第五季',
      description: '第五季什么时候能有资源？有预告片也可以分享一下。',
      category: 'tv',
      author: 'Stranger',
      createdAt: '2024-11-23 10:00',
      status: 'expired',
      bounty: 150,
      votes: 12,
      comments: [
        {
          id: '1',
          author: 'Helper2',
          content: '第五季还没播出呢，2025年才上映。',
          timestamp: '2024-11-23 11:00',
        },
      ],
    },
    {
      id: 'REQ-006',
      title: '求《指环王》20周年纪念版 4K',
      description:
        '寻找《指环王》三部曲的20周年纪念版4K UHD，要加长版的，最好是REMUX格式，带全部音轨和字幕。愿意出高额奖励。',
      category: 'movie',
      author: 'TolkienFan',
      createdAt: '2024-11-26 08:00',
      status: 'pending',
      bounty: 1000,
      votes: 89,
      comments: [
        {
          id: '1',
          author: 'FilmCollector',
          content: '这个资源很大，大概300GB+，我可以做种。',
          timestamp: '2024-11-26 09:00',
          isUploader: true,
        },
        {
          id: '2',
          author: 'TolkienFan',
          content: '没问题，我有足够的空间！',
          timestamp: '2024-11-26 09:30',
        },
      ],
    },
    {
      id: 'REQ-007',
      title: '求Pink Floyd演唱会合集',
      description:
        '寻找Pink Floyd的所有演唱会录像，包括The Wall Live、Pulse等，最好是蓝光版本，音频要FLAC或DTS-HD。',
      category: 'music',
      author: 'RockFan',
      createdAt: '2024-11-25 12:00',
      status: 'pending',
      bounty: 600,
      votes: 41,
      comments: [],
    },
    {
      id: 'REQ-008',
      title: '求BBC纪录片《地球脉动III》',
      description:
        '寻找BBC最新的《地球脉动III》纪录片，4K HDR版本，要有David Attenborough的原声解说，中英双字幕。',
      category: 'other',
      author: 'NatureLover',
      createdAt: '2024-11-26 07:00',
      status: 'filled',
      bounty: 350,
      votes: 56,
      filledBy: 'DocuMaker',
      filledAt: '2024-11-26 12:00',
      comments: [
        {
          id: '1',
          author: 'DocuMaker',
          content: '已上传，种子ID #45680',
          timestamp: '2024-11-26 12:00',
          isUploader: true,
        },
      ],
    },
  ];

  const categoryConfig = {
    movie: {
      label: '电影',
      icon: <Film className="w-4 h-4" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    tv: {
      label: '剧集',
      icon: <Tv className="w-4 h-4" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    music: {
      label: '音乐',
      icon: <Music className="w-4 h-4" />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
    },
    book: {
      label: '书籍',
      icon: <Book className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    other: {
      label: '其他',
      icon: <Package className="w-4 h-4" />,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-500/20',
    },
  };

  const statusConfig = {
    pending: {
      label: '求种中',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    filled: {
      label: '已完成',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    expired: {
      label: '已过期',
      icon: <XCircle className="w-4 h-4" />,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-500/20',
    },
  };

  const filteredRequests = requests
    .filter((request) => {
      if (filterStatus !== 'all' && request.status !== filterStatus)
        return false;
      if (filterCategory !== 'all' && request.category !== filterCategory)
        return false;
      if (
        searchQuery &&
        !request.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'bounty':
          return b.bounty - a.bounty;
        case 'votes':
          return b.votes - a.votes;
        case 'latest':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

  const handleCreateRequest = () => {
    console.log('创建求种:', {
      title: newRequestTitle,
      category: newRequestCategory,
      description: newRequestDescription,
      bounty: newRequestBounty,
    });
    setNewRequestTitle('');
    setNewRequestCategory('movie');
    setNewRequestDescription('');
    setNewRequestBounty('100');
    setView('list');
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedRequest) return;
    console.log('发送评论:', newComment);
    setNewComment('');
  };

  // 创建求种视图
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">发布求种</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  详细描述您需要的资源，其他用户会帮助您
                </p>
              </div>
            </div>
            <Button
              onClick={() => setView('list')}
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            >
              返回列表
            </Button>
          </div>

          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-8">
            <div className="space-y-6">
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  求种标题 <span className="text-red-400">*</span>
                </label>
                <Input
                  value={newRequestTitle}
                  onChange={(e) => setNewRequestTitle(e.target.value)}
                  placeholder="简要描述您需要的资源"
                  className="bg-neutral-900/50 border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    资源分类 <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={newRequestCategory}
                    onValueChange={setNewRequestCategory}
                  >
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    悬赏魔力值
                  </label>
                  <Input
                    type="number"
                    value={newRequestBounty}
                    onChange={(e) => setNewRequestBounty(e.target.value)}
                    placeholder="100"
                    className="bg-neutral-900/50 border-neutral-700 text-white"
                  />
                  <p className="text-neutral-500 text-xs mt-1">
                    悬赏越高，越容易得到响应
                  </p>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  详细描述 <span className="text-red-400">*</span>
                </label>
                <Textarea
                  value={newRequestDescription}
                  onChange={(e) => setNewRequestDescription(e.target.value)}
                  placeholder="请详细描述您需要的资源，包括格式、质量要求、字幕语言等..."
                  className="bg-neutral-900/50 border-neutral-700 text-white min-h-[200px]"
                />
                <p className="text-neutral-500 text-xs mt-2">
                  提供越详细的信息，越容易获得准确的资源
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-amber-400 mb-1">求种须知</p>
                    <ul className="text-neutral-400 space-y-1 text-xs">
                      <li>• 求种前请先搜索站内是否已有相关资源</li>
                      <li>• 悬赏的魔力值将在求种成功后自动转给提供者</li>
                      <li>• 禁止求种违规内容，违者将被处罚</li>
                      <li>• 30天内无人响应的求种将自动过期</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  onClick={() => setView('list')}
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  取消
                </Button>
                <Button
                  onClick={handleCreateRequest}
                  disabled={!newRequestTitle || !newRequestDescription}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  发布求种
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 求种详情视图
  if (view === 'detail' && selectedRequest) {
    const categoryInfo = categoryConfig[selectedRequest.category];
    const statusInfo = statusConfig[selectedRequest.status];

    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <SearchIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">{selectedRequest.id}</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  {selectedRequest.title}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setView('list');
                setSelectedRequest(null);
              }}
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            >
              返回列表
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 求种信息 */}
              <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge className={`${categoryInfo.bgColor} ${categoryInfo.color}`}>
                    {categoryInfo.icon}
                    <span className="ml-1">{categoryInfo.label}</span>
                  </Badge>
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.label}</span>
                  </Badge>
                  <Badge className="bg-amber-500/20 text-amber-400">
                    <Gift className="w-3 h-3 mr-1" />
                    悬赏 {selectedRequest.bounty} 魔力值
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {selectedRequest.votes} 投票
                  </Badge>
                </div>

                <Separator className="bg-neutral-700/50 mb-4" />

                <div className="mb-4">
                  <h3 className="text-white mb-2">需求描述</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {selectedRequest.description}
                  </p>
                </div>

                {selectedRequest.status === 'filled' && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>求种已完成</span>
                    </div>
                    <p className="text-neutral-400 text-sm">
                      由 <span className="text-green-400">{selectedRequest.filledBy}</span> 提供
                      于 {selectedRequest.filledAt}
                    </p>
                  </div>
                )}
              </div>

              {/* 评论区 */}
              <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                <h3 className="text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  评论 ({selectedRequest.comments.length})
                </h3>

                <div className="space-y-4 mb-6">
                  {selectedRequest.comments.length === 0 ? (
                    <p className="text-neutral-500 text-center py-8">
                      暂无评论
                    </p>
                  ) : (
                    selectedRequest.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-neutral-500" />
                          <span
                            className={
                              comment.isUploader
                                ? 'text-amber-400'
                                : 'text-neutral-300'
                            }
                          >
                            {comment.author}
                          </span>
                          {comment.isUploader && (
                            <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                              上传者
                            </Badge>
                          )}
                          <span className="text-neutral-500 text-xs ml-auto">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-neutral-300">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {selectedRequest.status !== 'expired' && (
                  <>
                    <Separator className="bg-neutral-700/50 mb-4" />
                    <div>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="输入您的评论或提供资源链接..."
                        className="bg-neutral-900/50 border-neutral-700 text-white min-h-[100px] mb-4"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSendComment}
                          disabled={!newComment.trim()}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          发送评论
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 右侧信息栏 */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                <h3 className="text-white mb-4">求种信息</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">编号</div>
                    <div className="text-white">{selectedRequest.id}</div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">发起人</div>
                    <div className="text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-500" />
                      {selectedRequest.author}
                    </div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">发布时间</div>
                    <div className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      {selectedRequest.createdAt}
                    </div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">悬赏</div>
                    <div className="text-amber-400 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {selectedRequest.bounty} 魔力值
                    </div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">支持</div>
                    <div className="text-white flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-neutral-500" />
                      {selectedRequest.votes} 人投票
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                  <h3 className="text-white mb-4">操作</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                      <Star className="w-4 h-4 mr-2" />
                      投票支持
                    </Button>
                    <Button
                      className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      variant="outline"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      我有资源
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 求种列表视图
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <SearchIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">求种专区</h1>
              <p className="text-neutral-400 text-sm mt-1">
                发布您的资源需求，让社区帮助您
              </p>
            </div>
          </div>
          <Button
            onClick={() => setView('create')}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            发布求种
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = requests.filter((r) => r.status === key).length;
            return (
              <div
                key={key}
                className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`${config.color}`}>{config.label}</span>
                  {config.icon}
                </div>
                <div className="text-white text-3xl">{count}</div>
              </div>
            );
          })}
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索求种..."
                className="bg-neutral-900/50 border-neutral-700 text-white pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="筛选分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">最新发布</SelectItem>
                <SelectItem value="bounty">悬赏最高</SelectItem>
                <SelectItem value="votes">最多投票</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 求种列表 */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-12 text-center">
              <SearchIcon className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400">暂无求种</p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const categoryInfo = categoryConfig[request.category];
              const statusInfo = statusConfig[request.status];

              return (
                <div
                  key={request.id}
                  onClick={() => {
                    setSelectedRequest(request);
                    setView('detail');
                  }}
                  className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:border-amber-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-white group-hover:text-amber-400 transition-colors">
                          {request.title}
                        </h3>
                        <Badge className="bg-neutral-700/50 text-neutral-300 text-xs">
                          {request.id}
                        </Badge>
                      </div>
                      <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                        {request.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          className={`${categoryInfo.bgColor} ${categoryInfo.color} text-xs`}
                        >
                          {categoryInfo.icon}
                          <span className="ml-1">{categoryInfo.label}</span>
                        </Badge>
                        <Badge
                          className={`${statusInfo.bgColor} ${statusInfo.color} text-xs`}
                        >
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.label}</span>
                        </Badge>
                        <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                          <Gift className="w-3 h-3 mr-1" />
                          {request.bounty}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {request.votes}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-neutral-500 text-sm">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {request.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {request.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {request.comments.length} 评论
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
