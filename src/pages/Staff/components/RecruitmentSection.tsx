import { TrendingUp, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RecruitmentSection() {
  return (
    <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm border border-neutral-700/50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-white text-2xl mb-3">加入管理组</h2>
        <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
          我们一直在寻找热心、负责、有能力的成员加入管理团队。如果您愿意为站点的发展贡献力量，欢迎申请加入我们！
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50">
            <h4 className="text-white mb-2">版主</h4>
            <p className="text-neutral-400 text-sm">活跃、有责任心、熟悉相关分区</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50">
            <h4 className="text-white mb-2">上传组</h4>
            <p className="text-neutral-400 text-sm">有制作经验、资源丰富、质量保证</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50">
            <h4 className="text-white mb-2">客服</h4>
            <p className="text-neutral-400 text-sm">耐心友善、熟悉规则、在线时间充足</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25">
          <Mail className="w-4 h-4 mr-2" />
          提交申请
        </Button>
      </div>
    </div>
  );
}

