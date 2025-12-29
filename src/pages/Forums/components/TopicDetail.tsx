import {
  ArrowLeft,
  ThumbsUp,
  Share2,
  Bookmark,
  MessageSquare,
  Clock,
  MoreVertical,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useForumTheme } from "../context/ForumThemeContext";

interface TopicDetailProps {
  topicId: string;
  onBack: () => void;
}

const mockTopic = {
  id: "1",
  title: "React 19 新特性深度解析 - Server Components 实战指南",
  author: "前端架构师",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  tags: ["React", "TypeScript", "前端开发"],
  createdAt: "2小时前",
  views: 12456,
  likes: 567,
  isLiked: false,
  isBookmarked: false,
  content: `
# React 19 Server Components 深度解析

React 19 带来了革命性的 Server Components 特性，这将彻底改变我们构建 React 应用的方式。

## 什么是 Server Components？

Server Components 是一种新的组件类型，它们在服务器端渲染，并且不会增加客户端 JavaScript 包的大小。

### 主要优势

1. **零客户端 JavaScript** - Server Components 的代码不会被发送到客户端
2. **直接访问后端资源** - 可以直接访问数据库、文件系统等
3. **更好的性能** - 减少客户端需要下载和执行的 JavaScript 代码
4. **自动代码分割** - React 会自动进行智能的代码分割

## 实战示例

\`\`\`tsx
// ProductList.server.tsx
export default async function ProductList() {
  // 直接在组件中进行数据获取
  const products = await db.products.findMany();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
\`\`\`

## 注意事项

- Server Components 不能使用 useState、useEffect 等客户端 hooks
- 需要明确区分 Server Components 和 Client Components
- 建议使用 .server.tsx 和 .client.tsx 命名约定

## 总结

Server Components 是 React 的一次重大进化，虽然学习曲线较陡，但它带来的性能提升和开发体验改善是值得的。
  `,
};

const mockReplies = [
  {
    id: "1",
    author: "技术极客",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
    content:
      "非常详细的教程！Server Components 确实是一个游戏规则改变者。我已经在项目中使用了，性能提升非常明显。",
    createdAt: "1小时前",
    likes: 45,
  },
  {
    id: "2",
    author: "新手开发者",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=11",
    content: "请问 Server Components 和传统的 SSR 有什么区别？能否详细解释一下？",
    createdAt: "45分钟前",
    likes: 23,
  },
  {
    id: "3",
    author: "全栈工程师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=12",
    content: "代码示例很实用！不过我在实际使用中遇到了一些数据序列化的问题，楼主有遇到过吗？",
    createdAt: "30分钟前",
    likes: 18,
  },
];

export function TopicDetail({ topicId, onBack }: TopicDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(mockTopic.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(mockTopic.isBookmarked);
  const { theme, colors } = useForumTheme();

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`flex items-center gap-2 transition-colors ${colors.textSecondary} ${colors.accentHover}`}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>返回列表</span>
      </button>

      {/* Main Topic */}
      <article
        className={`${colors.cardBg} rounded-xl p-6 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <img
            src={mockTopic.avatar}
            alt={mockTopic.author}
            className="h-14 w-14 shrink-0 rounded-full"
          />
          <div className="flex-1">
            <h1 className={`mb-3 text-2xl ${colors.textPrimary}`}>{mockTopic.title}</h1>
            <div className={`flex items-center gap-3 text-sm ${colors.textMuted} mb-3`}>
              <span className={`font-medium ${colors.textSecondary}`}>{mockTopic.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {mockTopic.createdAt}
              </span>
              <span>•</span>
              <span>{mockTopic.views.toLocaleString()} 浏览</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockTopic.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-3 py-1 text-sm ${theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-blue-50 text-blue-700"}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`prose mb-6 max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
          <div className={`whitespace-pre-wrap ${colors.textSecondary}`}>{mockTopic.content}</div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between border-t pt-6 ${colors.dividerColor}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                isLiked
                  ? theme === "dark"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-blue-100 text-blue-700"
                  : `${colors.buttonSecondary}`
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
              <span>{mockTopic.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${colors.buttonSecondary}`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>回复</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`rounded-lg p-2 transition-colors ${
                isBookmarked
                  ? theme === "dark"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-yellow-100 text-yellow-700"
                  : `${colors.buttonSecondary}`
              }`}
            >
              <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button className={`rounded-lg p-2 transition-colors ${colors.buttonSecondary}`}>
              <Share2 className="h-5 w-5" />
            </button>
            <button className={`rounded-lg p-2 transition-colors ${colors.buttonSecondary}`}>
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </article>

      {/* Replies Section */}
      <div
        className={`${colors.cardBg} rounded-xl p-6 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h2 className={`mb-6 text-xl ${colors.textPrimary}`}>
          全部回复 <span className={colors.textMuted}>({mockReplies.length})</span>
        </h2>

        {/* Reply Input */}
        <div className="mb-6">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="写下你的评论..."
            className={`focus:ring-opacity-50 w-full resize-none rounded-lg border p-4 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${theme === "dark" ? "focus:ring-amber-500" : "focus:ring-blue-500"}`}
            rows={4}
          />
          <div className="mt-2 flex justify-end">
            <button
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-colors ${colors.buttonPrimary}`}
            >
              <Send className="h-4 w-4" />
              发布回复
            </button>
          </div>
        </div>

        {/* Replies List */}
        <div className="space-y-4">
          {mockReplies.map((reply) => (
            <div
              key={reply.id}
              className={`flex gap-4 rounded-lg p-4 transition-colors ${colors.cardHover}`}
            >
              <img
                src={reply.avatar}
                alt={reply.author}
                className="h-10 w-10 shrink-0 rounded-full"
              />
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <span className={`font-medium ${colors.textPrimary}`}>{reply.author}</span>
                  <span className={`text-sm ${colors.textMuted}`}>{reply.createdAt}</span>
                </div>
                <p className={`${colors.textSecondary} mb-3`}>{reply.content}</p>
                <div className="flex items-center gap-3">
                  <button
                    className={`flex items-center gap-1 text-sm ${colors.textMuted} ${colors.accentHover} transition-colors`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{reply.likes}</span>
                  </button>
                  <button
                    className={`text-sm ${colors.textMuted} ${colors.accentHover} transition-colors`}
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
