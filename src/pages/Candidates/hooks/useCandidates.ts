import { useMemo, useState } from 'react';
import type { Candidate, Tab } from '../types';

export function useCandidates() {
  const [selectedTab, setSelectedTab] = useState<Tab>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | undefined>>({});

  const candidates: Candidate[] = [
    {
      id: '1',
      title: '沙丘2',
      type: 'Dune: Part Two',
      year: '2024',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HEVC',
      description:
        '《沙丘2》是丹尼斯·维伦纽瓦执导的史诗科幻巨制，改编自弗兰克·赫伯特的同名小说。影片延续前作故事，讲述保罗·厄崔迪与弗雷曼人联手对抗哈克南家族的复仇之旅。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps\nAudio: DTS-HD MA 7.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'MovieFan2024',
      submittedAt: '2024-12-08 10:30',
      status: 'voting',
      votesUp: 45,
      votesDown: 3,
      views: 128,
      comments: 12,
      deadline: '2024-12-09 10:30',
    },
    {
      id: '2',
      title: '奥本海默',
      type: 'Oppenheimer',
      year: '2023',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
      category: '剧情',
      quality: '4K UHD BluRay REMUX',
      description: '克里斯托弗·诺兰执导的传记片，讲述"原子弹之父"罗伯特·奥本海默的传奇一生。',
      mediainfo: 'Video: AVC 3840x2160 23.976fps\nAudio: DTS-HD MA 5.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'NolanFan',
      submittedAt: '2024-12-07 15:20',
      status: 'approved',
      votesUp: 89,
      votesDown: 2,
      views: 256,
      comments: 34,
      deadline: '2024-12-08 15:20',
    },
    {
      id: '3',
      title: '蜘蛛侠：英雄无归',
      type: 'Spider-Man: No Way Home',
      year: '2021',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
      category: '动作',
      quality: '1080p WEB-DL',
      description: '漫威宇宙蜘蛛侠系列第三部，三代蜘蛛侠同框...',
      mediainfo: 'Video: H.264 1920x1080 23.976fps\nAudio: AAC 5.1 48kHz',
      submittedBy: 'SpideyFan',
      submittedAt: '2024-12-06 20:15',
      status: 'rejected',
      votesUp: 12,
      votesDown: 28,
      views: 89,
      comments: 8,
      deadline: '2024-12-07 20:15',
      reason: '已存在更高质量版本',
    },
    {
      id: '4',
      title: '瞬息全宇宙',
      type: 'Everything Everywhere All at Once',
      year: '2022',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HDR',
      description: '获得奥斯卡最佳影片的科幻喜剧片，讲述华裔女性在多元宇宙中的冒险故事。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps HDR10\nAudio: Atmos 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'CinemaLover',
      submittedAt: '2024-12-08 14:00',
      status: 'voting',
      votesUp: 67,
      votesDown: 5,
      views: 145,
      comments: 18,
      deadline: '2024-12-09 14:00',
    },
  ];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => (selectedTab === 'all' ? true : c.status === selectedTab));
  }, [candidates, selectedTab]);

  const counts = useMemo(() => {
    return {
      all: candidates.length,
      voting: candidates.filter((c) => c.status === 'voting').length,
      approved: candidates.filter((c) => c.status === 'approved').length,
      rejected: candidates.filter((c) => c.status === 'rejected').length,
    };
  }, [candidates]);

  const handleVote = (candidateId: string, voteType: 'up' | 'down') => {
    setUserVotes((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === voteType ? undefined : voteType,
    }));
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return '已截止';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours >= 24) {
      return `${Math.floor(hours / 24)}天${hours % 24}小时`;
    }
    return `${hours}小时${minutes}分钟`;
  };

  const getVotePercentage = (candidate: Candidate) => {
    const total = candidate.votesUp + candidate.votesDown;
    if (total === 0) return 0;
    return Math.round((candidate.votesUp / total) * 100);
  };

  return {
    selectedTab,
    setSelectedTab,
    selectedCandidate,
    setSelectedCandidate,
    showCreateModal,
    setShowCreateModal,
    userVotes,
    handleVote,
    candidates,
    filteredCandidates,
    counts,
    getTimeRemaining,
    getVotePercentage,
  };
}
