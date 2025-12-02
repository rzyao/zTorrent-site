import { useState, useEffect } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { Sparkles, TrendingUp, TrendingDown, Gift, Award, Star, Zap, Clock, Users, Download, Upload, MessageSquare, UserPlus, Calendar, ArrowUpRight, ArrowDownRight, Filter, Search, Copy, Mail } from 'lucide-react';
import type { StoreItem } from '../api/custom/store';
import { getStoreItems, purchaseItem, getOrderDetail } from '../api/custom/store';
import { getBonusBalance, getBonusOverview, getBonusLedger } from '../api/custom/bonus';
import { MailService } from '../api';
import { getProfile } from '../api/custom/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

interface MagicRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  description: string;
  timestamp: string;
  icon: any;
}

export function BonusPage() {
  useDynamicTitle('魔力值');
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'shop'>('overview');
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'spend'>('all');

  const [overview, setOverview] = useState<{ current: number; totalEarned: number; totalSpent: number; rank?: number } | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const [records, setRecords] = useState<MagicRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  // 获取魔力值的方式
  const earnMethods = [
    { icon: Calendar, title: '每日签到', amount: '10-100', description: '每天签到可获得魔力值，连续签到奖励更多' },
    { icon: Upload, title: '上传种子', amount: '100-500', description: '上传高质量种子获得魔力值奖励' },
    { icon: Zap, title: '保种奖励', amount: '10-200', description: '长期保种可持续获得魔力值' },
    { icon: TrendingUp, title: '分享率达标', amount: '50-300', description: '分享率达到里程碑获得奖励' },
    { icon: Download, title: '下载奖励', amount: '5-20', description: '完成下载并做种获得奖励' },
    { icon: MessageSquare, title: '论坛互动', amount: '10-50', description: '发帖和回复获得魔力值' },
  ];

  // 魔力值商城
  /**
   * 从后端加载商城商品列表（GET /store/items）
   * 保留原有样式，仅替换数据来源与状态处理
   */
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
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

  useEffect(() => {
    if (activeTab !== 'shop') return;
    setItemsLoading(true);
    setItemsError(null);
    getStoreItems({ page: 1, pageSize: 50, status: 'active' })
      .then((resp: StoreItem[]) => setStoreItems(Array.isArray(resp) ? resp : []))
      .catch((e: any) => setItemsError(e?.message || '加载商城商品失败'))
      .finally(() => setItemsLoading(false));
    try { console.info('[store_list_view]'); } catch { }
  }, [activeTab]);

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

  // 根据商品 key 映射图标（可扩展）
  const getIconByKey = (key: string) => {
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
  };

  useEffect(() => {
    if (activeTab !== 'overview') return;
    setOverviewLoading(true);
    setOverviewError(null);
    getBonusOverview()
      .then((o) => {
        const current = typeof o.balance === 'string' ? parseInt(o.balance as string, 10) : Number(o.balance);
        const totalEarned = typeof o.totalEarned === 'string' ? parseInt(o.totalEarned as string, 10) : Number(o.totalEarned);
        const totalSpent = typeof o.totalSpent === 'string' ? parseInt(o.totalSpent as string, 10) : Number(o.totalSpent);
        setOverview({ current, totalEarned, totalSpent, rank: o.rank });
      })
      .catch((e: any) => setOverviewError(e?.message || '加载概览失败'))
      .finally(() => setOverviewLoading(false));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'records') return;
    setRecordsLoading(true);
    setRecordsError(null);
    const types: Array<'earn' | 'spend'> = filterType === 'all' ? ['earn', 'spend'] : [filterType as 'earn' | 'spend'];
    getBonusLedger({ page: 1, pageSize: 20, types })
      .then((res) => {
        const mapped: MagicRecord[] = (res.items || []).map((it) => {
          const amt = typeof it.delta === 'string' ? parseInt(it.delta as string, 10) : Number(it.delta);
          const t: 'earn' | 'spend' = amt >= 0 ? 'earn' : 'spend';
          const reason = it.reason || '';
          const icon = reason === 'purchase' ? UserPlus : reason === 'upload_torrent' ? Upload : Zap;
          return {
            id: it.id,
            type: t,
            amount: Math.abs(amt),
            reason,
            description: it.externalRef || '',
            timestamp: it.createdAt,
            icon,
          };
        });
        setRecords(mapped);
      })
      .catch((e: any) => setRecordsError(e?.message || '加载流水失败'))
      .finally(() => setRecordsLoading(false));
  }, [activeTab, filterType]);

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-3xl">魔力值中心</h1>
          </div>
          <p className="text-neutral-400 ml-13">管理您的魔力值，兑换专属特权</p>
        </div>

        {/* 魔力值概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">当前魔力值</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-white text-3xl mb-1">{(overview?.current ?? 0).toLocaleString()}</div>
            <div className="text-amber-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>排名第 {overview?.rank ?? '-'}</span>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-green-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">累计获得</span>
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-white text-3xl mb-1">{(overview?.totalEarned ?? 0).toLocaleString()}</div>
            <div className="text-green-400 text-sm">历史总收入</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">累计消耗</span>
              <ArrowDownRight className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-white text-3xl mb-1">{(overview?.totalSpent ?? 0).toLocaleString()}</div>
            <div className="text-red-400 text-sm">历史总支出</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">净收益</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-white text-3xl mb-1">{((overview?.totalEarned ?? 0) - (overview?.totalSpent ?? 0)).toLocaleString()}</div>
            <div className="text-blue-400 text-sm">收入 - 支出</div>
          </div>
        </div>

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

        {/* 获取方式 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-lg mb-2">什么是魔力值？</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    魔力值是本站的虚拟货币系统，您可以通过积极参与站点活动获得魔力值，并用于兑换各种特权和奖励。保持活跃，让您的魔力值持续增长！
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-white text-xl mb-4">如何获得魔力值</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                      <method.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white">{method.title}</h3>
                        <span className="text-amber-400 text-sm">+{method.amount}</span>
                      </div>
                      <p className="text-neutral-400 text-sm">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 收支记录 */}
        {activeTab === 'records' && (
          <div>
            {/* 筛选器 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-400">筛选：</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${filterType === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilterType('earn')}
                  className={`px-4 py-2 rounded-lg transition-all ${filterType === 'earn'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                >
                  收入
                </button>
                <button
                  onClick={() => setFilterType('spend')}
                  className={`px-4 py-2 rounded-lg transition-all ${filterType === 'spend'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                >
                  支出
                </button>
              </div>
            </div>

            {/* 记录列表 */}
            <div className="space-y-3">
              {recordsLoading && <div className="text-neutral-400">正在加载收支记录...</div>}
              {recordsError && !recordsLoading && <div className="text-red-400">{recordsError}</div>}
              {!recordsLoading && !recordsError && records.map((record) => (
                <div
                  key={record.id}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${record.type === 'earn'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                      }`}>
                      <record.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white">{record.reason}</h3>
                        <span className={`text-lg ${record.type === 'earn' ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {record.type === 'earn' ? '+' : ''}{record.amount}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-1">{record.description}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span>{record.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 魔力商城 */}
        {activeTab === 'shop' && (
          <div>
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-lg mb-2">魔力商城</h3>
                  <p className="text-neutral-400 text-sm">
                    使用魔力值兑换各种特权和奖励。库存有限，先到先得！
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 加载与错误态 */}
              {itemsLoading && (
                <div className="col-span-full text-neutral-400">正在加载商城商品...</div>
              )}
              {itemsError && !itemsLoading && (
                <div className="col-span-full text-red-400">{itemsError}</div>
              )}
              {!itemsLoading && !itemsError && storeItems.length === 0 && (
                <div className="col-span-full text-neutral-400">暂无上架商品</div>
              )}
              {!itemsLoading && !itemsError && storeItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
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
                      <span className={`text-xs px-2 py-1 rounded ${item.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {item.status === 'active' ? '可购买' : '暂不可购买'}
                      </span>
                    </div>
                    <button
                      className={`w-full py-2.5 rounded-lg text-white transition-all shadow-lg shadow-amber-500/20 ${item.status === 'active' ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : 'bg-neutral-700 cursor-not-allowed'}`}
                      disabled={item.status !== 'active'}
                      onClick={() => {
                        try { console.info('[store_item_click]', { key: item.key, pricePoints: item.pricePoints }); } catch { }
                        setSelectedItem(item);
                        setPurchaseOpen(true);
                      }}
                    >
                      购买
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 购买弹窗 */}
        <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
          <DialogContent className="bg-neutral-900 border border-neutral-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>确认购买</DialogTitle>
              <DialogDescription className="text-neutral-400">请确认购买信息并提交订单</DialogDescription>
            </DialogHeader>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-400">商品</div>
                    <div className="text-white">{selectedItem.title}</div>
                  </div>
                  <div className="text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-lg">{selectedItem.pricePoints}</span>
                  </div>
                </div>

                {selectedItem.key === 'invite_code' && (
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">收件邮箱</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="target@example.com"
                      className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500"
                    />
                    {email && !/^\S+@\S+\.\S+$/.test(email) && (
                      <div className="text-red-400 text-xs mt-1">邮箱格式不正确</div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">数量</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                    className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
                  <div className="text-sm text-neutral-400 mb-1">扣除积分与余额</div>
                  <div className="flex items-center justify-between">
                    <div className="text-white">本次将扣除：{Number(selectedItem.pricePoints) * quantity}</div>
                    <div className="text-neutral-400">当前余额：{balance ?? '未知'}</div>
                  </div>
                  {balance !== null && Number(selectedItem.pricePoints) * quantity > (balance ?? 0) && (
                    <div className="text-red-400 text-sm mt-1">余额不足，去赚取积分</div>
                  )}
                </div>

                {errorMsg && (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="text-red-400">{errorMsg}</div>
                    {lastParams && (
                      <button
                        className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white"
                        onClick={async () => {
                          try {
                            setSubmitting(true);
                            setErrorMsg(null);
                            const idKey = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
                            const resp = await purchaseItem(lastParams, String(idKey));
                            const orderId = resp?.id;
                            if (!orderId) {
                              setErrorMsg('未返回订单号');
                            } else {
                              const detail = await getOrderDetail({ id: orderId });
                              const ok = (detail?.deliveryResult?.ok ?? false) || detail?.status === 'delivered';
                              if (ok) {
                                const code = String(detail?.deliveryResult?.code ?? '');
                                setResultCode(code || '');
                                console.info('[store_purchase_success]', { orderId: detail?.id });
                              } else {
                                setErrorMsg('购买未完成或失败');
                                console.info('[store_purchase_failure]', { orderId: detail?.id });
                              }
                            }
                          } catch (e: any) {
                            setErrorMsg(e?.message || '购买失败');
                            console.info('[store_purchase_failure]', { reason: e?.message });
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        重试
                      </button>
                    )}
                  </div>
                )}
                {resultCode && (
                  <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
                    <div className="text-sm text-neutral-400 mb-1">交付结果（邀请码）</div>
                    <div className="flex items-center justify-between">
                      <div className="text-white break-all">{resultCode}</div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white flex items-center gap-1"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(resultCode);
                              console.info('[invite_code_copy]');
                            } catch { }
                          }}
                        >
                          <Copy className="w-4 h-4" /> 复制
                        </button>
                        {selectedItem.key === 'invite_code' && email && /^\S+@\S+\.\S+$/.test(email) && (
                          <button
                            className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white flex items-center gap-1"
                            onClick={async () => {
                              try {
                                await MailService.mailControllerSendReport({ to: email, subject: '官方邀请码', text: `您的邀请码：${resultCode}` });
                                console.info('[invite_code_email_send]');
                              } catch { }
                            }}
                          >
                            <Mail className="w-4 h-4" /> 发送到邮箱
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="flex items-center justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white"
                    onClick={() => setPurchaseOpen(false)}
                  >
                    取消
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white ${submitting ? 'bg-neutral-700 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'}`}
                    disabled={submitting || (selectedItem.key === 'invite_code' && !/^\S+@\S+\.\S+$/.test(email)) || (balance !== null && Number(selectedItem.pricePoints) * quantity > (balance ?? 0))}
                    onClick={async () => {
                      setSubmitting(true);
                      setErrorMsg(null);
                      setResultCode(null);
                      try {
                        console.info('[store_purchase_submit]', { key: selectedItem.key, pricePoints: selectedItem.pricePoints, quantity });
                        const payload = selectedItem.key === 'invite_code' ? { email } : {};
                        const params = { userId, itemKey: selectedItem.key, quantity, payload };
                        setLastParams(params);
                        const idKey = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
                        const resp = await purchaseItem(params, String(idKey));
                        const orderId = resp?.id;
                        if (!orderId) {
                          setErrorMsg('未返回订单号');
                        } else {
                          const detail = await getOrderDetail({ id: orderId });
                          const ok = (detail?.deliveryResult?.ok ?? false) || detail?.status === 'delivered';
                          if (ok) {
                            const code = String(detail?.deliveryResult?.code ?? '');
                            setResultCode(code || '');
                            console.info('[store_purchase_success]', { orderId: detail?.id });
                          } else {
                            setErrorMsg('购买未完成或失败');
                            console.info('[store_purchase_failure]', { orderId: detail?.id });
                          }
                        }
                      } catch (e: any) {
                        setErrorMsg(e?.message || '购买失败');
                        console.info('[store_purchase_failure]', { reason: e?.message });
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    确认购买
                  </button>
                </DialogFooter>
              </div>
            ) : (
              <div className="text-neutral-400">未选择商品</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
