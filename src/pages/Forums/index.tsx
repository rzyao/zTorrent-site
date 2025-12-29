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
  const { colors } = useForumTheme();

  return (
    <div className={`min-h-screen ${colors.pageBg} transition-colors duration-200`}>
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </aside>

          {/* Main Content */}
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
