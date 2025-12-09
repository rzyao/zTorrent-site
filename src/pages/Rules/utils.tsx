import React from 'react';
import { BookOpen, Download, Upload, Award, Gift, Users, AlertTriangle, Info } from 'lucide-react';

/**
 * 根据章节 id 返回对应的图标组件
 */
export const getIconBySection = (id: string): React.ReactElement => {
  const iconClass = 'w-5 h-5';
  switch (id) {
    case 'general':
      return <BookOpen className={iconClass} />;
    case 'download':
      return <Download className={iconClass} />;
    case 'upload':
      return <Upload className={iconClass} />;
    case 'points':
      return <Award className={iconClass} />;
    case 'vip':
      return <Gift className={iconClass} />;
    case 'community':
      return <Users className={iconClass} />;
    case 'violations':
      return <AlertTriangle className={iconClass} />;
    case 'special':
      return <Info className={iconClass} />;
    default:
      return <BookOpen className={iconClass} />;
  }
};

