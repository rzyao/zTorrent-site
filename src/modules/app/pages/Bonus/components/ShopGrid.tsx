import { Gift, Sparkles } from "lucide-react";
import type { StoreItem } from "@/api/custom/store";
import { getIconByKey } from "../utils";

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
      <div className="mb-6 rounded-xl border border-amber-500/20 bg-linear-to-r from-amber-500/10 to-orange-600/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="mb-2 text-lg text-white">魔力商城</h3>
            <p className="text-sm text-neutral-400">
              使用魔力值兑换各种特权和奖励。库存有限，先到先得！
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="col-span-full text-neutral-400">正在加载商城商品...</div>}
        {error && !loading && <div className="col-span-full text-red-400">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="col-span-full text-neutral-400">暂无上架商品</div>
        )}
        {!loading &&
          !error &&
          items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20">
                    {(() => {
                      const Icon = getIconByKey(item.key);
                      return <Icon className="h-7 w-7 text-amber-400" />;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-white">{item.title}</h3>
                    <p className="text-sm text-neutral-400">类型：{item.type}</p>
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xl">{item.pricePoints}</span>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs ${item.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                  >
                    {item.status === "active" ? "可购买" : "暂不可购买"}
                  </span>
                </div>
                <button
                  className={`w-full rounded-lg py-2.5 text-white shadow-lg shadow-amber-500/20 transition-all ${item.status === "active" ? "bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" : "cursor-not-allowed bg-neutral-700"}`}
                  disabled={item.status !== "active"}
                  onClick={() => onPurchase(item)}
                >
                  购买
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
