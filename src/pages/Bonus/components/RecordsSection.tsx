import { Filter, Clock } from 'lucide-react';
import type { MagicRecord } from '../types';

export function RecordsSection({
  records,
  loading,
  error,
  filterType,
  onFilterChange,
}: {
  records: MagicRecord[];
  loading: boolean;
  error: string | null;
  filterType: 'all' | 'earn' | 'spend';
  onFilterChange: (t: 'all' | 'earn' | 'spend') => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral-400" />
          <span className="text-neutral-400">筛选：</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onFilterChange('all')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'all' ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>全部</button>
          <button onClick={() => onFilterChange('earn')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'earn' ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>收入</button>
          <button onClick={() => onFilterChange('spend')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'spend' ? 'bg-linear-to-r from-red-500 to-rose-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>支出</button>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-neutral-400">正在加载收支记录...</div>}
        {error && !loading && <div className="text-red-400">{error}</div>}
        {!loading && !error && records.map((record) => (
          <div key={record.id} className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 hover:border-neutral-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${record.type === 'earn' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <record.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white">{record.reason}</h3>
                  <span className={`text-lg ${record.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>{record.type === 'earn' ? '+' : ''}{record.amount}</span>
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
  );
}

