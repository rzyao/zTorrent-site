import { Sparkles, Gift, Shield, Users } from 'lucide-react';
import type { StoreItem } from '@/api/custom/store';

export function AcquireSection({
  quotaItems,
  magicPoints,
  permanentQty,
  tempQty,
  onPermanentQtyChange,
  onTempQtyChange,
  onPurchasePermanent,
  onPurchaseTemp,
}: {
  quotaItems: { invite_quota?: StoreItem; temp_invite_quota?: StoreItem };
  magicPoints: number;
  permanentQty: number;
  tempQty: number;
  onPermanentQtyChange: (v: number) => void;
  onTempQtyChange: (v: number) => void;
  onPurchasePermanent: () => Promise<void> | void;
  onPurchaseTemp: () => Promise<void> | void;
}) {
  const permanentDisabled = !quotaItems.invite_quota || quotaItems.invite_quota.status !== 'active' || (quotaItems.invite_quota && Number(quotaItems.invite_quota.pricePoints) * permanentQty > magicPoints);
  const tempDisabled = !quotaItems.temp_invite_quota || quotaItems.temp_invite_quota.status !== 'active' || (quotaItems.temp_invite_quota && Number(quotaItems.temp_invite_quota.pricePoints) * tempQty > magicPoints);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">购买永久邀请名额</h3>
              <p className="text-neutral-400 text-sm">购买后永久增加可用邀请名额</p>
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">价格</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xl">{quotaItems.invite_quota?.pricePoints ?? '-'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">您的魔力值</span>
              <span className="text-white">{magicPoints.toLocaleString()}</span>
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">数量</label>
              <input type="number" min={1} value={permanentQty} onChange={(e) => onPermanentQtyChange(Math.max(1, Number(e.target.value || 1)))} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500" />
            </div>
            {quotaItems.invite_quota && Number(quotaItems.invite_quota.pricePoints) * permanentQty > magicPoints && (
              <div className="text-red-400 text-sm mt-2">余额不足，请先获取更多魔力值</div>
            )}
          </div>
          <button disabled={permanentDisabled} onClick={() => onPurchasePermanent()} className={`w-full py-3 rounded-lg ${permanentDisabled ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20'} flex items-center justify-center gap-2`}>
            <span>购买永久名额</span>
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">购买临时邀请名额</h3>
              <p className="text-neutral-400 text-sm">购买后增加临时邀请名额（存在有效期）</p>
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">价格</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xl">{quotaItems.temp_invite_quota?.pricePoints ?? '-'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">您的魔力值</span>
              <span className="text-white">{magicPoints.toLocaleString()}</span>
            </div>
            <div>
              <label className="block text-neutral-400 text-sm mb-1">数量</label>
              <input type="number" min={1} value={tempQty} onChange={(e) => onTempQtyChange(Math.max(1, Number(e.target.value || 1)))} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500" />
            </div>
            {quotaItems.temp_invite_quota && Number(quotaItems.temp_invite_quota.pricePoints) * tempQty > magicPoints && (
              <div className="text-red-400 text-sm mt-2">余额不足，请先获取更多魔力值</div>
            )}
          </div>
          <button disabled={tempDisabled} onClick={() => onPurchaseTemp()} className={`w-full py-3 rounded-lg ${tempDisabled ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20'} flex items-center justify-center gap-2`}>
            <span>购买临时名额</span>
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-green-500/30 transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-7 h-7 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">系统赠送</h3>
              <p className="text-neutral-400 text-sm">达成成就可获得免费邀请码</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
              <span className="text-neutral-300 text-sm">上传量达到 10TB</span>
              <span className="text-green-400 text-sm">+2 邀请码</span>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
              <span className="text-neutral-300 text-sm">分享率达到 3.0</span>
              <span className="text-green-400 text-sm">+1 邀请码</span>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
              <span className="text-neutral-300 text-sm">注册满1年</span>
              <span className="text-green-400 text-sm">+3 邀请码</span>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-neutral-800 text-neutral-400 cursor-not-allowed">自动发放</button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">VIP特权</h3>
              <p className="text-neutral-400 text-sm">VIP会员每月赠送邀请码</p>
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-neutral-300">普通VIP</span>
              <span className="text-purple-400">+5 邀请码/月</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">高级VIP</span>
              <span className="text-purple-400">+10 邀请码/月</span>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/20">升级VIP</button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">邀请返利</h3>
              <p className="text-neutral-400 text-sm">被邀请人达标可获得奖励</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="bg-neutral-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-300 text-sm">被邀请人上传达 1TB</span>
                <span className="text-blue-400 text-sm">+1 邀请码</span>
              </div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-300 text-sm">被邀请人升级VIP</span>
                <span className="text-blue-400 text-sm">+2 邀请码</span>
              </div>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-neutral-800 text-neutral-400 cursor-not-allowed">自动发放</button>
        </div>
      </div>
    </div>
  );
}
