import { useState } from 'react';
import { Rss, Copy, CheckCircle2, RefreshCw, Settings, Download, Eye, Filter, Tag, Award, Clock, Shield } from 'lucide-react';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  description: string;
  createdAt: string;
  itemCount: number;
}

export function RSSPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  const [includeFields, setIncludeFields] = useState({
    title: true,
    description: true,
    category: true,
    size: true,
    seeders: true,
    leechers: true,
    uploader: true,
    uploadDate: true,
    tags: true,
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // 用户的 RSS Token (模拟)
  const userRSSToken = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
  const baseUrl = 'https://pttracker.example.com/rss';

  const categories = [
    { id: 'all', label: '全部分类', icon: '📦' },
    { id: 'movie', label: '电影', icon: '🎬' },
    { id: 'tv', label: '剧集', icon: '📺' },
    { id: 'documentary', label: '纪录片', icon: '🎥' },
    { id: 'music', label: '音乐', icon: '🎵' },
    { id: 'anime', label: '动漫', icon: '🎌' },
    { id: 'variety', label: '综艺', icon: '🎪' },
    { id: 'sports', label: '体育', icon: '⚽' },
  ];

  const tags = [
    { id: 'free', label: 'FREE', color: 'green' },
    { id: 'vip', label: 'VIP', color: 'purple' },
    { id: 'hot', label: 'HOT', color: 'red' },
    { id: '2x', label: '2X', color: 'blue' },
  ];

  const qualities = [
    { id: '4k', label: '4K' },
    { id: '1080p', label: '1080P' },
    { id: '720p', label: '720P' },
    { id: 'remux', label: 'REMUX' },
    { id: 'bluray', label: 'BluRay' },
    { id: 'web-dl', label: 'WEB-DL' },
  ];

  const mockFeeds: RSSFeed[] = [
    {
      id: '1',
      name: '电影 + FREE标签',
      url: `${baseUrl}?token=${userRSSToken}&category=movie&tags=free`,
      description: '订阅所有免费电影种子',
      createdAt: '2025-12-01',
      itemCount: 128,
    },
    {
      id: '2',
      name: '4K高清内容',
      url: `${baseUrl}?token=${userRSSToken}&quality=4k`,
      description: '订阅所有4K分辨率的种子',
      createdAt: '2025-11-28',
      itemCount: 56,
    },
    {
      id: '3',
      name: '全部种子',
      url: `${baseUrl}?token=${userRSSToken}`,
      description: '订阅站点所有新发布的种子',
      createdAt: '2025-11-20',
      itemCount: 342,
    },
  ];

  const generateRSSUrl = () => {
    const params = new URLSearchParams();
    params.append('token', userRSSToken);

    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      params.append('category', selectedCategories.join(','));
    }

    if (selectedTags.length > 0) {
      params.append('tags', selectedTags.join(','));
    }

    if (selectedQuality.length > 0) {
      params.append('quality', selectedQuality.join(','));
    }

    // Add included fields
    const fields = Object.entries(includeFields)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    if (fields.length > 0 && fields.length < Object.keys(includeFields).length) {
      params.append('fields', fields.join(','));
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.filter(c => c !== 'all');
      if (newCategories.includes(categoryId)) {
        const filtered = newCategories.filter(c => c !== categoryId);
        setSelectedCategories(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedCategories([...newCategories, categoryId]);
      }
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleQuality = (qualityId: string) => {
    setSelectedQuality(prev =>
      prev.includes(qualityId)
        ? prev.filter(q => q !== qualityId)
        : [...prev, qualityId]
    );
  };

  const currentRSSUrl = generateRSSUrl();

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-amber-700/20 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Rss className="w-8 h-8 text-amber-400" />
            <h1 className="text-amber-50">RSS订阅</h1>
          </div>
          <p className="text-amber-200/70">通过RSS订阅获取最新种子更新，支持个性化筛选</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Security Notice */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-red-300 mb-1">安全提示</div>
              <div className="text-red-200/70 text-sm">
                您的RSS Token是私密信息，请勿分享给他人。如果Token泄露，请立即在"控制台"重置Token。
              </div>
            </div>
          </div>
        </div>

        {/* RSS Token Display */}
        <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-amber-50 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            您的RSS Token
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 px-4 py-3 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-300 font-mono">
              {userRSSToken}
            </div>
            <button
              onClick={() => handleCopyUrl(userRSSToken)}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              {copiedUrl === userRSSToken ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </button>
            <button className="px-4 py-3 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              重置
            </button>
          </div>
        </div>

        {/* RSS Generator */}
        <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 space-y-6">
          <h3 className="text-amber-50 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            自定义RSS订阅
          </h3>

          {/* Category Filter */}
          <div>
            <label className="block text-amber-300 mb-3">选择分类</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${selectedCategories.includes(category.id)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                    }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-amber-300 mb-3">
              <Tag className="w-4 h-4 inline mr-2" />
              筛选标签
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${selectedTags.includes(tag.id)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                    }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Filter */}
          <div>
            <label className="block text-amber-300 mb-3">
              <Award className="w-4 h-4 inline mr-2" />
              质量要求
            </label>
            <div className="flex flex-wrap gap-2">
              {qualities.map((quality) => (
                <button
                  key={quality.id}
                  onClick={() => toggleQuality(quality.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${selectedQuality.includes(quality.id)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                    }`}
                >
                  {quality.label}
                </button>
              ))}
            </div>
          </div>

          {/* Include Fields */}
          <div>
            <label className="block text-amber-300 mb-3">
              <Eye className="w-4 h-4 inline mr-2" />
              包含字段
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(includeFields).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer text-amber-300/80 hover:text-amber-300"
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setIncludeFields({ ...includeFields, [key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-amber-500/30 bg-[#0F171E]/50 text-amber-500 focus:ring-amber-400 focus:ring-offset-0"
                  />
                  <span className="text-sm">
                    {key === 'title' ? '标题' :
                      key === 'description' ? '描述' :
                        key === 'category' ? '分类' :
                          key === 'size' ? '大小' :
                            key === 'seeders' ? '做种' :
                              key === 'leechers' ? '下载' :
                                key === 'uploader' ? '发布者' :
                                  key === 'uploadDate' ? '发布时间' :
                                    key === 'tags' ? '标签' : key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generated URL */}
          <div className="pt-4 border-t border-amber-500/20">
            <label className="block text-amber-300 mb-3">生成的RSS订阅地址</label>
            <div className="flex gap-3">
              <div className="flex-1 px-4 py-3 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-300 font-mono text-sm break-all">
                {currentRSSUrl}
              </div>
              <button
                onClick={() => handleCopyUrl(currentRSSUrl)}
                className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {copiedUrl === currentRSSUrl ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制链接
                  </>
                )}
              </button>
            </div>
            <p className="text-amber-400/50 text-sm mt-2">
              将此链接添加到您的RSS阅读器中，即可订阅符合条件的种子更新
            </p>
          </div>
        </div>

        {/* My Feeds */}
        <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-amber-50 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            我的RSS订阅
          </h3>
          <div className="space-y-3">
            {mockFeeds.map((feed) => (
              <div
                key={feed.id}
                className="bg-[#0F171E]/30 border border-amber-500/20 rounded-lg p-4 hover:border-amber-400/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-amber-50 mb-1">{feed.name}</h4>
                    <p className="text-amber-300/60 text-sm mb-2">{feed.description}</p>
                    <div className="flex items-center gap-4 text-xs text-amber-400/50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        创建于 {feed.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Rss className="w-3 h-3" />
                        {feed.itemCount} 条目
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyUrl(feed.url)}
                    className="px-3 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all text-sm flex items-center gap-2"
                  >
                    {copiedUrl === feed.url ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制
                      </>
                    )}
                  </button>
                </div>
                <div className="px-3 py-2 bg-[#0F171E]/50 rounded text-amber-400/40 text-xs font-mono break-all">
                  {feed.url}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-amber-50 mb-4">使用说明</h3>
          <div className="space-y-4 text-amber-200/70">
            <div>
              <h4 className="text-amber-300 mb-2">1. 什么是RSS订阅？</h4>
              <p className="text-sm">
                RSS是一种消息来源格式规范，允许您通过RSS阅读器自动获取网站更新。订阅本站RSS后，新种子发布时会自动推送到您的阅读器。
              </p>
            </div>

            <div>
              <h4 className="text-amber-300 mb-2">2. 推荐的RSS阅读器</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="px-3 py-2 bg-[#0F171E]/30 rounded">
                  <span className="text-amber-400">桌面端：</span> Fluent Reader, NetNewsWire, Reeder
                </div>
                <div className="px-3 py-2 bg-[#0F171E]/30 rounded">
                  <span className="text-amber-400">移动端：</span> Reeder, News Explorer, Feedly
                </div>
                <div className="px-3 py-2 bg-[#0F171E]/30 rounded">
                  <span className="text-amber-400">在线服务：</span> Feedly, Inoreader, The Old Reader
                </div>
                <div className="px-3 py-2 bg-[#0F171E]/30 rounded">
                  <span className="text-amber-400">下载工具：</span> qBittorrent (内置RSS), μTorrent
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-amber-300 mb-2">3. 如何使用？</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>在上方配置您需要的订阅条件（分类、标签、质量等）</li>
                <li>复制生成的RSS订阅地址</li>
                <li>在您的RSS阅读器或下载工具中添加此订阅地址</li>
                <li>设置自动下载规则（可选）</li>
              </ol>
            </div>

            <div>
              <h4 className="text-amber-300 mb-2">4. 注意事项</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>请勿将RSS Token分享给他人，否则可能导致账号被盗用</li>
                <li>RSS订阅地址中包含您的个人Token，请妥善保管</li>
                <li>如发现Token泄露，请立即在控制台重置</li>
                <li>建议设置合理的刷新频率，避免频繁请求</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
