import { CategoryOption } from "./types";

/**
 * 电影分类选项 (硬编码，与后端对应)
 */
export const FILM_CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "动作", value: "Action" },
  { label: "喜剧", value: "Comedy" },
  { label: "剧情", value: "Drama" },
  { label: "科幻", value: "Sci-Fi" },
  { label: "惊悚", value: "Thriller" },
  { label: "恐怖", value: "Horror" },
  { label: "爱情", value: "Romance" },
  { label: "动画", value: "Animation" },
  { label: "纪录片", value: "Documentary" },
];
