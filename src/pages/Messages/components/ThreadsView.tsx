import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { IMessage, IThreadSummary } from '../types/types';

/**
 * 会话视图
 * - 左侧：会话列表
 * - 右侧：时间线与回复框
 */
export function ThreadsView({
  activePeerUserId,
  threadSummaries,
  threadMessages,
  replyContent,
  replyFormat,
  replyAttachments,
  replyToMessageId,
  onBackToList,
  onSelectThread,
  onLoadThreadMessages,
  onSetReplyToMessageId,
  onReplyContentChange,
  onReplyFormatChange,
  onUploadImage,
  onClearReply,
  onSendReply,
}: {
  activePeerUserId: string | null;
  threadSummaries: IThreadSummary[];
  threadMessages: IMessage[];
  replyContent: string;
  replyFormat: 'plain' | 'markdown' | 'html';
  replyAttachments: string[];
  replyToMessageId: string | null;
  onBackToList: () => void;
  onSelectThread: (peerUserId: string) => void;
  onLoadThreadMessages: (peerUserId: string) => Promise<void> | void;
  onSetReplyToMessageId: (id: string | null) => void;
  onReplyContentChange: (v: string) => void;
  onReplyFormatChange: (v: 'plain' | 'markdown' | 'html') => void;
  onUploadImage: (file: File) => void;
  onClearReply: () => void;
  onSendReply: () => void;
}) {
  // 当选中某会话时，加载其消息
  useEffect(() => {
    if (activePeerUserId) onLoadThreadMessages(activePeerUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeerUserId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {/* 左侧：会话列表 */}
      <div className="md:border-r border-neutral-700/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h4 className="text-white">会话</h4>
          {activePeerUserId && (
            <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={onBackToList}>返回列表</Button>
          )}
        </div>
        <div className="divide-y divide-neutral-700/50">
          {threadSummaries.map((t) => (
            <button
              key={t.peerUserId}
              onClick={() => onSelectThread(t.peerUserId)}
              className={`w-full text-left px-4 py-3 hover:bg-neutral-700/30 ${activePeerUserId === t.peerUserId ? 'bg-neutral-700/40' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-neutral-200">{t.peerUserId}</div>
                <div className="text-xs text-neutral-500">{new Date(t.lastMessageAt).toLocaleString()}</div>
              </div>
              {t.unread > 0 && <div className="text-xs text-red-400 mt-1">未读：{t.unread}</div>}
            </button>
          ))}
          {threadSummaries.length === 0 && (
            <div className="px-4 py-6 text-neutral-400">暂无会话</div>
          )}
        </div>
      </div>

      {/* 右侧：时间线与回复 */}
      <div className="md:col-span-2">
        {!activePeerUserId ? (
          <div className="px-6 py-12 text-center text-neutral-400">请选择左侧一个会话</div>
        ) : (
          <div className="p-6 space-y-4">
            {/* 时间线 */}
            <div className="space-y-3">
              {threadMessages.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
                  <div className="flex items-center justify-between">
                    <div className="text-neutral-200">{m.senderId}</div>
                    <div className="text-xs text-neutral-500">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-neutral-300 whitespace-pre-wrap">{m.content}</div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => onSetReplyToMessageId(m.id)}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      回复此条
                    </button>
                  </div>
                </div>
              ))}
              {threadMessages.length === 0 && (
                <div className="text-neutral-400">暂无消息</div>
              )}
            </div>

            {/* 回复编辑器 */}
            <div className="p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
              {replyToMessageId && (
                <div className="text-xs text-neutral-400 mb-2">回复目标：{replyToMessageId}</div>
              )}
              <textarea
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                rows={5}
                placeholder="输入回复内容"
                className="w-full px-3 py-2 rounded-lg bg-neutral-900/50 border border-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <div className="mt-2 flex items-center gap-2">
                {(['plain', 'markdown', 'html'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => onReplyFormatChange(f)}
                    className={`px-3 py-1 rounded-lg text-sm border ${replyFormat === f ? 'bg-neutral-700/60 text-white border-neutral-600' : 'text-neutral-300 border-neutral-700 hover:bg-neutral-700/40'}`}
                    type="button"
                  >
                    {f}
                  </button>
                ))}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUploadImage(file);
                    e.currentTarget.value = '';
                  }}
                />
              </div>
              {replyAttachments && replyAttachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {replyAttachments.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded bg-neutral-700/50 text-neutral-200 border border-neutral-600">
                      {url}
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={onClearReply}>清空</Button>
                <Button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white" onClick={onSendReply}>发送回复</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

