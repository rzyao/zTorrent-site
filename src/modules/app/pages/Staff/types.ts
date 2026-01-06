export type StaffRole = 'owner' | 'admin' | 'moderator' | 'uploader' | 'support';

export type StaffStatus = 'online' | 'away' | 'offline';

export interface StaffMember {
  id: string;
  username: string;
  avatar: string;
  role: StaffRole;
  title: string;
  joinDate: string;
  responsibilities: string[];
  stats: {
    handledTickets?: number;
    approvedUploads?: number;
    bannedUsers?: number;
    solvedIssues?: number;
  };
  status: StaffStatus;
  bio?: string;
  contactAllowed: boolean;
}

import type { ReactNode } from 'react';

export interface RoleConfigItem {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: ReactNode;
}

export type RoleConfig = Record<StaffRole, RoleConfigItem>;

export type RoleStats = Record<'all' | StaffRole, number>;
