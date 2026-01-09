import { useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  User,
  Download,
  Flag,
  Info,
  Paperclip,
} from 'lucide-react';
import { Badge } from '@/modules/app/components/ui/badge';
import { Button } from '@/modules/app/components/ui/button';
import { Input } from '@/modules/app/components/ui/input';
import { Textarea } from '@/modules/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/app/components/ui/select';
import { useTickets } from '@/modules/app/pages/Tickets/hooks/useTickets';

interface CreateTicketViewProps {
  onBack: () => void;
  onCreate: () => void;
}

export function CreateTicketView({ onBack, onCreate }: CreateTicketViewProps) {
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('technical');
  const [newTicketPriority, setNewTicketPriority] = useState('normal');
  const [newTicketContent, setNewTicketContent] = useState('');
  const { createTicket } = useTickets();

  const categoryConfig = {
    technical: {
      label: '技术问题',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    account: {
      label: '账号问题',
      icon: <User className="w-4 h-4" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    resource: {
      label: '资源问题',
      icon: <Download className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    report: {
      label: '投诉举报',
      icon: <Flag className="w-4 h-4" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    other: {
      label: '其他问题',
      icon: <Info className="w-4 h-4" />,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-500/20',
    },
  };

  const priorityConfig = {
    low: { label: '低', color: 'text-neutral-400', bgColor: 'bg-neutral-500/20' },
    normal: { label: '中', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    high: { label: '高', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    urgent: { label: '紧急', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  };

  const handleCreateTicket = async () => {
    await createTicket({
      title: newTicketTitle,
      category: newTicketCategory,
      priority: newTicketPriority,
      content: newTicketContent,
    } as any);
    onCreate();
  };

  return (
    <div>
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-8">
        <h2 className="text-white text-2xl mb-6">创建新工单</h2>

        <div className="space-y-6">
          <div>
            <label className="text-neutral-300 text-sm mb-2 block">工单标题 <span className="text-red-400">*</span></label>
            <Input value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} placeholder="简要描述您的问题" className="bg-neutral-900/50 border-neutral-700 text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-neutral-300 text-sm mb-2 block">问题分类 <span className="text-red-400">*</span></label>
              <Select value={newTicketCategory} onValueChange={setNewTicketCategory}>
                <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">{config.icon}{config.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-neutral-300 text-sm mb-2 block">优先级</label>
              <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-neutral-300 text-sm mb-2 block">详细描述 <span className="text-red-400">*</span></label>
            <Textarea value={newTicketContent} onChange={(e) => setNewTicketContent(e.target.value)} placeholder="请详细描述您遇到的问题,包括相关的错误信息、截图等..." className="bg-neutral-900/50 border-neutral-700 text-white min-h-[200px]" />
            <p className="text-neutral-500 text-xs mt-2">提供详细信息有助于我们更快地解决您的问题</p>
          </div>

          <div>
            <label className="text-neutral-300 text-sm mb-2 block">附件（可选）</label>
            <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
              <Paperclip className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <p className="text-neutral-400 text-sm">点击上传截图或相关文件</p>
              <p className="text-neutral-600 text-xs mt-1">支持 JPG、PNG、PDF,最大 10MB</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button onClick={onBack} variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">取消</Button>
            <Button onClick={handleCreateTicket} disabled={!newTicketTitle || !newTicketContent} className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">提交工单</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
