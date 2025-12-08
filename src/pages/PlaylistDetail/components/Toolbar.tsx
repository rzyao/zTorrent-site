import { Grid, List as ListIcon, Film } from 'lucide-react';

interface ToolbarProps {
  sortBy: 'order' | 'rating' | 'year';
  viewMode: 'grid' | 'list';
  onChangeSort: (value: 'order' | 'rating' | 'year') => void;
  onChangeViewMode: (value: 'grid' | 'list') => void;
  moviesCount: number;
}

// 列表工具栏：排序与视图切换
// 拆分原因：
// - 独立交互组件，降低页面复杂度
// - 便于在其他列表场景复用（保持 UI/交互一致）
export function Toolbar({ sortBy, viewMode, onChangeSort, onChangeViewMode, moviesCount }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-amber-500" />
          影片列表
        </h2>
        <span className="text-gray-400">共 {moviesCount} 部</span>
      </div>

      <div className="flex items-center gap-3">
        {/* 排序 */}
        <select
          value={sortBy}
          onChange={(e) => onChangeSort(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <option value="order">默认排序</option>
          <option value="rating">评分排序</option>
          <option value="year">年份排序</option>
        </select>

        {/* 视图切换 */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/20">
          <button
            onClick={() => onChangeViewMode('grid')}
            className={`p-2 rounded transition-all ${viewMode === 'grid'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('list')}
            className={`p-2 rounded transition-all ${viewMode === 'list'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

