import { Loader2, Tv } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function LoadingState() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
      <p className="text-neutral-400">{t('series.loading')}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
        <Tv className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="mb-2 text-xl text-white">{t('series.loadFailed')}</h3>
      <p className="mb-6 text-neutral-500">{error}</p>
      <button
        onClick={onRetry}
        className="rounded-xl bg-purple-500 px-6 py-2 text-white transition-colors hover:bg-purple-600"
      >
        {t('app.retry')}
      </button>
    </div>
  );
}
