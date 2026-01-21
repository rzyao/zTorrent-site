type Props = {
  view: any;
  fmt: (n: number) => string;
  userDays: number;
  userCount: number;
  upload: number;
  download: number;
  volRate: number;
  slotMax: number;
  basePrice: number;
  kt: number;
  dormantDays: number;
  kAge: number;
  age: number;
};

export function ResultsPanel(props: Props) {
  const {
    view,
    fmt,
    userDays,
    userCount,
    upload,
    download,
    volRate,
    slotMax,
    basePrice,
    kt,
    dormantDays,
    kAge,
    age,
  } = props;

  return (
    <>
      <h2>🧮 收益结算清单</h2>
      <div className="results-row">
        <div className="result-box rent">
          <span className="result-title">📦 仓储低保总收益</span>
          <div className="result-value" style={{ color: "#d97706" }}>
            {fmt(view.totalPeriodRent)}
          </div>
          <div className="result-detail">
            <div className="detail-row">
              <span>做种时长:</span>
              <span>{userDays} 天</span>
            </div>
            <div className="detail-row">
              <span>每小时低保:</span>
              <strong>{fmt(view.hourlyRent)}</strong>
            </div>
            <div className="detail-row" style={{ color: "#b45309" }}>
              <span>
                构成: 体积({fmt(view.rentVol)}) + 卡槽({fmt(view.rentSlotTotal)}
                )
              </span>
            </div>
          </div>
          <div className="real-formula">
            <strong>计算过程:</strong>
            <br />[ ({view.totalVolTB.toFixed(3)}TB * {volRate}) + ({userCount}
            个 * {slotMax} * {view.efficiency.toFixed(4)}) ]
            <br />* {view.totalHours} 小时
          </div>
        </div>

        <div className="result-box sales">
          <span className="result-title">💰 交易收益</span>
          <div className="result-value" style={{ color: "#059669" }}>
            {fmt(view.totalSales)}
          </div>
          <div className="result-detail">
            <div className="detail-row">
              <span>上传总量:</span>
              <span>{upload} GB</span>
            </div>
            <div className="detail-row">
              <span>市场单价:</span>
              <strong>{fmt(view.unitPrice)} / GB</strong>
            </div>
            <div
              style={{
                borderTop: "1px dashed #cbd5e1",
                marginTop: "8px",
                paddingTop: "8px",
              }}
            >
              <div className="detail-row">
                <span>基础收益:</span>
                <span style={{ color: "#6b7280" }}>
                  {fmt(view.baseRevenue ?? 0)}
                </span>
              </div>
              <div className="detail-row">
                <span>种龄收益:</span>
                <span style={{ color: "#0891b2" }}>
                  +{fmt(view.ageRevenue ?? 0)}
                </span>
              </div>
              <div className="detail-row">
                <span>唤醒收益:</span>
                <span style={{ color: "#7c3aed" }}>
                  +{fmt(view.dormantRevenue ?? 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="real-formula">
            <strong>计算过程:</strong>
            <br />
            max( {basePrice} * (1 + {kt}*{dormantDays} + {kAge}*{age}) *{" "}
            {view.scarcityFactor.toFixed(2)},{view.minPrice.toFixed(1)} )
            <br />* {upload} GB
          </div>
        </div>

        <div className="result-box cost" style={{ borderColor: "#ef4444" }}>
          <span className="result-title">💸 交易花费 (预计)</span>
          <div className="result-value" style={{ color: "#ef4444" }}>
            -{fmt(view.tradingCost ?? 0)}
          </div>
          <div className="result-detail">
            <div className="detail-row">
              <span>下载总量:</span>
              <span>{download} GB</span>
            </div>
            <div className="detail-row">
              <span>最终净收益:</span>
              <strong>{fmt(view.grandTotal - (view.tradingCost ?? 0))}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
