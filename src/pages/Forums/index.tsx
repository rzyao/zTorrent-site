import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ForumList } from "./components/ForumList";
import { TopicDetail } from "./components/TopicDetail";
import { ForumThemeProvider, useForumTheme } from "./context/ForumThemeContext";

function ForumContent() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, colors } = useForumTheme();

  // 根据主题选择滚动条样式类
  const scrollbarClass = theme === "dark" ? "scrollbar-forum-dark" : "scrollbar-forum-light";

  return (
    <div
      className={`h-screen overflow-y-scroll ${scrollbarClass} ${colors.pageBg} transition-colors duration-200`}
    >
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar: sticky 定位，独立滚动 */}
          <aside
            className={`${scrollbarClass} hidden lg:sticky lg:top-24 lg:col-span-3 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain`}
          >
            <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </aside>

          {/* Main Content: 使用页面滚动条 */}
          <main className="lg:col-span-9">
            {selectedTopic ? (
              <TopicDetail topicId={selectedTopic} onBack={() => setSelectedTopic(null)} />
            ) : (
              <ForumList
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onTopicClick={setSelectedTopic}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ForumPage() {
  return (
    <ForumThemeProvider>
      <ForumContent />
    </ForumThemeProvider>
  );
}
