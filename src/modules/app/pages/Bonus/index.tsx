import { useState, useEffect } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import type { StoreItem } from '@/api/custom/store';
import { getBonusBalance } from '@/api/custom/bonus';
import { getProfile } from '@/api/custom/auth';
import { usePurchase } from '@/hooks/usePurchase';
import { PurchaseSuccessModal } from '@/components/purchase/PurchaseSuccessModal';
import { BonusHeader } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { EarnMethods } from './components/EarnMethods';
import { RecordsSection } from './components/RecordsSection';
import { ShopGrid } from './components/ShopGrid';
import { useBonusOverview } from './hooks/useBonusOverview';
import { useBonusLedger } from './hooks/useBonusLedger';
import { useStoreItems } from './hooks/useStoreItems';
import { PurchaseDialog } from './components/PurchaseDialog';
import type { MagicRecord } from './types';



export default function BonusPage() {
  useDynamicTitle('魔力值');
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'shop'>('overview');

  const { overview } = useBonusOverview(activeTab === 'overview');

  const { records, loading: recordsLoading, error: recordsError, filterType, setFilterType } = useBonusLedger(activeTab === 'records');



  // 魔力值商城
  /**
   * 从后端加载商城商品列表（GET /store/items）
   * 保留原有样式，仅替换数据来源与状态处理
   */
  const { items: storeItems, loading: itemsLoading, error: itemsError } = useStoreItems(activeTab === 'shop');
  // 购买弹窗 & 表单状态
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<{ userId?: string; itemKey: string; quantity: number; payload?: Record<string, any> } | null>(null);
  const { purchase, lastSuccess, clearLastSuccess } = usePurchase();
  const [successOpen, setSuccessOpen] = useState(false);



  // 打开购买弹窗时加载余额与用户ID
  useEffect(() => {
    if (!purchaseOpen) return;
    setErrorMsg(null);
    setResultCode(null);
    setSubmitting(false);
    setQuantity(1);
    getBonusBalance()
      .then((b) => {
        const raw = (b as any)?.balance ?? (b as any)?.points ?? 0;
        const val = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
        setBalance(Number.isFinite(val) ? val : null);
      })
      .catch(() => setBalance(null));
    getProfile()
      .then((data: any) => {
        const id = String(data?.user?.id ?? data?.user?._id ?? data?.sub ?? '');
        setUserId(id || undefined);
      })
      .catch(() => setUserId(undefined));
  }, [purchaseOpen]);







  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <BonusHeader />

        <OverviewCards overview={overview} />

        {/* 标签栏 */}
        <div className="flex gap-2 mb-6 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 transition-all ${activeTab === 'overview'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            获取方式
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 transition-all ${activeTab === 'records'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            收支记录
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-6 py-3 transition-all ${activeTab === 'shop'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            魔力商城
          </button>
        </div>

        {activeTab === 'overview' && <EarnMethods />}

        {activeTab === 'records' && (
          <RecordsSection
            records={records as MagicRecord[]}
            loading={recordsLoading}
            error={recordsError}
            filterType={filterType}
            onFilterChange={setFilterType}
          />
        )}

        {activeTab === 'shop' && (
          <ShopGrid
            items={storeItems}
            loading={itemsLoading}
            error={itemsError}
            onPurchase={(item) => { try { console.info('[store_item_click]', { key: item.key, pricePoints: item.pricePoints }); } catch { } setSelectedItem(item); setPurchaseOpen(true); }}
          />
        )}

        <PurchaseDialog
          open={purchaseOpen}
          onOpenChange={setPurchaseOpen}
          selectedItem={selectedItem}
          email={email}
          onEmailChange={setEmail}
          quantity={quantity}
          onQuantityChange={(v) => setQuantity(v)}
          balance={balance}
          submitting={submitting}
          errorMsg={errorMsg}
          resultCode={resultCode}
          onRetry={async () => {
            if (!lastParams) return;
            try {
              setSubmitting(true);
              setErrorMsg(null);
              const result = await purchase(lastParams!, { refreshBonus: true });
              const code = String((result?.deliveryResult as any)?.code ?? '');
              if (code) setResultCode(code);
              setPurchaseOpen(false);
              setSuccessOpen(true);
            } catch (e: any) {
              setErrorMsg(e?.message || '购买失败');
            } finally {
              setSubmitting(false);
            }
          }}
          onSubmit={async () => {
            if (!selectedItem) return;
            setSubmitting(true);
            setErrorMsg(null);
            setResultCode(null);
            try {
              console.info('[store_purchase_submit]', { key: selectedItem.key, pricePoints: selectedItem.pricePoints, quantity });
              const payload = selectedItem.key === 'invite_code' ? { email } : {};
              const params = { userId, itemKey: selectedItem.key, quantity, payload };
              setLastParams(params);
              const result = await purchase(params, { refreshBonus: true });
              const code = String((result?.deliveryResult as any)?.code ?? '');
              if (code) setResultCode(code);
              setPurchaseOpen(false);
              setSuccessOpen(true);
            } catch (e: any) {
              setErrorMsg(e?.message || '购买失败');
              console.info('[store_purchase_failure]', { reason: e?.message });
            } finally {
              setSubmitting(false);
            }
          }}
        />
        <PurchaseSuccessModal open={successOpen} onOpenChange={(v) => { setSuccessOpen(v); if (!v) clearLastSuccess(); }} payload={lastSuccess} />
      </div>
    </div>
  );
}
