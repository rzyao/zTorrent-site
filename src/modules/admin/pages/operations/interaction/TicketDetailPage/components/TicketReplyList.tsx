import { formatDate } from "@/modules/admin/utils/formatDate";
import { Paperclip } from "lucide-react";

interface TicketReplyListProps {
  replies: any[];
}

export function TicketReplyList({ replies }: TicketReplyListProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 border-b p-6">
        <h3 className="leading-none font-semibold tracking-tight">历史回复</h3>
      </div>
      <div className="p-6">
        {!replies || replies.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-sm">暂无回复</div>
        ) : (
          <div className="space-y-6">
            {replies.map((it: any, index: number) => (
              <div
                key={it.id || index}
                className="border-border flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">{it.userName}</span>
                  <span>{formatDate(it.createdAt)}</span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{it?.content}</div>
                {Array.isArray(it?.attachments) && it.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {it.attachments.map((a: any) => (
                      <a
                        key={a.attachmentId}
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors"
                      >
                        <Paperclip className="h-3 w-3" />
                        {a.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
