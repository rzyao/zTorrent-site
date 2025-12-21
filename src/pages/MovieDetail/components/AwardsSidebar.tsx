import { Badge } from '@/components/ui/badge';
import { Award, Star } from 'lucide-react';
import type { AwardItem } from '../types';

/**
 * AwardsSidebar 组件
 * - 右侧获奖情况展示
 */
export function AwardsSidebar({ awards }: { awards: AwardItem[] }) {
  if (!awards || awards.length === 0) return null;
  return (
    <div className="lg:col-span-1">
      <h2 className="text-white text-2xl mb-4 flex items-center gap-2">
        <Award className="w-6 h-6 text-yellow-400" />
        获奖情况
      </h2>
      <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-2">
        <div className="space-y-4">
          {awards.map((award, index) => (
            <div key={index} className="flex items-start gap-3 py-1 border-b border-gray-800 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${award.won ? 'bg-yellow-500/20' : 'bg-gray-800'}`}>
                {award.won ? <Award className="w-4 h-4 text-yellow-400" /> : <Star className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-white text-sm">{award.name}</h3>
                  <Badge className={award.won ? 'bg-yellow-500 text-white text-xs' : 'bg-gray-700 text-gray-300 text-xs'}>{award.won ? '获奖' : '提名'}</Badge>
                  <span className="text-gray-500 text-xs">{award.year}</span>
                </div>
                <p className="text-gray-400 text-xs mb-1">{award.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

