type Props = {
  changes: Record<string, boolean>;
  configError: string | null;
  loadingConfig: boolean;
  saving: boolean;
  volRate: number;
  slotMax: number;
  sigmoidC: number;
  basePrice: number;
  kt: number;
  kn: number;
  pMinRatio: number;
  kAge: number;
  costCurveC: number;
  fmt: (n: number) => string;
  handleNumberChange: (
    setter: (n: number) => void,
    min: number,
    max: number
  ) => (e: any) => void;
  setVolRate: (n: number) => void;
  setSlotMax: (n: number) => void;
  setSigmoidC: (n: number) => void;
  setBasePrice: (n: number) => void;
  setKt: (n: number) => void;
  setKn: (n: number) => void;
  setPMinRatio: (n: number) => void;
  setKAge: (n: number) => void;
  setCostCurveC: (n: number) => void;
};

export function ConfigForm(props: Props) {
  const {
    changes,
    configError,
    loadingConfig,
    volRate,
    slotMax,
    sigmoidC,
    basePrice,
    kt,
    kn,
    pMinRatio,
    kAge,
    costCurveC,
    handleNumberChange,
    setVolRate,
    setSlotMax,
    setSigmoidC,
    setBasePrice,
    setKt,
    setKn,
    setPMinRatio,
    setKAge,
    setCostCurveC,
  } = props;

  return (
    <div className="card">
      <h2>📦 仓储低保策略 (Storage Policy)</h2>
      <div className="formula-box">
        <span className="formula-highlight">
          低保 = (总体�?× svc) + (数量 × ssr ×{" "}
          <span className="fraction">
            <span className="numerator">size²</span>
            <span className="denominator">size² + sec</span>
          </span>
          )
        </span>
      </div>
      {configError && (
        <div className="info-note" style={{ color: "#ef4444" }}>
          {configError}
        </div>
      )}
      {loadingConfig && <div className="info-note">配置加载中�?/div>}
      <div className={"form-group" + (changes.volRate ? " changed" : "")}>
        <label>
          仓储体积系数(svc)
          <input
            type="number"
            value={volRate}
            onChange={handleNumberChange(setVolRate, 0, 5)}
            disabled={loadingConfig}
          />
        </label>
      </div>
      <div className={"form-group" + (changes.slotMax ? " changed" : "")}>
        <label>
          仓储卡槽奖励(ssr)
          <input
            type="number"
            value={slotMax}
            onChange={handleNumberChange(setSlotMax, 0, 50)}
            disabled={loadingConfig}
          />
        </label>
      </div>
      <div className={"form-group" + (changes.sigmoidC ? " changed" : "")}>
        <label>
          仓储效率曲线常数(sec)
          <input
            type="number"
            value={sigmoidC}
            onChange={handleNumberChange(setSigmoidC, 1, 100)}
            disabled={loadingConfig}
          />
        </label>
      </div>
      <hr
        style={{
          border: 0,
          borderTop: "1px dashed #ccc",
          margin: "20px 0",
        }}
      />
      <h2>💰 交易市场系数 (Market Policy)</h2>
      <div className="formula-box">
        单价 = tbp{" "}
        <span className="fraction">
          <span className="numerator">(1 + tdc * 天数 + tac * 种龄)</span>
          <span className="denominator">(1 + tsc * ln(人数))</span>
        </span>
        <br />
        <span className="formula-highlight" style={{ color: "#059669" }}>
          交易收益 = max(单价, tbp * tmpr) * 上传�?        </span>
      </div>
      <div className={"form-group" + (changes.basePrice ? " changed" : "")}>
        <div className="market-field-row">
          <label>交易基础单价(tbp)</label>
          <input
            type="number"
            value={basePrice}
            onChange={handleNumberChange(setBasePrice, 1, 100)}
            disabled={loadingConfig}
          />
          <span className="inline-note">建议: 20~50，所有新种子的起步价�?/span>
        </div>
      </div>
      <div className={"form-group" + (changes.kt ? " changed" : "")}>
        <div className="market-field-row">
          <label>交易沉睡增值系�?tdc)</label>
          <input
            type="number"
            value={kt}
            onChange={handleNumberChange(setKt, 0, 0.5)}
            disabled={loadingConfig}
          />
          <span className="inline-note">
            建议: 0.01~0.1，做种时间越长越值钱
          </span>
        </div>
      </div>
      <div className={"form-group" + (changes.kAge ? " changed" : "")}>
        <div className="market-field-row">
          <label>交易年龄增值系�?tac)</label>
          <input
            type="number"
            value={kAge}
            onChange={handleNumberChange(setKAge, 0, 999999)}
            disabled={loadingConfig}
          />
          <span className="inline-note">
            建议: 0~0.2，种子发布时间系�?无上�?
          </span>
        </div>
      </div>
      <div className={"form-group" + (changes.kn ? " changed" : "")}>
        <div className="market-field-row">
          <label>交易稀缺系�?tsc)</label>
          <input
            type="number"
            value={kn}
            onChange={handleNumberChange(setKn, 0, 2.0)}
            disabled={loadingConfig}
          />
          <span className="inline-note">
            建议: 0.3~0.8，值越大做种人多时价格跌得越快
          </span>
        </div>
      </div>
      <div className={"form-group" + (changes.pMinRatio ? " changed" : "")}>
        <div className="market-field-row">
          <label>交易保底价格比例(tmpr)</label>
          <input
            type="number"
            value={pMinRatio}
            onChange={handleNumberChange(setPMinRatio, 0, 1.0)}
            disabled={loadingConfig}
          />
          <span className="inline-note">
            建议: 0.1~0.3，保底价格占基础价格的比�?          </span>
        </div>
      </div>
      <div
        className={"form-group" + (changes.costCurveC ? " changed" : "")}
        style={{ marginBottom: "0" }}
      >
        <div className="market-field-row">
          <label>交易花费曲线常数(tcac)</label>
          <input
            type="number"
            value={costCurveC}
            onChange={handleNumberChange(setCostCurveC, 0.1, 100)}
            disabled={loadingConfig}
          />
          <span className="inline-note">
            建议: 1~100，用于计算下载花费的曲线常数
          </span>
        </div>
      </div>
    </div>
  );
}
