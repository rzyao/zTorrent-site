import { Shield, CheckCircle2, MessageCircle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function IntroBanner() {
  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-amber-400 mb-2">关于管理组</h3>
          <p className="text-neutral-300 text-sm leading-relaxed mb-3">
            管理组成员致力于维护站点秩序、提升用户体验、保证资源质量。如果您在使用过程中遇到任何问题或有任何建议，欢迎联系相应的管理人员。
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              7x24小时服务
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400">
              <MessageCircle className="w-3 h-3 mr-1" />
              快速响应
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400">
              <Award className="w-3 h-3 mr-1" />
              专业团队
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

