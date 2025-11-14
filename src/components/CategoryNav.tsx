const categories = [
  '全部',
  '电影',
  '电视剧',
  '纪录片',
  '动漫',
  '音乐',
  '游戏',
  '软件',
  '电子书',
];

export function CategoryNav() {
  return (
    <div className="sticky top-16 bg-[#0F171E] py-4 px-4 md:px-8 z-40 border-b border-gray-800">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              index === 0
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
