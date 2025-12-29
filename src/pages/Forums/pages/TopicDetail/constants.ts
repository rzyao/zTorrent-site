import { TopicData, SuggestedTopic } from "./types";

export const categoryColors: Record<string, string> = {
  Hardware: "#8C837C",
  "UI Design": "#0088CC",
  Javascript: "#F7DF1E",
  Announcements: "#E45735",
};

// 模拟 Discourse 风格的数据结构
export const topicData: TopicData = {
  id: "287",
  title: "Recommend a great YouTube video",
  category: "media",
  categoryColor: "bg-pink-200 text-pink-800",
  tags: ["video", "youtube"],
  createdAt: "May '13",
  views: 12456,
  replies: 28,
  participants: [
    {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=codinghorror",
      username: "codinghorror",
    },
    { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eviltrout", username: "eviltrout" },
    { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam", username: "sam" },
  ],
  stats: {
    created: "May '13",
    lastReply: "22h",
    replies: 28,
    views: "14.2k",
    users: 12,
    likes: 156,
    links: 12,
  },
  posts: [
    {
      id: "1",
      username: "codinghorror",
      name: "Jeff Atwood",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=codinghorror",
      role: "admin", // admin shield
      content: `
        <p>I spend a lot of time on YouTube. It's my primary source of entertainment these days.</p>
        <p>I thought it would be cool to have a thread where we recommend ONE great YouTube video that we think everyone should watch.</p>
        <p>The rules:</p>
        <ul>
          <li><strong>One video per post.</strong></li>
          <li>Include a short description of why it is great.</li>
          <li>Embed the video if possible!</li>
        </ul>
        <p>I'll start.</p>
      `,
      createdAt: "May '13",
      likes: 156,
      avatarSize: 45,
      isOp: true,
      stats: {
        created: "May '13",
        lastReply: "22h",
        replies: 28,
        views: "14.2k",
        users: 12,
        likes: 156,
        links: 12,
      },
    },
    {
      id: "2",
      username: "eviltrout",
      name: "Robin Ward",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eviltrout",
      content: `
        <p>This is one of my all time favorites. It's a short animation about a kiwi specifically bred to simulate a nugget.</p>
        <p>It is surprisingly touching.</p>
        <div class="my-4 aspect-video w-full max-w-lg bg-black/10 flex items-center justify-center rounded text-neutral-500">
          [Video Placeholder]
        </div>
      `,
      createdAt: "May '13",
      likes: 42,
      avatarSize: 45,
    },
    {
      id: "3",
      username: "sam",
      name: "Sam Saffron",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
      content: `
        <p>I really enjoyed this talk by <strong>Bret Victor</strong> regarding generic tools and how we conceptualize things.</p>
        <p>Highly recommended for any UI designer or programmer.</p>
      `,
      createdAt: "Jun '13",
      likes: 89,
      avatarSize: 45,
    },
    {
      id: "4",
      username: "system",
      name: "system",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system",
      isSmallAction: true,
      actionCode: "closed",
      content:
        "This topic was automatically closed after 30 days. New replies are no longer allowed.",
      createdAt: "Jul '13",
      likes: 0,
      avatarSize: 20,
    },
    {
      id: "5",
      username: "codinghorror",
      name: "Jeff Atwood",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=codinghorror",
      isSmallAction: true,
      actionCode: "opened",
      content: "This topic is now opened. Continuing the discussion.",
      createdAt: "Aug '14", // Late bump
      likes: 0,
      avatarSize: 20,
    },
  ],
};

export const suggestedTopics: SuggestedTopic[] = [
  {
    title: "What is the best keyboard for programming?",
    category: "Hardware",
    color: "#8C837C",
    tags: ["keyboard", "productivity"],
    replies: 45,
    views: "2.1k",
    activity: "1d",
    posters: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=codinghorror",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=eviltrout",
    ],
  },
  {
    title: "Dark mode implementation best practices",
    category: "UI Design",
    color: "#0088CC",
    tags: ["css", "dark-mode"],
    replies: 12,
    views: "800",
    activity: "4h",
    posters: ["https://api.dicebear.com/7.x/avataaars/svg?seed=ui"],
  },
  {
    title: "State management in 2024: Redux vs Zustand",
    category: "Javascript",
    color: "#F7DF1E",
    tags: ["react", "state"],
    replies: 89,
    views: "5.6k",
    activity: "22m",
    posters: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=redux",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=zustand",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=react",
    ],
  },
  {
    title: "Welcome to our new community forum!",
    category: "Announcements",
    color: "#E45735",
    tags: [],
    replies: 0,
    views: "145",
    activity: "1mo",
    posters: ["https://api.dicebear.com/7.x/avataaars/svg?seed=system"],
  },
];
