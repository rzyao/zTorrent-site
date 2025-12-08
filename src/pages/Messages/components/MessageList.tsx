import { Star } from 'lucide-react';
import type { Message } from '../types/types';

/**
 * 消息列表组件
 * - 纯展示列表，点击项触发选择
 */
export function MessageList({ messages, onSelect }: { messages: Message[]; onSelect: (msg: Message) => void }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-neutral-400">暂无消息</div>
    );
  }

  return (
    <div className="divide-y divide-neutral-700/50">
      {messages.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className="w-full text-left px-6 py-4 hover:bg-neutral-700/30 transition-colors focus:outline-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {m.starred && <Star className="w-4 h-4 text-amber-400" />}
              <span className={`text-sm ${m.read ? 'text-neutral-300' : 'text-white font-semibold'}`}>{m.from}</span>
              <span className={`text-sm ${m.read ? 'text-neutral-400' : 'text-neutral-200'}`}>• {m.subject}</span>
            </div>
            <span className="text-xs text-neutral-500">{m.timestamp}</span>
          </div>
          <div className="mt-2 line-clamp-2 text-sm text-neutral-400">{m.content}</div>
        </button>
      ))}
    </div>
  );
}

