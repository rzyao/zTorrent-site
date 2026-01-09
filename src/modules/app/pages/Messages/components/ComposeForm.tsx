import { useRef } from 'react';
import { Button } from '@/modules/app/components/ui/button';

/**
 * 新消息撰写表单
 * - 受控组件：所有状态由容器传入与回调更新
 */
export function ComposeForm({
  recipientId,
  subject,
  content,
  format,
  attachments,
  onRecipientChange,
  onSubjectChange,
  onContentChange,
  onFormatChange,
  onUploadImage,
  onCancel,
  onSend,
}: {
  recipientId: string;
  subject: string;
  content: string;
  format: 'plain' | 'markdown' | 'html';
  attachments: string[];
  onRecipientChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onFormatChange: (v: 'plain' | 'markdown' | 'html') => void;
  onUploadImage: (file: File) => void;
  onCancel: () => void;
  onSend: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-700/50 flex items-center justify-between">
        <h3 className="text-white text-lg">撰写新消息</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={onCancel}>取消</Button>
          <Button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white" onClick={onSend}>发送</Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* 收件人 */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">收件人用户 ID</label>
          <input
            value={recipientId}
            onChange={(e) => onRecipientChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900/50 border border-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            placeholder="例如：user_12345"
          />
        </div>

        {/* 主题 */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">主题（可选）</label>
          <input
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900/50 border border-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            placeholder="主题"
          />
        </div>

        {/* 正文 */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">正文</label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900/50 border border-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            placeholder="请输入内容"
          />
        </div>

        {/* 格式 */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">格式</label>
          <div className="flex items-center gap-2">
            {(['plain', 'markdown', 'html'] as const).map((f) => (
              <button
                key={f}
                onClick={() => onFormatChange(f)}
                className={`px-3 py-1 rounded-lg text-sm border ${format === f ? 'bg-neutral-700/60 text-white border-neutral-600' : 'text-neutral-300 border-neutral-700 hover:bg-neutral-700/40'}`}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 附件与图片上传 */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">附件</label>
          <div className="flex items-center gap-2 mb-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file);
              if (fileRef.current) fileRef.current.value = '';
            }} />
            <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={() => fileRef.current?.click()}>上传图片</Button>
          </div>
          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((url) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded bg-neutral-700/50 text-neutral-200 border border-neutral-600">
                  {url}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

