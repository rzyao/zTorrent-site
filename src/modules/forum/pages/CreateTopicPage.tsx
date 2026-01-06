import {
  Bold,
  Italic,
  Link as LinkIcon,
  Quote,
  Code,
  List,
  Image as ImageIcon,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";
import { toast } from "sonner";

/**
 * 模拟 Discourse 的富文本编辑器工具栏
 */
const Toolbar = ({ onAction }: { onAction: (action: string) => void }) => {
  const { colors, theme } = useForumTheme();

  const tools = [
    { id: "bold", icon: Bold, label: "加粗" },
    { id: "italic", icon: Italic, label: "斜体" },
    { id: "link", icon: LinkIcon, label: "链接" },
    { id: "quote", icon: Quote, label: "引用" },
    { id: "code", icon: Code, label: "代码块" },
    { id: "list", icon: List, label: "列表" },
    { id: "image", icon: ImageIcon, label: "上传图片" },
  ];

  return (
    <div
      className={`flex items-center gap-1 border-b px-2 py-2 ${colors.borderColor} bg-gray-50 dark:bg-white/5`}
    >
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => onAction(tool.id)}
          className={`rounded p-1.5 transition-colors ${colors.textSecondary} hover:bg-black/10 dark:hover:bg-white/10`}
          title={tool.label}
        >
          <tool.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

/**
 * 简单的 Markdown 渲染器 (用于预览)
 */
const SimpleMarkdownPreview = ({ content }: { content: string }) => {
  const { colors, theme } = useForumTheme();

  if (!content) {
    return (
      <div className={`flex h-full items-center justify-center text-sm ${colors.textMuted}`}>
        预览区域
      </div>
    );
  }

  // 简单的处理逻辑，实际项目应使用 react-markdown
  const renderContent = () => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# "))
        return (
          <h1 key={index} className="mb-4 border-b pb-2 text-2xl font-bold">
            {line.slice(2)}
          </h1>
        );
      if (line.startsWith("## "))
        return (
          <h2 key={index} className="mb-3 text-xl font-bold">
            {line.slice(3)}
          </h2>
        );
      if (line.startsWith("### "))
        return (
          <h3 key={index} className="mb-2 text-lg font-bold">
            {line.slice(4)}
          </h3>
        );
      if (line.startsWith("- "))
        return (
          <li key={index} className="ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      if (line.startsWith("> "))
        return (
          <blockquote
            key={index}
            className="my-2 border-l-4 border-gray-300 pl-4 text-gray-500 italic"
          >
            {line.slice(2)}
          </blockquote>
        );
      if (line.startsWith("```"))
        return (
          <pre
            key={index}
            className="mb-2 overflow-x-auto rounded bg-gray-100 p-3 font-mono text-sm dark:bg-gray-800"
          >
            {line.slice(3) || "code"}
          </pre>
        );
      return (
        <p key={index} className="mb-2 min-h-[1.5em]">
          {line}
        </p>
      );
    });
  };

  return <div className={`prose dark:prose-invert max-w-none p-4`}>{renderContent()}</div>;
};

export function CreateTopicPage() {
  const { colors, theme } = useForumTheme();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(true); // 默认显示预览 (类似 Discourse 桌面端)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error("请输入话题标题");
      return;
    }
    if (!category) {
      toast.error("请选择话题分类");
      return;
    }
    if (!content.trim()) {
      toast.error("请输入话题内容");
      return;
    }

    setIsSubmitting(true);

    // 模拟 API 调用延迟
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTopic = {
        title,
        category,
        content,
        tags,
        createdAt: new Date().toISOString(),
      };

      console.log("Creating topic:", newTopic);
      toast.success("话题发布成功！");
      navigate("/forum"); // 返回列表页
    } catch (error) {
      console.error("Failed to publish topic:", error);
      toast.error("发布失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolbarAction = (action: string) => {
    // 简单的插入逻辑，实际应根据光标位置插入
    let textToInsert = "";
    switch (action) {
      case "bold":
        textToInsert = "**粗体文字**";
        break;
      case "italic":
        textToInsert = "*斜体文字*";
        break;
      case "link":
        textToInsert = "[链接文字](url)";
        break;
      case "quote":
        textToInsert = "\n> 引用文字\n";
        break;
      case "code":
        textToInsert = "\n```\n代码块\n```\n";
        break;
      case "list":
        textToInsert = "\n- 列表项";
        break;
      case "image":
        textToInsert = "![图片描述](url)";
        break;
    }
    setContent((prev) => prev + textToInsert);
  };

  const handleTagInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* 头部区域 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${colors.textPrimary}`}>发布新话题</h1>
        <button
          onClick={() => navigate(-1)}
          className={`rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 ${colors.textSecondary}`}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* 主编辑器容器 - 移除 overflow-hidden 以防遮挡，改用 min-h */}
      <div
        className={`${colors.cardBg} flex flex-col rounded-xl border ${colors.cardBorder} ${colors.shadow} relative min-h-[600px]`}
      >
        {/* 输入行：标题 + 分类 */}
        <div
          className={`flex flex-col gap-4 border-b p-4 md:flex-row md:items-center ${colors.borderColor}`}
        >
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入话题标题..."
              className={`w-full bg-transparent text-lg font-semibold placeholder:font-normal focus:outline-none ${colors.textPrimary} placeholder:text-gray-300 dark:placeholder:text-gray-600`}
            />
          </div>
          <div className="w-full md:w-64">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full appearance-none rounded-lg border px-4 py-2 pr-10 text-sm font-medium transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.borderColor} ${colors.textPrimary} focus:ring-blue-500 dark:focus:ring-amber-500`}
              >
                <option value="" disabled>
                  选择分类...
                </option>
                <option value="tech">技术讨论</option>
                <option value="design">设计创意</option>
                <option value="gaming">游戏娱乐</option>
                <option value="music">音乐分享</option>
                <option value="learning">学习成长</option>
                <option value="competition">竞赛活动</option>
              </select>
              <ChevronDown
                className={`pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 ${colors.textMuted}`}
              />
            </div>
          </div>
        </div>

        {/* 标签行 */}
        <div
          className={`flex flex-wrap items-center gap-2 border-b px-4 py-3 ${colors.borderColor} ${colors.inputBg}`}
        >
          <span className={`text-sm ${colors.textMuted}`}>标签:</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className={`flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-amber-500/20 dark:text-amber-400`}
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder={tags.length === 0 ? "输入标签 (回车添加)" : ""}
            className="min-w-[120px] flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>

        {/* 工具栏 */}
        <Toolbar onAction={handleToolbarAction} />

        {/* 编辑区域 (Split Pane) */}
        <div className="flex min-h-[400px] flex-1">
          {/* 左侧：编辑器 */}
          <div
            className={`flex flex-1 flex-col ${showPreview ? "border-r" : ""} ${colors.borderColor}`}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在这里输入内容..."
              className={`flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none ${colors.textPrimary} placeholder:text-gray-400`}
              spellCheck={false}
            />
          </div>

          {/* 右侧：预览 (仅在大屏或切换时显示) */}
          {showPreview && (
            <div className="hidden flex-1 flex-col overflow-y-auto bg-gray-50/50 md:flex dark:bg-black/20">
              <SimpleMarkdownPreview content={content} />
            </div>
          )}
        </div>

        {/* 底部操作栏 - 使用 z-50 确保最顶层 */}
        <div
          className={`relative z-50 flex items-center justify-between border-t p-4 ${colors.borderColor} ${colors.inputBg}`}
        >
          <div className="flex gap-4 text-xs">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`hidden hover:underline md:block ${colors.textSecondary}`}
            >
              {showPreview ? "隐藏预览" : "显示预览 >>"}
            </button>
            <span className={colors.textMuted}>Markdown 支持中</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${colors.textSecondary} hover:bg-black/5 dark:hover:bg-white/5`}
            >
              取消
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium transition-colors ${colors.buttonPrimary} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isSubmitting ? (
                "发布中..."
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  发布话题
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
