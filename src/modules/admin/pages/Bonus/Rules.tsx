import "./bonus.css";
import { ConfigForm } from "./components/ConfigForm";
import { ScenarioPanel } from "./components/ScenarioPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { useBonusRules } from "./hooks/useBonusRules";

export function BonusRulesPage() {
  const {
    fmt,
    baseline,
    changes,
    diffList,
    loadingConfig,
    configError,
    saving,
    volRate,
    slotMax,
    sigmoidC,
    basePrice,
    kt,
    kn,
    pMinRatio,
    kAge,
    costCurveC,
    setVolRate,
    setSlotMax,
    setSigmoidC,
    setBasePrice,
    setKt,
    setKn,
    setPMinRatio,
    setKAge,
    setCostCurveC,
    handleNumberChange,
    handleSaveConfig,
    handleReset,
    userDays,
    userCount,
    avgSize,
    dormantDays,
    peers,
    age,
    upload,
    download,
    setUserDays,
    setUserCount,
    setAvgSize,
    setDormantDays,
    setPeers,
    setAge,
    setUpload,
    setDownload,
    simError,
    view,
  } = useBonusRules();

  return (
    <div className="bonus-page-container">
      <div className="top-action-bar">
        <div className="action-bar-left">
          <h1 className="page-title">💰 魔力值规则配置</h1>
          {diffList.length > 0 && (
            <span className="change-badge">{diffList.length} 项修改</span>
          )}
        </div>
        <div className="action-bar-right">
          <button
            onClick={handleReset}
            disabled={
              loadingConfig || saving || !baseline || diffList.length === 0
            }
            className="btn btn-secondary"
          >
            🔄 重置配置
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={loadingConfig || saving || diffList.length === 0}
            className={
              "btn btn-primary" + (diffList.length > 0 ? " btn-changed" : "")
            }
          >
            {saving ? "💾 保存中…" : "💾 保存配置"}
          </button>
        </div>
      </div>

      <div className="container">
        <div className="col-config">
          <ConfigForm
            changes={changes}
            configError={configError}
            loadingConfig={loadingConfig}
            saving={saving}
            volRate={volRate}
            slotMax={slotMax}
            sigmoidC={sigmoidC}
            basePrice={basePrice}
            kt={kt}
            kn={kn}
            pMinRatio={pMinRatio}
            kAge={kAge}
            costCurveC={costCurveC}
            fmt={fmt}
            handleNumberChange={handleNumberChange}
            setVolRate={setVolRate}
            setSlotMax={setSlotMax}
            setSigmoidC={setSigmoidC}
            setBasePrice={setBasePrice}
            setKt={setKt}
            setKn={setKn}
            setPMinRatio={setPMinRatio}
            setKAge={setKAge}
            setCostCurveC={setCostCurveC}
          />
        </div>

        <div className="col-right">
          <div className="card">
            <ScenarioPanel
              userDays={userDays}
              userCount={userCount}
              avgSize={avgSize}
              dormantDays={dormantDays}
              peers={peers}
              age={age}
              upload={upload}
              download={download}
              handleNumberChange={handleNumberChange}
              setUserDays={setUserDays}
              setUserCount={setUserCount}
              setAvgSize={setAvgSize}
              setDormantDays={setDormantDays}
              setPeers={setPeers}
              setAge={setAge}
              setUpload={setUpload}
              setDownload={setDownload}
              view={view}
              simError={simError}
            />

            <ResultsPanel
              view={view}
              fmt={fmt}
              userDays={userDays}
              userCount={userCount}
              upload={upload}
              download={download}
              volRate={volRate}
              slotMax={slotMax}
              basePrice={basePrice}
              kt={kt}
              dormantDays={dormantDays}
              kAge={kAge}
              age={age}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BonusRulesPage;
