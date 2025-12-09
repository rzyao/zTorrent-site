import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  AlertCircle,
  User,
  Download,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function TicketFAQView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      category: 'account',
      categoryName: '账号问题',
      icon: <User className="w-5 h-5" />,
      question: '如何找回忘记的密码?',
      answer:
        '您可以在登录页面点击"忘记密码"链接,输入您的注册邮箱或用户名。系统会向您的邮箱发送重置密码的链接。如果您无法接收邮件,请联系管理员寻求帮助。',
      tags: ['密码', '登录', '邮箱'],
    },
    {
      id: '2',
      category: 'account',
      categoryName: '账号问题',
      icon: <User className="w-5 h-5" />,
      question: '为什么我的账号被禁用了?',
      answer:
        '账号被禁用通常是因为违反了站点规则,常见原因包括：1) Hit and Run(下载后不做种) 2) 分享率过低 3) 恶意刷流量 4) 发布不当内容。您可以提交工单说明情况,管理员会审核处理。',
      tags: ['禁用', 'H&R', '规则'],
    },
    {
      id: '3',
      category: 'technical',
      categoryName: '技术问题',
      icon: <AlertCircle className="w-5 h-5" />,
      question: '下载速度很慢怎么办?',
      answer:
        '下载速度慢可能有以下原因：1) 检查您的分享率,分享率低可能触发限速 2) 确认防火墙和路由器端口转发设置正确 3) 尝试更换BT客户端 4) 选择做种人数多的种子 5) 检查是否是网络运营商限速。如问题持续,请提交工单详细说明。',
      tags: ['下载', '速度', '限速'],
    },
    {
      id: '4',
      category: 'technical',
      categoryName: '技术问题',
      icon: <AlertCircle className="w-5 h-5" />,
      question: '无法连接到Tracker怎么办?',
      answer:
        '请检查：1) 确认您的网络连接正常 2) 检查BT客户端的Tracker设置 3) 查看是否被防火墙拦截 4) 尝试手动更新Tracker 5) 确认您的账号状态正常。如果以上方法都无效,可能是站点维护中,请稍后再试。',
      tags: ['Tracker', '连接', '网络'],
    },
    {
      id: '5',
      category: 'download',
      categoryName: '下载上传',
      icon: <Download className="w-5 h-5" />,
      question: '什么是Hit and Run(H&R)?',
      answer:
        'Hit and Run是指下载完成后立即停止做种的行为。我们要求下载完成后至少保种72小时或上传量达到下载量的100%。频繁H&R会导致账号被警告甚至禁用。',
      tags: ['H&R', 'Hit and Run', '做种'],
    },
    {
      id: '6',
      category: 'download',
      categoryName: '下载上传',
      icon: <Download className="w-5 h-5" />,
      question: '如何提高分享率?',
      answer:
        '提高分享率的方法：1) 长期保种热门资源 2) 下载FREE标记的种子(不计下载量) 3) 上传新的优质资源 4) 使用魔力值兑换上传量 5) 参与站点活动获取奖励。建议保持分享率在1.0以上。',
      tags: ['分享率', '上传', 'FREE'],
    },
    {
      id: '7',
      category: 'bonus',
      categoryName: '魔力系统',
      icon: <Zap className="w-5 h-5" />,
      question: '如何获得魔力值?',
      answer:
        '获得魔力值的方式：1) 保种赚取(根据种子大小和时间计算) 2) 每日签到 3) 上传优质资源 4) 参与论坛讨论 5) 完成站点任务 6) 参加特殊活动。魔力值可用于兑换上传量、VIP等。',
      tags: ['魔力值', '保种', '签到'],
    },
    {
      id: '8',
      category: 'bonus',
      categoryName: '魔力系统',
      icon: <Zap className="w-5 h-5" />,
      question: '魔力值可以用来做什么?',
      answer:
        '魔力值用途：1) 兑换上传量提升分享率 2) 购买VIP会员 3) 兑换邀请码 4) 购买自定义头像框 5) 参与魔力商店特殊商品兑换。建议合理规划使用,优先用于提升分享率。',
      tags: ['魔力值', '兑换', 'VIP'],
    },
    {
      id: '9',
      category: 'upload',
      categoryName: '资源发布',
      icon: <Settings className="w-5 h-5" />,
      question: '上传种子有什么要求?',
      answer:
        '上传要求：1) 确保资源质量高且完整 2) 填写详细准确的描述信息 3) 选择正确的分类和标签 4) 提供清晰的截图 5) 检查是否重复上传 6) 遵守版权和内容规范。优质资源会获得更多魔力值奖励。',
      tags: ['上传', '种子', '要求'],
    },
    {
      id: '10',
      category: 'upload',
      categoryName: '资源发布',
      icon: <Settings className="w-5 h-5" />,
      question: '如何制作种子文件?',
      answer:
        '制作种子步骤：1) 使用支持的BT客户端(如qBittorrent) 2) 选择"创建新种子"功能 3) 添加要分享的文件或文件夹 4) 填写Tracker地址 5) 设置合适的分块大小 6) 生成种子文件。建议查看详细教程或向有经验的用户请教。',
      tags: ['制作种子', '教程', 'Tracker'],
    },
    {
      id: '11',
      category: 'rules',
      categoryName: '站点规则',
      icon: <Shield className="w-5 h-5" />,
      question: '违反规则会有什么后果?',
      answer:
        '违规后果根据严重程度分为：1) 轻微违规：警告提醒 2) 一般违规：临时禁用账号、扣除魔力值 3) 严重违规：永久封禁账号、IP拉黑。具体处罚由管理组根据实际情况判定。建议认真阅读并遵守站点规则。',
      tags: ['规则', '违规', '处罚'],
    },
    {
      id: '12',
      category: 'rules',
      categoryName: '站点规则',
      icon: <Shield className="w-5 h-5" />,
      question: '可以使用多个账号吗?',
      answer:
        '严禁使用多个账号。我们的系统会检测同一IP或设备的多账号登录。一旦发现,所有相关账号都会被永久封禁。如果家庭成员需要使用,请提前联系管理员说明情况。',
      tags: ['多账号', '小号', '封禁'],
    },
  ];

  const categories = [
    { id: 'all', name: '全部', icon: <HelpCircle className="w-4 h-4" />, color: 'text-neutral-400' },
    { id: 'account', name: '账号问题', icon: <User className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'technical', name: '技术问题', icon: <AlertCircle className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'download', name: '下载上传', icon: <Download className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'bonus', name: '魔力系统', icon: <Zap className="w-4 h-4" />, color: 'text-amber-400' },
    { id: 'upload', name: '资源发布', icon: <Settings className="w-4 h-4" />, color: 'text-orange-400' },
    { id: 'rules', name: '站点规则', icon: <Shield className="w-4 h-4" />, color: 'text-red-400' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !faq.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !faq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
      return false;
    return true;
  });

  return (
    <div>
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索常见问题..."
            className="bg-neutral-900/50 border-neutral-700 text-white pl-12 h-12 text-lg"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text白色'
                  : `${category.color} hover:bg-neutral-700/50`
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-12 text-center">
            <HelpCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">未找到相关问题</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const categoryInfo = categories.find((c) => c.id === faq.category);

            return (
              <div
                key={faq.id}
                className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/30 transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-6 flex items-start justify-between gap-4 text-left hover:bg-neutral-700/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {categoryInfo && <div className={`${categoryInfo.color}`}>{categoryInfo.icon}</div>}
                      <h3 className="text-white group-hover:text-amber-400 transition-colors">{faq.question}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {faq.tags.map((tag) => (
                        <Badge key={tag} className="bg-neutral-700/30 text-neutral-400 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-neutral-700/50">
                    <div className="pt-4">
                      <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-6">
        <div className="flex items-start gap-4">
          <HelpCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-amber-400 mb-2">没有找到您的问题?</h4>
            <p className="text-neutral-300 mb-4">如果以上常见问题无法解决您的疑问,您可以创建工单向我们寻求帮助。我们的支持团队会尽快为您解答。</p>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all">创建工单</button>
          </div>
        </div>
      </div>
    </div>
  );
}

