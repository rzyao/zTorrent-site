import { Gift, Sparkles } from 'lucide-react';
import type { StoreItem } from '@/api/custom/store';
import { getIconByKey } from '../utils';

export function ShopGrid({
  items,
  loading,
  error,
  onPurchase,
}: {
  items: StoreItem[];
  loading: boolean;
  error: string | null;
  onPurchase: (item: StoreItem) => void;
}) {
  return (
    <div>
      <div className="bg-linear-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg mb-2">魔力商城</h3>
            <p className="text-neutral-400 text-sm">使用魔力值兑换各种特权和奖励。库存有限，先到先得！</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="col-span-full text-neutral-400">正在加载商城商品...</div>}
        {error && !loading && <div className="col-span-full text-red-400">{error}</div>}
        {!loading && !error && items.length === 0 && <div className="col-span-full text-neutral-400">暂无上架商品</div>}
        {!loading && !error && items.map((item) => (
          <div key={item.id} className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/10">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center shrink-0">
                  {(() => { const Icon = getIconByKey(item.key); return <Icon className="w-7 h-7 text-amber-400" />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-sm">类型：{item.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xl">{item.pricePoints}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.status === 'active' ? '可购买' : '暂不可购买'}</span>
              </div>
              <button className={`w-full py-2.5 rounded-lg text-white transition-all shadow-lg shadow-amber-500/20 ${item.status === 'active' ? 'bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : 'bg-neutral-700 cursor-not-allowed'}`} disabled={item.status !== 'active'} onClick={() => onPurchase(item)}>购买</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
