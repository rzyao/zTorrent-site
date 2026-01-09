import { Users } from 'lucide-react';
import { Badge } from '@/modules/app/components/ui/badge';
import type { RoleConfig, RoleStats } from '../types';

interface RoleFilterProps {
  selectedRole: keyof RoleStats;
  setSelectedRole: (role: keyof RoleStats) => void;
  roleConfig: RoleConfig;
  roleStats: RoleStats;
}

export function RoleFilter({ selectedRole, setSelectedRole, roleConfig, roleStats }: RoleFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button
        onClick={() => setSelectedRole('all')}
        className={`px-6 py-3 rounded-xl transition-all ${selectedRole === 'all'
          ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
          : 'bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-700/50 border border-neutral-700'
          }`}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>全部</span>
          <Badge className="bg-neutral-900/50 text-neutral-300">{roleStats.all}</Badge>
        </div>
      </button>

      {Object.entries(roleConfig).map(([role, config]) => (
        <button
          key={role}
          onClick={() => setSelectedRole(role as keyof RoleStats)}
          className={`px-6 py-3 rounded-xl transition-all ${selectedRole === role
            ? `bg-linear-to-r ${config.color} text-white shadow-lg`
            : `${config.bgColor} ${config.textColor} hover:opacity-80 border ${config.borderColor}`
            }`}
        >
          <div className="flex items-center gap-2">
            {config.icon}
            <span>{config.label}</span>
            <Badge className={selectedRole === role ? 'bg-white/20 text-white' : 'bg-neutral-900/50 text-neutral-300'}>
              {roleStats[role as keyof RoleStats]}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  );
}

