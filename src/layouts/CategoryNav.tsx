import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const categories = [
  { label: '全部', slug: 'home', api: '' },
  { label: '电影', slug: 'movie', api: 'movie' },
  { label: '电视剧', slug: 'tv', api: 'tv' },
  { label: '纪录片', slug: 'documentary', api: 'documentary' },
  { label: '动漫', slug: 'anime', api: 'anime' },
  { label: '音乐', slug: 'music', api: 'music' },
  { label: '游戏', slug: 'game', api: 'game' },
  { label: '软件', slug: 'software', api: 'software' },
  { label: '电子书', slug: 'ebook', api: 'ebook' },
];

export function CategoryNav({ active = '全部', onSelect, inline = false, items }: { active?: string; onSelect?: (category: string) => void; inline?: boolean; items?: Array<{ label: string }> }) {
  const navigate = useNavigate();
  const list = Array.isArray(items) && items.length ? items : categories;
  if (inline) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {list.map((c) => (
          <Button
            key={c.label}
            className={`px-4 py-1.5 rounded-full transition-colors ${c.label === active ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            onClick={() => { if (onSelect) onSelect(c.label); }}
          >
            {c.label}
          </Button>
        ))}
      </div>
    );
  }
  return (
    <div className="sticky top-0 bg-[#0F171E] py-4 px-4 md:px-8 z-40 border-b border-gray-800">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {list.map((c) => (
          <Button
            key={c.label}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${c.label === active ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            onClick={() => {
              if (onSelect) onSelect(c.label);
              else {
                if (c.label === '全部') navigate('/home');
                else navigate(`/home/${(c as any).slug}`);
              }
            }}
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
