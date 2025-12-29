import { useForumTheme } from "../context/ForumThemeContext";

/**
 * 发布话题页面
 * 创建新的论坛话题
 */
export function CreateTopicPage() {
  const { colors, theme } = useForumTheme();

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${colors.textPrimary}`}>发布新话题</h1>

      <div
        className={`${colors.cardBg} rounded-xl border p-6 ${colors.cardBorder} ${colors.shadow}`}
      >
        <form className="space-y-6">
          {/* 标题输入 */}
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
              话题标题
            </label>
            <input
              type="text"
              placeholder="输入话题标题..."
              className={`focus:ring-opacity-50 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${
                theme === "dark"
                  ? "placeholder:text-neutral-500 focus:ring-amber-500"
                  : "placeholder:text-gray-400 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* 分类选择 */}
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
              选择分类
            </label>
            <select
              className={`focus:ring-opacity-50 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${
                theme === "dark" ? "focus:ring-amber-500" : "focus:ring-blue-500"
              }`}
            >
              <option value="">请选择分类</option>
              <option value="tech">技术讨论</option>
              <option value="design">设计创意</option>
              <option value="gaming">游戏娱乐</option>
              <option value="music">音乐分享</option>
              <option value="learning">学习成长</option>
              <option value="competition">竞赛活动</option>
            </select>
          </div>

          {/* 内容输入 */}
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
              话题内容
            </label>
            <textarea
              rows={10}
              placeholder="输入话题内容..."
              className={`focus:ring-opacity-50 w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${
                theme === "dark"
                  ? "placeholder:text-neutral-500 focus:ring-amber-500"
                  : "placeholder:text-gray-400 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* 标签输入 */}
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
              标签 (用逗号分隔)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, 前端..."
              className={`focus:ring-opacity-50 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${
                theme === "dark"
                  ? "placeholder:text-neutral-500 focus:ring-amber-500"
                  : "placeholder:text-gray-400 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className={`rounded-lg px-6 py-2.5 transition-colors ${colors.buttonHover} ${colors.textSecondary}`}
            >
              取消
            </button>
            <button type="submit" className={`rounded-lg px-6 py-2.5 ${colors.buttonPrimary}`}>
              发布话题
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
