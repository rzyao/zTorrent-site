import { Clock, Reply } from "lucide-react";
import { PostData } from "../../types";

interface PostSmallActionProps {
  post: PostData;
}

export function PostSmallAction({ post }: PostSmallActionProps) {
  return (
    <div className="flex items-center gap-3 py-4 pl-[60px] text-sm text-neutral-500">
      {/* 这里的 id 判断只是示例，实际业务可能有专门的 type 字段 */}
      {post.id === "4" && <Clock className="h-4 w-4" />}
      {post.id === "5" && <Reply className="h-4 w-4" />}
      <span>{post.content}</span>
    </div>
  );
}
