import "./bonus.css";
import { ConfigForm } from "./components/ConfigForm";
import { ScenarioPanel } from "./components/ScenarioPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { useBonusRules } from "./hooks/useBonusRules";
import { Button } from "@/modules/admin/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/admin/components/ui/dialog";
import { RefreshCw, Save, Loader2 } from "lucide-react";

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
    executeSave,
    saveConfirmOpen,
    setSaveConfirmOpen,
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
          {diffList.length > 0 && <span className="change-badge">{diffList.length} 项修改</span>}
        </div>
        <div className="action-bar-right flex items-center gap-2">
          <Button
            variant="default"
            onClick={handleReset}
            disabled={loadingConfig || saving || !baseline || diffList.length === 0}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重置配置
          </Button>
          <Button
            variant={diffList.length > 0 ? "primary" : "default"}
            onClick={handleSaveConfig}
            disabled={loadingConfig || saving || diffList.length === 0}
            loading={saving}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            保存配置
          </Button>
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

      {/* Confirmation Modal */}
      <Dialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>确认保存配置</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="mb-2 text-sm text-gray-600">以下配置将被保存：</p>
            <div className="bg-primary/5 max-h-[300px] overflow-y-auto rounded p-3 text-sm">
              {diffList.map((d: any) => (
                <div key={d.key} className="mb-2 last:mb-0">
                  <strong className="text-primary/80 block">{d.name}:</strong>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-muted-foreground text-xs line-through">
                      {fmt(d.before)}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-success font-bold">{fmt(d.after)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="default" onClick={() => setSaveConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={executeSave} loading={saving}>
              确认保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BonusRulesPage;
