import { ForumCategory, ForumTag } from "@/api";

// 扩展类型以包含 ID（如果生成的 DTO 中缺少）
export type ExtendedForumCategory = ForumCategory & { id: string };
export type ExtendedForumTag = ForumTag & { id: string };
