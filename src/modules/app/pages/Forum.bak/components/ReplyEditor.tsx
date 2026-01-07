// @ts-nocheck
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '../RichTextEditor';

interface ReplyEditorProps {
  content: string;
  onChange: (val: string | ((prev: string) => string)) => void; // Support functional update if needed, but mostly string
  replyParentId: string | null;
  replyParentUser?: string;
  onCancelReply: () => void;
  onSubmit: () => void;
  isLocked?: boolean;
  error?: string | null;
}

export function ReplyEditor({
  content,
  onChange,
  replyParentId,
  replyParentUser,
  onCancelReply,
  onSubmit,
  isLocked,
  error
}: ReplyEditorProps) {
  return (
    <div className="border-t border-neutral-700/50 p-6" id="reply-editor">
      {replyParentId && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-neutral-400">
            正在回复：@
            {replyParentUser}
          </span>
          <button
            className="text-xs text-neutral-400 hover:text-white"
            onClick={onCancelReply}
          >取消</button>
        </div>
      )}
      <RichTextEditor
        value={content}
        onChange={onChange}
        placeholder="写下你的回复，支持Markdown格式和图�?.."
        minHeight="150px"
      />
      <div className="flex justify-end mt-4">
        <Button
          className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
          disabled={isLocked}
          onClick={onSubmit}
        >
          <Send className="w-4 h-4 mr-2" />
          发送回�?
        </Button>
      </div>
      {isLocked && (
        <p className="text-red-400 text-sm mt-2">该主题已锁定，禁止回�?/p>
      )}
      {error && (
         <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

