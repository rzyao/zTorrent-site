import { useState, useMemo } from 'react';
import type { StaffMember, RoleStats, StaffRole } from '../types';

export function useStaffFilters(members: StaffMember[]) {
  const [selectedRole, setSelectedRole] = useState<'all' | StaffRole>('all');

  const filteredMembers = useMemo(() => (
    selectedRole === 'all' ? members : members.filter(m => m.role === selectedRole)
  ), [members, selectedRole]);

  const roleStats: RoleStats = useMemo(() => ({
    all: members.length,
    owner: members.filter(m => m.role === 'owner').length,
    admin: members.filter(m => m.role === 'admin').length,
    moderator: members.filter(m => m.role === 'moderator').length,
    uploader: members.filter(m => m.role === 'uploader').length,
    support: members.filter(m => m.role === 'support').length,
  }), [members]);

  return { selectedRole, setSelectedRole, filteredMembers, roleStats };
}

