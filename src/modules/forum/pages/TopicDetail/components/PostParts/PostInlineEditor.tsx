import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForumsPostsService } from "@/api";
import { useForumTheme } from "../../../../context/ForumThemeContext";
import { cn } from "@/utils/cn";
import { ActionButton } from "@/modules/forum/components/ui/ActionButton";
import { RichTextEditor } from "@/modules/forum/components/Composer/RichTextEditor";

interface PostInlineEditorProps {
  postId: string;
  topicId: string;
  initialContent: string;
  onCancel: () => void;
  onSaved?: (newContent: string) => void;
}

export function PostInlineEditor({
  postId,
  topicId,
  initialContent,
  onCancel,
  onSaved,
}: PostInlineEditorProps) {
  const { colors } = useForumTheme();
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>(initialContent || "");
  const [loading, setLoading] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async () => {
      return ForumsPostsService.postsControllerUpdate({
        id: postId,
        content: value,
      } as any);
    },
    onSuccess: async () => {
      onSaved?.(value);
      await queryClient.invalidateQueries({ queryKey: ["forum", "posts", topicId] });
      await queryClient.invalidateQueries({ queryKey: ["forum", "topic", topicId] });
      onCancel();
    },
    onSettled: () => setLoading(false),
  });

  return (
    <div className={cn("rounded-md border p-2", colors.borderColor)}>
      <RichTextEditor
        value={value.trim().startsWith("<") ? value : value}
        onChange={(v) => setValue(v)}
        placeholder="编辑回复内容..."
        className="min-h-[160px]"
        isUploading={false}
        onImageUploadClick={() => {}}
        toolbarPrefix={null}
      />
      <div className="mt-2 flex gap-2">
        <ActionButton
          onClick={() => {
            if (loading) return;
            setLoading(true);
            updateMutation.mutate();
          }}
          loading={loading}
          className="h-9 px-4"
        >
          保存更改
        </ActionButton>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-md px-4 text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          取消
        </button>
      </div>
    </div>
  );
}
