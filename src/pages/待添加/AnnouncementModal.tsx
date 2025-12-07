import { X, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'event' | 'rule' | 'maintenance';
  publishDate: string;
}

interface AnnouncementModalProps {
  announcements: Announcement[];
  onClose: () => void;
  onViewAll: () => void;
}

export function AnnouncementModal({ announcements, onClose, onViewAll }: AnnouncementModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAnnouncement = announcements[currentIndex];

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      system: '系统公告',
      event: '活动公告',
      rule: '规则更新',
      maintenance: '维护通知',
    };
    return labels[type as keyof typeof labels];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      system: 'from-blue-500 to-blue-600',
      event: 'from-amber-500 to-orange-600',
      rule: 'from-red-500 to-red-600',
      maintenance: 'from-purple-500 to-purple-600',
    };
    return colors[type as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F171E] border-2 border-amber-500/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-700/20 border-b border-amber-500/20 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-amber-400" />
              <h2 className="text-amber-50">最新公告</h2>
            </div>
            <button
              onClick={onClose}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {announcements.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1 text-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-amber-300 text-sm">
                {currentIndex + 1} / {announcements.length}
              </div>
              <button
                onClick={handleNext}
                disabled={currentIndex === announcements.length - 1}
                className="p-1 text-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex-1" />
              <div className="flex gap-1">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-amber-400 w-6'
                        : 'bg-amber-400/30 hover:bg-amber-400/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-4">
            <div className={`inline-block px-3 py-1 rounded bg-gradient-to-r ${getTypeColor(currentAnnouncement.type)} text-white text-sm mb-3`}>
              {getTypeLabel(currentAnnouncement.type)}
            </div>
            <h3 className="text-amber-50 mb-2">{currentAnnouncement.title}</h3>
            <p className="text-amber-400/60 text-sm">{currentAnnouncement.publishDate}</p>
          </div>
          <div className="prose prose-invert prose-amber max-w-none">
            <div className="text-amber-200/80 whitespace-pre-wrap">
              {currentAnnouncement.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-amber-500/20 p-4 flex gap-3">
          <button
            onClick={onViewAll}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all"
          >
            查看所有公告
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all"
          >
            {announcements.length > 1 && currentIndex < announcements.length - 1 ? '稍后查看' : '关闭'}
          </button>
        </div>
      </div>
    </div>
  );
}
