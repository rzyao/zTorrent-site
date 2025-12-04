import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { Hero } from './components/Hero';
import { Stills } from './components/Stills';
import { TorrentTabs } from './components/TorrentTabs';
import { RelatedGrid } from './components/RelatedGrid';
import { RelatedSidebar } from './components/RelatedSidebar';
import { AwardsSidebar } from './components/AwardsSidebar';
import { Lightbox } from './components/Lightbox';
import { useFilmDetail } from './hooks/useFilmDetail';

interface FilmDetailPageProps {
  filmId?: string;
}

/**
 * FilmDetailPage 容器组件
 * - 负责拼装 UI 子组件与管理本地 UI 状态（如标签页、收藏/感谢、Lightbox 开关）
 * - 数据获取通过自定义 Hook `useFilmDetail` 完成，保证展示层与业务逻辑分离
 */
export default function FilmDetailPage({ filmId }: FilmDetailPageProps) {
  useDynamicTitle('影片详情');
  const params = useParams();
  const effectiveFilmId = filmId ?? (params?.id ? String(params.id) : undefined);

  // 业务数据状态由 Hook 管理
  const { detail, loading, error } = useFilmDetail(effectiveFilmId);

  // 纯 UI 状态：标签页、收藏/感谢、Lightbox
  const [activeTab, setActiveTab] = useState('torrents');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasThanked, setHasThanked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return <div className="min-h-screen bg-[#0F171E]" />;
  if (error) return <div className="min-h-screen bg-[#0F171E] text-red-400 px-4 py-8">{error}</div>;
  if (!detail) return <div className="min-h-screen bg-[#0F171E]" />;

  return (
    <div className="min-h-screen bg-[#0F171E]">
      {/* 顶部信息区 */}
      <Hero
        detail={detail}
        isBookmarked={isBookmarked}
        hasThanked={hasThanked}
        onToggleBookmark={() => setIsBookmarked((v) => !v)}
        onToggleThanked={() => setHasThanked((v) => !v)}
      />

      {/* 主体内容区 */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
          {/* 左侧主内容 */}
          <div className="space-y-6">
            {/* 剧照 */}
            <Stills stills={detail.stills} onOpen={openLightbox} />

            {/* 标签页：种子/评论 */}
            <div className="grid grid-cols-1 gap-2">
              <div className="space-y-6">
                <TorrentTabs
                  activeTab={activeTab}
                  onActiveTabChange={setActiveTab}
                  torrents={detail.torrents}
                  comments={detail.comments}
                  filmId={effectiveFilmId}
                />

                {/* 相关推荐网格（主内容内） */}
                <RelatedGrid items={detail.relatedTorrents as any} />
              </div>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            <AwardsSidebar awards={detail.awards} />
            <RelatedSidebar items={detail.relatedTorrents as any} />
          </div>
        </div>
      </div>

      {/* 全屏图片查看器 */}
      <Lightbox open={lightboxOpen} onOpenChange={setLightboxOpen} stills={detail.stills} />
    </div>
  );
}

