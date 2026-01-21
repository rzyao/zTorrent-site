import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import {
  statusText,
  statusColor,
  categoryText,
  priorityText,
  priorityColor,
} from "../../TicketsPage/constants";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";

interface TicketInfoProps {
  id: string;
  detail: any;
  loading: boolean;
  onBack: () => void;
  onClose: () => void;
  onResolve: () => void;
}

export function TicketInfo({ id, detail, loading, onBack, onClose, onResolve }: TicketInfoProps) {
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 border-b p-6">
        <div className="flex items-center justify-between">
          <div className="text-lg leading-none font-semibold tracking-tight">工单详情 #{id}</div>
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={onBack}>
              返回
            </Button>
            <Button
              variant="primary"
              danger
              size="small"
              disabled={detail?.status === "closed"}
              onClick={() => setCloseConfirmOpen(true)}
            >
              关闭工单
            </Button>
            <Button
              variant="default"
              size="small"
              disabled={detail?.status !== "resolved"}
              onClick={onResolve}
            >
              确认已解决
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 space-y-1">
            <span className="text-muted-foreground text-sm font-medium">标题</span>
            <div className="text-sm font-medium">{detail?.title}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-sm font-medium">状态</span>
            <div>
              <Tag color={statusColor[detail?.status]}>
                {statusText[detail?.status] || detail?.status}
              </Tag>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-sm font-medium">优先级</span>
            <div>
              <Tag color={priorityColor[detail?.priority]}>
                {priorityText[detail?.priority] || detail?.priority}
              </Tag>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-sm font-medium">类别</span>
            <div className="text-sm">{categoryText[detail?.category] || detail?.category}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-sm font-medium">创建人</span>
            <div className="text-sm">{detail?.createdBy}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-sm font-medium">创建时间</span>
            <div className="text-sm">{detail?.createdAt}</div>
          </div>
        </div>
      </div>

      <Modal
        open={closeConfirmOpen}
        onClose={() => setCloseConfirmOpen(false)}
        title="确认关闭"
        width={400}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setCloseConfirmOpen(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              danger
              onClick={() => {
                onClose();
                setCloseConfirmOpen(false);
              }}
            >
              确认关闭
            </Button>
          </div>
        }
      >
        <div className="py-4">确认要关闭该工单吗？此操作不可逆。</div>
      </Modal>
    </div>
  );
}
