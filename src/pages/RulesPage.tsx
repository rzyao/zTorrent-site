import { useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import {
  BookOpen,
  Shield,
  Upload,
  Download,
  Award,
  AlertTriangle,
  Users,
  Gift,
  TrendingUp,
  Heart,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface RuleSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: {
    title: string;
    description: string;
    items?: string[];
    warning?: string;
  }[];
}

export function RulesPage() {
  useDynamicTitle('规则');
  const [expandedSection, setExpandedSection] = useState<string>('general');

  const ruleSections: RuleSection[] = [
    {
      id: 'general',
      title: '总则',
      icon: <BookOpen className="w-5 h-5" />,
      content: [
        {
          title: '站点宗旨',
          description:
            '本站致力于为广大影音爱好者提供高质量的资源分享平台，倡导合理分享、互帮互助的社区文化。',
          items: [
            '保持良好的分享比例，做到有上传有下载',
            '尊重他人，文明交流，禁止人身攻击',
            '保护版权，仅供个人学习交流使用',
            '珍惜账号，遵守站点规则',
          ],
        },
        {
          title: '账号注册',
          description: '本站采用邀请码注册制度，新用户需要通过以下方式获取邀请码：',
          items: [
            '从现有用户处获得邀请码',
            '参与站点举办的公开注册活动',
            '通过官方渠道申请邀请码（需审核）',
          ],
          warning: '一人一号，严禁多开账号。违规者将被永久封禁所有关联账号。',
        },
        {
          title: '账号安全',
          description: '请妥善保管您的账号信息，确保账号安全：',
          items: [
            '使用强密码，定期更换密码',
            '不要与他人共享账号',
            '不要在不安全的网络环境下登录',
            '发现账号异常请立即联系管理员',
          ],
        },
      ],
    },
    {
      id: 'download',
      title: '下载规则',
      icon: <Download className="w-5 h-5" />,
      content: [
        {
          title: '下载要求',
          description: '为了维护站点健康发展，请遵守以下下载规则：',
          items: [
            '下载后请保持做种，不要下完就删除',
            '优先下载FREE种子以提升分享率',
            '合理控制下载数量，避免H&R（下载后立即停止做种）',
            '使用正版BT客户端下载（推荐qBittorrent、Transmission）',
          ],
        },
        {
          title: '分享率要求',
          description: '不同等级用户的分享率要求不同：',
          items: [
            '新手（注册30天内）：分享率 ≥ 0.4',
            '普通用户（注册30-90天）：分享率 ≥ 0.6',
            '正式用户（注册90天以上）：分享率 ≥ 0.8',
            'VIP用户：无分享率要求',
          ],
          warning:
            '分享率不达标的账号将被限制下载，连续30天不达标将被自动封禁。',
        },
        {
          title: 'H&R规则',
          description: 'Hit and Run（下载即跑）是严重违规行为：',
          items: [
            '下载后必须做种至少72小时或分享率达到1.0',
            '每个种子的H&R记录将影响您的账号信誉',
            '累计5次H&R将被警告，10次将被禁用下载',
            'FREE种子同样需要遵守H&R规则',
          ],
        },
      ],
    },
    {
      id: 'upload',
      title: '上传规则',
      icon: <Upload className="w-5 h-5" />,
      content: [
        {
          title: '上传资格',
          description: '获得上传权限需要满足以下条件之一：',
          items: [
            '注册满7天且分享率≥1.0',
            '上传≥50GB且下载≥20GB',
            '通过上传者考核测试',
            'VIP用户自动拥有上传权限',
          ],
        },
        {
          title: '上传要求',
          description: '上传种子时请确保：',
          items: [
            '内容清晰完整，无损坏或缺失',
            '准确填写标题、分类、简介等信息',
            '提供清晰的截图或预览',
            '标注清楚来源、编码、音频等技术参数',
            '检查是否已存在相同或相似资源（避免重复）',
          ],
          warning: '上传低质量、虚假、违规内容将导致上传权限被取消。',
        },
        {
          title: '命名规范',
          description: '种子命名应遵循以下格式：',
          items: [
            '电影：[中文名] / [英文名] (年份) [质量] [来源] [编码]',
            '剧集：[名称] S01E01 [质量] [来源] [编码] [字幕]',
            '音乐：[艺术家] - [专辑名] (年份) [格式] [码率]',
            '示例：星际穿越 / Interstellar (2014) 4K UHD BluRay H.265',
          ],
        },
        {
          title: '上传奖励',
          description: '上传优质资源可获得丰厚奖励：',
          items: [
            '上传成功即获得魔力值奖励',
            '种子被收藏、评论可额外获得奖励',
            '优质上传者可获得特殊徽章和权限',
            '每月评选上传之星，给予额外奖励',
          ],
        },
      ],
    },
    {
      id: 'points',
      title: '积分系统',
      icon: <Award className="w-5 h-5" />,
      content: [
        {
          title: '魔力值（Bonus）',
          description: '魔力值是站点的虚拟货币，可以通过以下方式获得：',
          items: [
            '做种时长：每小时可获得0.5-2魔力值（根据种子热度）',
            '上传种子：每个种子10-50魔力值',
            '签到打卡：每日签到1-5魔力值',
            '完成任务：5-100魔力值不等',
            '参与活动：根据活动规则获得',
          ],
        },
        {
          title: '魔力值用途',
          description: '魔力值可以用于：',
          items: [
            '兑换上传流量（1魔力值 = 1GB上传）',
            '购买VIP会员（1个月=1000魔力值）',
            '兑换邀请码（每个100魔力值）',
            '购买特殊徽章和头衔',
            '参与拍卖和抽奖活动',
          ],
        },
        {
          title: '用户等级',
          description: '根据上传量和账号时长，用户等级分为：',
          items: [
            'Lv.0 新手：刚注册的用户',
            'Lv.1 见习：上传≥10GB',
            'Lv.2 正式：上传≥50GB且注册≥30天',
            'Lv.3 精英：上传≥200GB且注册≥90天',
            'Lv.4 大师：上传≥500GB且注册≥180天',
            'Lv.5 元老：上传≥1TB且注册≥365天',
          ],
          warning: '等级越高，享受的权限和优惠越多。',
        },
      ],
    },
    {
      id: 'vip',
      title: 'VIP会员',
      icon: <Gift className="w-5 h-5" />,
      content: [
        {
          title: 'VIP特权',
          description: 'VIP会员享有以下特殊权限：',
          items: [
            '无分享率限制，自由下载',
            '所有种子显示为FREE（不计下载量）',
            '魔力值获取速度x2',
            '独享VIP专区资源',
            '优先技术支持',
            '专属VIP标识和徽章',
            '可创建私密片单',
          ],
        },
        {
          title: '获取VIP',
          description: 'VIP会员可通过以下方式获得：',
          items: [
            '使用1000魔力值兑换1个月VIP',
            '上传优质资源，由管理员奖励',
            '参与站点活动获得',
            '为站点做出特殊贡献',
          ],
        },
        {
          title: 'VIP等级',
          description: 'VIP分为三个等级：',
          items: [
            '铜牌VIP（1个月）：基础特权',
            '银牌VIP（3个月）：基础特权 + 额外福利',
            '金牌VIP（永久）：全部特权 + 终身荣誉',
          ],
        },
      ],
    },
    {
      id: 'community',
      title: '社区规范',
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          title: '论坛规则',
          description: '在论坛和评论区交流时请遵守：',
          items: [
            '文明用语，尊重他人观点',
            '不发布广告、垃圾信息',
            '不泄露个人隐私信息',
            '不传播政治敏感、色情暴力内容',
            '不恶意灌水、刷屏',
          ],
          warning: '违反社区规范者将被警告、禁言甚至封号。',
        },
        {
          title: '求助与反馈',
          description: '遇到问题时：',
          items: [
            '优先查阅FAQ和新手教程',
            '在论坛求助版块发帖',
            '联系在线客服或管理员',
            '通过站内消息系统反馈',
          ],
        },
        {
          title: '举报机制',
          description: '发现违规行为请及时举报：',
          items: [
            '举报虚假、违规种子',
            '举报恶意用户行为',
            '举报技术问题和BUG',
            '举报内容将被保密处理',
          ],
        },
      ],
    },
    {
      id: 'violations',
      title: '违规处罚',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          title: '违规行为',
          description: '以下行为将受到处罚：',
          items: [
            '使用多个账号（小号）',
            '买卖账号、邀请码',
            '作弊、刷流量、刷魔力值',
            '上传虚假、低质量资源',
            '恶意H&R',
            '人身攻击、辱骂他人',
            '传播违法违规内容',
          ],
        },
        {
          title: '处罚措施',
          description: '根据违规情节轻重，将采取以下措施：',
          items: [
            '轻度违规：警告、扣除魔力值',
            '中度违规：禁用下载7-30天、降低等级',
            '重度违规：永久封禁账号、IP封锁',
            '严重违法：报警处理',
          ],
          warning: '被封禁账号的所有上传、魔力值将被清零，不可恢复。',
        },
        {
          title: '申诉流程',
          description: '如认为处罚有误，可以申诉：',
          items: [
            '在申诉版块发帖说明情况',
            '提供相关证据截图',
            '等待管理员审核（3-7个工作日）',
            '申诉一次不通过可再次申诉',
          ],
        },
      ],
    },
    {
      id: 'special',
      title: '特殊说明',
      icon: <Info className="w-5 h-5" />,
      content: [
        {
          title: 'FREE种子',
          description: 'FREE种子不计下载量，但仍需遵守做种规则：',
          items: [
            '下载FREE种子不消耗下载流量',
            '上传流量正常计算',
            '仍需遵守H&R规则',
            'FREE标记可能会取消，请及时关注',
          ],
        },
        {
          title: '考核期',
          description: '新用户有30天的考核期：',
          items: [
            '考核期内需保持分享率≥0.4',
            '考核期内限制下载数量',
            '通过考核后解除限制',
            '未通过考核账号将被删除',
          ],
        },
        {
          title: '保活要求',
          description: '为了账号安全，请定期登录：',
          items: [
            '连续90天未登录账号将被标记',
            '连续180天未登录账号将被禁用',
            '禁用后可申请恢复（需说明原因）',
            'VIP账号保活期延长至365天',
          ],
        },
        {
          title: '版权声明',
          description: '重要的法律声明：',
          items: [
            '本站资源仅供个人学习交流使用',
            '请支持正版，下载后请在24小时内删除',
            '禁止用于商业用途',
            '传播者需承担相应法律责任',
          ],
          warning:
            '请尊重版权，合理使用资源。站点不对用户行为承担法律责任。',
        },
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? '' : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">站点规则</h1>
              <p className="text-neutral-400 text-sm mt-1">
                请仔细阅读并遵守以下规则，违规者将受到相应处罚
              </p>
            </div>
          </div>
        </div>

        {/* 重要提示 */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400 mb-2">重要提示</h3>
              <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                注册并使用本站服务即表示您已阅读、理解并同意遵守所有站点规则。不了解规则不能成为违规的理由。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  保持良好分享率
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  遵守做种规则
                </Badge>
                <Badge className="bg-red-500/20 text-red-400">
                  <XCircle className="w-3 h-3 mr-1" />
                  禁止多开账号
                </Badge>
                <Badge className="bg-red-500/20 text-red-400">
                  <XCircle className="w-3 h-3 mr-1" />
                  禁止作弊刷流量
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-4 sticky top-20">
              <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">
                规则目录
              </h3>
              <div className="space-y-2">
                {ruleSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${expandedSection === section.id
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-amber-400'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-700/30'
                      }`}
                  >
                    {section.icon}
                    <span className="text-sm flex-1 text-left">
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>

              <Separator className="bg-neutral-700/50 my-4" />

              {/* 快速链接 */}
              <div className="space-y-2">
                <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-3">
                  快速链接
                </h3>
                <a
                  href="#"
                  className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  新手教程
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  常见问题
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  捐赠支持
                </a>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {ruleSections.map((section) => (
                <div
                  key={section.id}
                  className={`bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden transition-all ${expandedSection === section.id
                      ? 'border-amber-500/30 shadow-lg shadow-amber-500/10'
                      : ''
                    }`}
                >
                  {/* 章节标题 */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-neutral-700/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${expandedSection === section.id
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30'
                            : 'bg-neutral-700/50'
                          }`}
                      >
                        {section.icon}
                      </div>
                      <h2
                        className={`text-xl ${expandedSection === section.id
                            ? 'text-white'
                            : 'text-neutral-300'
                          }`}
                      >
                        {section.title}
                      </h2>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronUp className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-500" />
                    )}
                  </button>

                  {/* 章节内容 */}
                  {expandedSection === section.id && (
                    <div className="px-6 pb-6 space-y-6">
                      {section.content.map((item, index) => (
                        <div key={index}>
                          {index > 0 && (
                            <Separator className="bg-neutral-700/50 mb-6" />
                          )}
                          <div>
                            <h3 className="text-amber-400 mb-3 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              {item.title}
                            </h3>
                            <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                              {item.description}
                            </p>
                            {item.items && (
                              <ul className="space-y-2 mb-3">
                                {item.items.map((listItem, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-3 text-neutral-400 text-sm"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>{listItem}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {item.warning && (
                              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400 text-sm">
                                  {item.warning}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 底部声明 */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm border border-neutral-700/50">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="text-white mb-2">最终解释权</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                    本站保留对规则的最终解释权和修改权。规则更新后将在首页公告，用户应及时关注。
                  </p>
                  <p className="text-neutral-500 text-xs">
                    最后更新时间：2024年11月26日 | 版本：v3.2
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
