import { Search } from 'lucide-react';
import type { CategoryItem, CategoryType } from '../types';

interface TutorialsFiltersProps {
  categories: CategoryItem[];
  selectedCategory: CategoryType;
  onCategoryChange: (id: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TutorialsFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: TutorialsFiltersProps) {
  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索教程..."
          className="w-full pl-12 pr-4 py-3 bg-neutral-800/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isSelected
                  ? `bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 text-white shadow-lg shadow-${category.color}-500/30`
                  : 'bg-neutral-800/40 border border-neutral-700/50 text-neutral-300 hover:border-neutral-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

