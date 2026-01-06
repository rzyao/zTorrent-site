import { UserPlus, Star, Gift, Zap } from 'lucide-react';

export function getIconByKey(key: string) {
  switch (key) {
    case 'invite_code':
      return UserPlus;
    case 'vip_1m':
    case 'vip_3m':
      return Star;
    case 'upload_quota':
      return Gift;
    case 'download_coupon':
      return Zap;
    default:
      return Gift;
  }
}

