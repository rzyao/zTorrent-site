import { Calendar, Mail } from 'lucide-react';
import { Badge } from '@/modules/app/components/ui/badge';
import { Button } from '@/modules/app/components/ui/button';
import { Separator } from '@/modules/app/components/ui/separator';
import type { StaffMember, RoleConfig } from '../types';
import { getStatusConfig } from '../hooks/useStatusConfig';

interface StaffCardProps {
  member: StaffMember;
  roleConfig: RoleConfig;
}

export function StaffCard({ member, roleConfig }: StaffCardProps) {
  const roleInfo = roleConfig[member.role];
  const statusInfo = getStatusConfig(member.status);

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:border-amber-500/30 transition-all group">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img src={member.avatar} alt={member.username} className="w-16 h-16 rounded-xl object-cover" />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusInfo.color} rounded-full border-2 border-neutral-900 flex items-center justify-center`}>
            {statusInfo.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white truncate mb-1">{member.username}</h3>
          <Badge className={`${roleInfo.bgColor} ${roleInfo.textColor} text-xs mb-2`}>
            {roleInfo.icon}
            <span className="ml-1">{member.title}</span>
          </Badge>
          <p className="text-neutral-500 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            加入于 {member.joinDate}
          </p>
        </div>
      </div>

      {member.bio && (
        <p className="text-neutral-400 text-sm mb-4 leading-relaxed">{member.bio}</p>
      )}

      <div className="mb-4">
        <h4 className="text-neutral-400 text-xs uppercase tracking-wide mb-2">职责范围</h4>
        <div className="flex flex-wrap gap-2">
          {member.responsibilities.map((resp, index) => (
            <Badge key={index} className="bg-neutral-700/50 text-neutral-300 text-xs">{resp}</Badge>
          ))}
        </div>
      </div>

      <Separator className="bg-neutral-700/50 mb-4" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        {member.stats.handledTickets !== undefined && (
          <div className="text-center p-3 rounded-lg bg-neutral-900/30">
            <div className="text-amber-400 text-lg">{member.stats.handledTickets}</div>
            <div className="text-neutral-500 text-xs mt-1">处理工单</div>
          </div>
        )}
        {member.stats.approvedUploads !== undefined && (
          <div className="text-center p-3 rounded-lg bg-neutral-900/30">
            <div className="text-green-400 text-lg">{member.stats.approvedUploads}</div>
            <div className="text-neutral-500 text-xs mt-1">审核上传</div>
          </div>
        )}
        {member.stats.bannedUsers !== undefined && (
          <div className="text-center p-3 rounded-lg bg-neutral-900/30">
            <div className="text-red-400 text-lg">{member.stats.bannedUsers}</div>
            <div className="text-neutral-500 text-xs mt-1">处理违规</div>
          </div>
        )}
        {member.stats.solvedIssues !== undefined && (
          <div className="text-center p-3 rounded-lg bg-neutral-900/30">
            <div className="text-blue-400 text-lg">{member.stats.solvedIssues}</div>
            <div className="text-neutral-500 text-xs mt-1">解决问题</div>
          </div>
        )}
      </div>

      {member.contactAllowed && (
        <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white" size="sm">
          <Mail className="w-4 h-4 mr-2" />
          发送消息
        </Button>
      )}
    </div>
  );
}

