import { useState } from "react";
import {
  BookOpen,
  Download,
  Upload,
  Search,
  Users,
  MessageSquare,
  Award,
  Sparkles,
  HelpCircle,
  Settings,
  Languages,
  Zap,
  Clock,
} from "lucide-react";
import type {
  Tutorial,
  TutorialStep,
  CategoryType,
  CategoryItem,
} from "@/pages/Tutorials/types";
import { TutorialsHeader } from "@/pages/Tutorials/components/TutorialsHeader";
import { TutorialsStats } from "@/pages/Tutorials/components/TutorialsStats";
import { TutorialsFilters } from "@/pages/Tutorials/components/TutorialsFilters";
import { TutorialsList } from "@/pages/Tutorials/components/TutorialsList";
import { TutorialDetailModal } from "@/pages/Tutorials/components/TutorialDetailModal";

/**
 * 教程页面
 *
 * 说明：组合拆分后的子组件与业务 Hook，保持原有页面布局与交互。
 * **/
export function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const categories: CategoryItem[] = [
    { id: "all", name: "全部教程", icon: BookOpen, color: "amber" },
    { id: "basic", name: "新手入门", icon: HelpCircle, color: "green" },
    { id: "torrent", name: "种子下载", icon: Download, color: "blue" },
    { id: "community", name: "社区互动", icon: Users, color: "purple" },
    { id: "advanced", name: "高级功能", icon: Zap, color: "orange" },
  ];

  const tutorials: Tutorial[] = [
    // 新手入门
    {
      id: "1",
      title: "新用户注册与登录",
      category: "basic",
      description: "了解如何注册账号、激活邀请码以及首次登录的注意事项",
      icon: Users,
      difficulty: "beginner",
      duration: "5分钟",
      steps: [
        {
          title: "获取邀请码",
          content:
            "本站采用邀请制注册。您需要从现有用户处获得邀请码。邀请码是一串唯一的字符串，每个邀请码只能使用一次。",
        },
        {
          title: "填写注册信息",
          content:
            "点击注册页面，输入您的用户名、邮箱、密码和邀请码。用户名一旦设置将无法修改，请谨慎选择。密码建议使用字母、数字和特殊字符的组合，长度至少8位。",
        },
        {
          title: "邮箱验证",
          content:
            "提交注册后，系统会向您的邮箱发送验证邮件。请点击邮件中的链接完成验证。验证链接24小时内有效。",
        },
        {
          title: "完善个人资料",
          content:
            "首次登录后，建议完善个人资料，包括头像、个人简介等。这有助于提升账号的安全性和社区参与度。",
        },
      ],
      tips: [
        "请使用真实且常用的邮箱地址注册",
        "妥善保管您的账号密码，不要与他人分享",
        "邀请码来源需可靠，避免使用来路不明的邀请码",
        "建议开启两步验证以提高账号安全性",
      ],
    },
    {
      id: "2",
      title: "理解做种规则",
      category: "basic",
      description: "什么是做种、为什么要做种、如何保持良好的分享率",
      icon: Upload,
      difficulty: "beginner",
      duration: "8分钟",
      steps: [
        {
          title: "什么是做种",
          content:
            "做种（Seeding）是指在下载完成后，继续开启BT客户端，让其他用户从您这里下载文件。这是PT站的核心机制，也是维持社区健康运作的基础。",
        },
        {
          title: "分享率的重要性",
          content:
            "分享率 = 上传量 / 下载量。例如下载了100GB，上传了150GB，分享率就是1.5。大多数PT站要求分享率不低于1.0，否则可能面临账号限制。",
        },
        {
          title: "如何提高分享率",
          content:
            "1. 优先下载FREE种子（不计下载量）2. 长期做种，尤其是热门资源 3. 下载完成后不要立即关闭客户端 4. 参与保种活动获得奖励 5. 使用魔力值兑换上传量",
        },
        {
          title: "H&R规则",
          content:
            "Hit and Run（下完就跑）是被禁止的。通常要求下载完成后至少做种72小时或分享率达到1.0。违反H&R规则会被扣除魔力值甚至封禁账号。",
        },
      ],
      tips: [
        "新用户建议从FREE种子开始下载",
        "24小时保持BT客户端在线可以最大化上传",
        "宽带上传速度越快，做种效率越高",
        "定期检查做种情况，及时处理断种警告",
      ],
    },
    {
      id: "3",
      title: "如何搜索和下载种子",
      category: "torrent",
      description: "学习使用搜索功能、筛选器和下载种子的正确方法",
      icon: Search,
      difficulty: "beginner",
      duration: "6分钟",
      steps: [
        {
          title: "使用搜索功能",
          content:
            "在顶部搜索框输入关键词，可以搜索电影名、演员名、导演名等。支持中英文搜索。使用空格分隔多个关键词可以进行组合搜索。",
        },
        {
          title: "使用筛选器",
          content:
            "点击分类标签可以快速筛选电影、剧集、纪录片等。使用高级筛选可以按分辨率（4K/1080p）、音频格式、字幕等条件筛选。",
        },
        {
          title: "选择合适的种子",
          content:
            "注意查看种子的大小、做种人数、格式等信息。做种人数多的资源下载速度更快。FREE标签的种子不计下载量，适合新用户。",
        },
        {
          title: "下载种子文件",
          content:
            '点击"下载种子"按钮，将.torrent文件保存到本地，然后用BT客户端（如qBittorrent、Transmission）打开即可开始下载。',
        },
      ],
      tips: [
        "优先选择做种人数多的热门资源",
        "FREE种子不计下载量，但同样需要做种",
        "注意查看种子详情页的字幕和音轨信息",
        "下载前确保硬盘空间充足",
      ],
    },
    {
      id: "4",
      title: "种子上传指南",
      category: "torrent",
      description: "学习如何制作种子、填写资料和发布高质量资源",
      icon: Upload,
      difficulty: "intermediate",
      duration: "15分钟",
      steps: [
        {
          title: "准备种子文件",
          content:
            '使用BT客户端的"创建种子"功能，选择要分享的文件或文件夹。Tracker地址请使用站点提供的专用地址。建议开启"私有种子"选项。',
        },
        {
          title: "填写种子信息",
          content:
            "准确填写标题、类别、年份、地区等基本信息。标题格式建议：中文名 英文名 (年份) 分辨率 来源。例如：星际穿越 Interstellar (2014) 4K BluRay。",
        },
        {
          title: "添加详细描述",
          content:
            "在描述中包含：视频编码、音频格式、字幕信息、文件大小、截图等。详细的描述可以帮助用户判断是否需要下载。",
        },
        {
          title: "上传截图",
          content:
            "上传3-5张高质量截图展示画质。截图应选择不同场景，避免剧透。可以使用图床或站内图片上传功能。",
        },
        {
          title: "设置标签",
          content:
            "根据种子特性添加FREE、VIP、HOT等标签。FREE标签需要消耗魔力值，但可以吸引更多下载。VIP种子仅VIP用户可见。",
        },
      ],
      tips: [
        "上传前请确保资源质量，避免发布劣质资源",
        "标题和描述要准确，不要误导用户",
        "首发资源通常会获得额外奖励",
        "上传后记得持续做种，至少保持72小时在线",
      ],
    },
    {
      id: "5",
      title: "字幕下载与上传",
      category: "torrent",
      description: "如何查找匹配的字幕文件并分享给社区",
      icon: Languages,
      difficulty: "beginner",
      duration: "5分钟",
      steps: [
        {
          title: "搜索字幕",
          content:
            "进入字幕中心，可以按电影名、语言、格式等搜索。注意选择与您下载的视频版本匹配的字幕（如BluRay、WEB-DL等）。",
        },
        {
          title: "下载字幕",
          content:
            "点击字幕列表查看详情，确认语言、格式和适配版本后点击下载。字幕文件通常为.srt或.ass格式。",
        },
        {
          title: "使用字幕",
          content:
            "将字幕文件重命名为与视频文件相同的名称（扩展名除外），放在同一文件夹中。大多数播放器会自动加载字幕。",
        },
        {
          title: "上传字幕",
          content:
            "如果您有优质字幕资源，可以上传分享。选择字幕文件、关联对应种子、填写字幕信息和说明即可。上传字幕可获得魔力值奖励。",
        },
      ],
      tips: [
        "注意字幕的时间轴是否与视频版本匹配",
        "ASS格式字幕包含特效和样式，效果更好",
        "下载字幕后建议先本地测试是否正常",
        "感谢字幕制作者请给予好评",
      ],
    },
    {
      id: "6",
      title: "魔力值系统详解",
      category: "advanced",
      description: "了解魔力值的获取途径、使用方法和注意事项",
      icon: Sparkles,
      difficulty: "intermediate",
      duration: "10分钟",
      steps: [
        {
          title: "什么是魔力值",
          content:
            "魔力值是站内虚拟货币，可用于兑换上传量、VIP特权、邀请码等。魔力值是衡量用户贡献度的重要指标。",
        },
        {
          title: "魔力值获取途径",
          content:
            "1. 每日签到 2. 长期做种（按时间和体积计算）3. 上传种子 4. 上传字幕 5. 参与论坛讨论 6. 完成任务 7. 参与活动 8. 帮助他人",
        },
        {
          title: "魔力值兑换",
          content:
            "进入魔力商店可以兑换：上传流量包、VIP会员、邀请码、FREE标签、置顶位置等。兑换比例和规则请查看商店说明。",
        },
        {
          title: "魔力农场",
          content:
            "访问魔力农场小游戏，通过种植作物、收获、出售等方式获得魔力值。每天登录农场可以获得体力值，用于浇水和其他操作。",
        },
      ],
      tips: [
        "魔力值不能转让给其他用户",
        "合理规划魔力值使用，优先兑换急需的资源",
        "参与社区活动是快速获取魔力值的好方法",
        "长期做种是稳定获得魔力值的最佳途径",
      ],
    },
    {
      id: "7",
      title: "论坛和社区互动",
      category: "community",
      description: "如何参与论坛讨论、发帖和建立社区声誉",
      icon: MessageSquare,
      difficulty: "beginner",
      duration: "7分钟",
      steps: [
        {
          title: "浏览论坛板块",
          content:
            "论坛分为多个板块：公告区、求助区、资源讨论、影评区等。新用户建议先阅读公告和规则板块。",
        },
        {
          title: "发表帖子",
          content:
            '点击"发帖"按钮，选择合适的板块，填写标题和内容。标题要简洁明了，内容要有实质性讨论价值。避免灌水和无意义内容。',
        },
        {
          title: "回复和互动",
          content:
            "对他人的帖子进行有建设性的回复。点赞优质内容，分享有用信息。避免人身攻击和无意义的争吵。",
        },
        {
          title: "积累声誉",
          content:
            "发表高质量帖子、帮助新用户、分享经验可以获得声誉值和魔力值奖励。声誉高的用户更容易获得管理组的认可。",
        },
      ],
      tips: [
        "遵守论坛规则，不要发布违规内容",
        "使用搜索功能避免重复发帖",
        "善用Markdown格式让帖子更美观",
        "尊重他人观点，理性讨论",
      ],
    },
    {
      id: "8",
      title: "保种和断种处理",
      category: "advanced",
      description: "了解保种的重要性以及如何处理断种情况",
      icon: HelpCircle,
      difficulty: "intermediate",
      duration: "8分钟",
      steps: [
        {
          title: "什么是断种",
          content:
            "当某个种子完全没有做种者（Seeder为0）时，就称为断种。断种的资源无法被下载，对社区是一种损失。",
        },
        {
          title: "查看断种列表",
          content:
            '进入"保种"菜单下的"断种大厅"，可以看到当前所有断种资源。列表会显示断种时间、资源信息等。',
        },
        {
          title: "申请断种补种",
          content:
            "如果您曾经下载过某个断种资源，可以重新做种。找到原文件，用BT客户端打开该种子文件，验证完成后即可开始做种。",
        },
        {
          title: "保种奖励",
          content:
            '积极参与补种的用户会获得魔力值和上传量奖励。长期保种珍稀资源可以获得"保种达人"等荣誉称号。',
        },
      ],
      tips: [
        "下载完成后不要急于删除文件",
        "定期检查自己的做种列表",
        "珍稀资源建议永久保种",
        "硬盘空间允许的情况下，尽可能多保种",
      ],
    },
    {
      id: "9",
      title: "BT客户端配置",
      category: "advanced",
      description: "推荐的BT客户端以及最佳配置方法",
      icon: Settings,
      difficulty: "advanced",
      duration: "12分钟",
      steps: [
        {
          title: "选择BT客户端",
          content:
            "推荐使用：qBittorrent（开源免费）、Transmission（轻量级）、μTorrent（经典）。不推荐使用迅雷等国内客户端，可能无法连接PT tracker。",
        },
        {
          title: "基础设置",
          content:
            "下载保存路径：选择空间充足的硬盘。端口设置：使用随机端口或手动指定（建议10000-65535之间）。连接数限制：全局连接数500，每个种子100。",
        },
        {
          title: "速度设置",
          content:
            "下载速度限制：不建议限制，或设为带宽的90%。上传速度限制：不要限制，PT站需要上传。上传/下载比率：建议设为无限制。",
        },
        {
          title: "PT站专用设置",
          content:
            '关闭DHT、PEX、LPD等公网功能。开启"私有种子"选项。设置合理的做种时间（建议至少72小时）。定期更新tracker地址。',
        },
      ],
      tips: [
        "确保路由器端口转发设置正确",
        "使用有线网络比WiFi更稳定",
        "定期清理已完成的种子任务",
        "不要同时下载过多种子，影响速度",
      ],
    },
    {
      id: "10",
      title: "小组功能使用",
      category: "community",
      description: "如何加入和创建兴趣小组，参与小组活动",
      icon: Users,
      difficulty: "beginner",
      duration: "6分钟",
      steps: [
        {
          title: "浏览小组列表",
          content:
            '点击"小组"菜单查看所有小组。小组按主题分类，如"科幻电影爱好者"、"纪录片收藏组"等。查看小组详情了解成员数、活跃度等。',
        },
        {
          title: "加入小组",
          content:
            '点击"加入小组"按钮即可。有些小组需要管理员审核，有些可以直接加入。加入后可以在小组页面参与讨论和活动。',
        },
        {
          title: "创建小组",
          content:
            "如果没有符合您兴趣的小组，可以创建新小组。填写小组名称、简介、规��等信息。创建后您将成为小组管理员。",
        },
        {
          title: "小组活动",
          content:
            "小组可以组织观影活动、资源分享、评分比赛等。积极参与小组活动可以获得魔力值和荣誉勋章。",
        },
      ],
      tips: [
        "加入与您兴趣相关的小组可以找到同好",
        "小组活动是结识新朋友的好机会",
        "创建小组前先搜索是否已有类似小组",
        "小组管理员有责任维护小组秩序",
      ],
    },
    {
      id: "11",
      title: "工单系统使用",
      category: "basic",
      description: "遇到问题时如何正确提交工单获得帮助",
      icon: HelpCircle,
      difficulty: "beginner",
      duration: "5分钟",
      steps: [
        {
          title: "什么时候提交工单",
          content:
            "当遇到技术问题、账号问题、举报违规等情况时，可以提交工单。提交前请先查看FAQ和教程，避免重复咨询。",
        },
        {
          title: "填写工单信息",
          content:
            "选择工单类型（技术问题/账号问题/举报/建议）。填写清晰的标题和详细的问题描述。如有截图或错误信息，请一并提供。",
        },
        {
          title: "等待回复",
          content:
            "工单提交后，管理组会在24-48小时内回复。您会收到站内消息通知。请定期查看工单状态。",
        },
        {
          title: "工单关闭",
          content:
            "问题解决后，您或管理员可以关闭工单。关闭前可以对服务质量进行评价。",
        },
      ],
      tips: [
        "一个工单只讨论一个问题",
        "提供详细信息可以加快处理速度",
        "保持礼貌和耐心",
        "紧急问题可以在论坛求助板块发帖",
      ],
    },
    {
      id: "12",
      title: "候选和晋升系统",
      category: "advanced",
      description: "了解如何成为候选成员并最终晋升为正式会员",
      icon: Award,
      difficulty: "intermediate",
      duration: "8分钟",
      steps: [
        {
          title: "候选成员是什么",
          content:
            "新注册用户默认为候选成员。候选期间有一定的下载限制和功能限制。通过考核后可以晋升为正式会员。",
        },
        {
          title: "晋升条件",
          content:
            "通常需要：1. 注册时间满30天 2. 分享率不低于1.0 3. 上传量达到50GB 4. 做种数量不少于5个 5. 无违规记录。具体条件请查看规则页面。",
        },
        {
          title: "查看进度",
          content:
            '在"候选资格"页面可以查看您的晋升进度。页面会显示各项指标的完成情况和剩余要求。',
        },
        {
          title: "加速晋升",
          content:
            "参与保种、上传优质资源、积极参与社区活动都可以加快晋升速度。表现优秀的用户可能提前获得晋升。",
        },
      ],
      tips: [
        "候选期间认真遵守规则",
        "不要急于求成，循序渐进",
        "多做种FREE资源可以快速提升分享率",
        "晋升后记得回馈新人，帮助他人",
      ],
    },
  ];

  // 难度显示工具函数已迁移到 features/tutorials/utils.ts

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory =
      selectedCategory === "all" || tutorial.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <TutorialsHeader />
        <TutorialsStats tutorials={tutorials} />
        <TutorialsFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(id) => setSelectedCategory(id)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TutorialsList
          tutorials={filteredTutorials}
          onSelect={setSelectedTutorial}
        />
        {filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">没有找到相关教程</p>
          </div>
        )}
      </div>

      {selectedTutorial && (
        <TutorialDetailModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
        />
      )}
    </div>
  );
}
