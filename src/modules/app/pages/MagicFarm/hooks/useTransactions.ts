import { useState } from 'react';
import type { WarehouseItem, UserStats, Crop } from '../types';

// 中文说明：
// 交易相关 Hook，负责与仓库/出售/交易弹窗相关的状态与行为。
// 为了保持与原页面功能一致（原仓库按钮无实际逻辑），
// 这里实现交易数据与弹窗的管理，但默认不强制改变库存，
// 页面可选择是否调用出售行为。

interface TransactionState {
  type: 'sell' | 'buy' | null;
  crop?: Crop;
  amount?: number; // 用于扩展（暂未使用）
}

export function useTransactions(params: {
  userStats: UserStats;
  setUserStats: (updater: UserStats | ((prev: UserStats) => UserStats)) => void;
  crops: Crop[];
}) {
  const { userStats, setUserStats, crops } = params;

  // 仓库初始数据（迁移自原页面）
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>([
    { cropId: 'wheat', count: 45 },
    { cropId: 'corn', count: 28 },
    { cropId: 'tomato', count: 15 },
    { cropId: 'carrot', count: 32 },
  ]);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transaction, setTransaction] = useState<TransactionState>({ type: null });

  // 打开出售确认弹窗（页面可选择是否使用）
  const openSellModal = (cropId: string) => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return;
    setTransaction({ type: 'sell', crop });
    setShowTransactionModal(true);
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setTransaction({ type: null });
  };

  // 出售行为（可选调用）：将仓库中某作物全部出售后结算金币
  // 说明：原页面仅展示按钮并未实现逻辑，这里提供能力但由页面决定是否使用。
  const sellAll = (cropId: string) => {
    const crop = crops.find(c => c.id === cropId);
    const item = warehouse.find(w => w.cropId === cropId);
    if (!crop || !item || item.count <= 0) return;

    const gain = crop.sellPrice * item.count;
    setUserStats({ ...userStats, coins: userStats.coins + gain });
    setWarehouse(warehouse.map(w => w.cropId === cropId ? { ...w, count: 0 } : w));
    closeTransactionModal();
  };

  return {
    warehouse,
    setWarehouse,
    showTransactionModal,
    transaction,
    openSellModal,
    closeTransactionModal,
    sellAll,
  };
}

