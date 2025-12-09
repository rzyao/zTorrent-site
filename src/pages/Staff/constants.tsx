import { Crown, Shield, Star, Award, MessageCircle } from 'lucide-react';
import type { RoleConfig } from './types';

export const roleConfig: RoleConfig = {
  owner: {
    label: '站长',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    icon: <Crown className="w-4 h-4" />,
  },
  admin: {
    label: '管理员',
    color: 'from-red-500 to-orange-600',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    icon: <Shield className="w-4 h-4" />,
  },
  moderator: {
    label: '版主',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    icon: <Star className="w-4 h-4" />,
  },
  uploader: {
    label: '上传组',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    icon: <Award className="w-4 h-4" />,
  },
  support: {
    label: '客服组',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    icon: <MessageCircle className="w-4 h-4" />,
  },
};

