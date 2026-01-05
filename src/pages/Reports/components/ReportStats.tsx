import { AlertCircle, CheckCircle, XCircle, Inbox } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface StatsCardProps {
  label: string;
  value: number;
  icon: any;
  color: string;
}

function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-[#1a1f26] p-4">
      <div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value || 0}</p>
      </div>
      <div className={cn("bg-opacity-10 rounded-lg p-3", color)}>
        <Icon className={cn("h-6 w-6", color.replace("bg-", "text-"))} />
      </div>
    </div>
  );
}

interface ReportStatsProps {
  stats?: { pending: number; resolved: number; rejected: number; total: number };
}

export function ReportStats({ stats }: ReportStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatsCard
        label="待处理"
        value={stats?.pending || 0}
        icon={AlertCircle}
        color="bg-amber-500/10 text-amber-500"
      />
      <StatsCard
        label="已处理"
        value={stats?.resolved || 0}
        icon={CheckCircle}
        color="bg-green-500/10 text-green-500"
      />
      <StatsCard
        label="已驳回"
        value={stats?.rejected || 0}
        icon={XCircle}
        color="bg-red-500/10 text-red-500"
      />
      <StatsCard
        label="总举报"
        value={stats?.total || 0}
        icon={Inbox}
        color="bg-blue-500/10 text-blue-500"
      />
    </div>
  );
}
