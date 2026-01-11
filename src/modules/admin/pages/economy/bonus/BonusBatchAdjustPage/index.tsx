import { ImportPanel } from "./components/ImportPanel";
import { ResultSection } from "./components/ResultSection";
import { useBonusBatchAdjustLogic } from "./hooks/useBonusBatchAdjustLogic";

/**
 * 批量调账页面
 * 职责：支持通过 CSV/JSON 批量导入调账指令，并展示执行结果
 */
export default function BonusBatchAdjustPage() {
  const {
    text,
    setText,
    items,
    results,
    loading,
    handleParseCsv,
    handleParseJson,
    handleClear,
    handleSubmit,
  } = useBonusBatchAdjustLogic();

  return (
    <div className="flex h-full flex-col gap-6 lg:flex-row">
      <ImportPanel
        text={text}
        onTextChange={setText}
        onParseCsv={handleParseCsv}
        onParseJson={handleParseJson}
        onClear={handleClear}
        onSubmit={handleSubmit}
        loading={loading}
        hasItems={items.length > 0}
      />

      <ResultSection items={items} results={results} loading={loading} />
    </div>
  );
}
