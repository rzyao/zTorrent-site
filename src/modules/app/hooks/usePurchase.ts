import { useState, useCallback } from "react";
import { customToast } from "./useToast";
import {
  purchaseItem,
  getOrderDetail,
  type PurchaseRequest,
  type PurchaseResult,
  type OrderDetail,
} from "@/api/custom/store";
import { getBonusBalance, getBonusOverview } from "@/api/custom/bonus";

export type PurchaseSuccessPayload = {
  orderId: string;
  pointsCharged?: string;
  quantity?: number;
  deliveryResult?: Record<string, any> | undefined;
  detail?: OrderDetail | undefined;
  balance?: { balance?: number; lockedBalance?: number } | undefined;
  overview?: { balance: number; totalEarned: number; totalSpent: number } | undefined;
};

export type PurchaseOptions = {
  idempotencyKey?: string;
  refreshBonus?: boolean;
  onRefresh?: () => Promise<void> | void;
  maxRetries?: number;
};

function genIdempotencyKey(): string {
  const rnd = Math.random().toString(36).slice(2);
  const now = Date.now();
  const uuid = (globalThis as any)?.crypto?.randomUUID?.();
  return uuid ? uuid : `purchase-${now}-${rnd}`;
}

async function confirmDelivery(orderId: string, maxRetries: number = 2): Promise<OrderDetail> {
  let attempt = 0;
  let last: OrderDetail | null = null;
  while (attempt <= maxRetries) {
    const detail = await getOrderDetail({ id: orderId });
    last = detail;
    const ok = (detail?.deliveryResult as any)?.ok === true || detail?.status === "delivered";
    if (ok) return detail;
    attempt += 1;
    if (attempt <= maxRetries) {
      await new Promise((r) => setTimeout(r, 800 * Math.pow(1.2, attempt)));
    }
  }
  return last as OrderDetail;
}

export function usePurchase() {
  const [lastSuccess, setLastSuccess] = useState<PurchaseSuccessPayload | null>(null);

  const purchase = useCallback(
    async (req: PurchaseRequest, opts: PurchaseOptions = {}): Promise<PurchaseSuccessPayload> => {
      const idKey = opts.idempotencyKey || genIdempotencyKey();
      try {
        const resp: PurchaseResult = await purchaseItem(req, idKey);
        const orderId = String((resp as any)?.id || "");
        if (!orderId) {
          throw new Error("未返回订单号");
        }
        const detail = await confirmDelivery(orderId, opts.maxRetries ?? 2);
        const ok = (detail?.deliveryResult as any)?.ok === true || detail?.status === "delivered";
        if (!ok) {
          throw new Error("购买未完成或失败");
        }

        let bonusInfo: PurchaseSuccessPayload["balance"] | undefined;
        let overviewInfo: PurchaseSuccessPayload["overview"] | undefined;
        if (opts.refreshBonus) {
          try {
            const b = await getBonusBalance();
            const rawBal =
              typeof b?.balance === "string"
                ? parseFloat(b.balance as string)
                : Number(b?.balance ?? 0);
            const rawLocked =
              typeof b?.lockedBalance === "string"
                ? parseFloat(b.lockedBalance as string)
                : Number(b?.lockedBalance ?? 0);
            bonusInfo = { balance: rawBal, lockedBalance: rawLocked };
            const o = await getBonusOverview();
            const bal =
              typeof o.balance === "string" ? parseFloat(o.balance as string) : Number(o.balance);
            const earned =
              typeof o.totalEarned === "string"
                ? parseFloat(o.totalEarned as string)
                : Number(o.totalEarned);
            const spent =
              typeof o.totalSpent === "string"
                ? parseFloat(o.totalSpent as string)
                : Number(o.totalSpent);
            overviewInfo = { balance: bal, totalEarned: earned, totalSpent: spent };
          } catch {}
        }

        if (typeof opts.onRefresh === "function") {
          try {
            await opts.onRefresh();
          } catch {}
        }

        const payload: PurchaseSuccessPayload = {
          orderId,
          pointsCharged: detail?.pointsCharged ?? resp?.pointsCharged,
          quantity: detail?.quantity ?? resp?.quantity,
          deliveryResult: detail?.deliveryResult as any,
          detail,
          balance: bonusInfo,
          overview: overviewInfo,
        };

        try {
          const key = `purchase:last:${orderId}`;
          localStorage.setItem(key, JSON.stringify(payload));
        } catch {}

        const charged = payload.pointsCharged ? Number(payload.pointsCharged) : undefined;
        if (charged && Number.isFinite(charged)) {
          customToast.success(`购买成功，已扣除 ${charged} 积分`);
        } else {
          customToast.success("购买成功");
        }
        setLastSuccess(payload);
        return payload;
      } catch (e: any) {
        customToast.error(e?.message || "购买失败");
        throw e;
      }
    },
    [],
  );

  const clearLastSuccess = useCallback(() => setLastSuccess(null), []);

  return { purchase, lastSuccess, clearLastSuccess };
}
