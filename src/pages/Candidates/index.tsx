import { useState } from 'react';
import type { Candidate } from './types';
import { CandidatesHeader } from './components/Header';
import { ProcessCard } from './components/ProcessCard';
import { FilterTabs } from './components/FilterTabs';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { CreateCandidateModal } from './components/CreateCandidateModal';
import { getVotePercentage } from './utils';


export function CandidatesPage() {
  const [selectedTab, setSelectedTab] = useState<'hall' | 'mySubmissions' | 'myVotes'>('hall');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userVotes, setUserVotes] = useState<{ [key: string]: 'up' | 'down' }>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const currentUser = 'MovieFan2024';

  const mockCandidates: Candidate[] = [
    {
      id: '1',
      title: '沙丘2',
      type: 'Dune: Part Two',
      year: '2024',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HEVC',
      description: '《沙丘2》是丹尼斯·维伦纽瓦执导的史诗科幻巨制，改编自弗兰克·赫伯特的同名小说。影片延续前作故事，讲述保罗·厄崔迪与弗雷曼人联手对抗哈克南家族的复仇之旅。在契妮和弗雷曼战士的帮助下，保罗踏上复仇之路，必须在挚爱与已知宇宙命运之间做出抉择。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps\nAudio: DTS-HD MA 7.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'MovieFan2024',
      submittedAt: '2024-12-08 10:30',
      status: 'voting',
      votesUp: 45,
      votesDown: 3,
      views: 128,
      comments: 12,
      deadline: '2024-12-09 10:30',
      requiredVotePercentage: 70,
      fileSize: '85.6 GB',
      fileCount: 3,
      seeders: 0,
      leechers: 0,
      uploaderStats: {
        uploads: 25,
        ratio: 3.5,
        reputation: 92,
      },
      screenshots: [],
      resolution: '3840x2160',
      videoCodec: 'HEVC',
      audioCodec: 'DTS-HD MA 7.1',
    },
    {
      id: '2',
      title: '奥本海默',
      type: 'Oppenheimer',
      year: '2023',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
      category: '剧情',
      quality: '4K UHD BluRay REMUX',
      description: '克里斯托弗·诺兰执导的传记片，讲述"原子弹之父"罗伯特·奥本海默的传奇一生。影片聚焦于奥本海默在二战期间领导曼哈顿计划，开发出人类历史上第一颗原子弹的过程，以及战后他因反对氢弹研发而遭受的政治迫害。',
      mediainfo: 'Video: AVC 3840x2160 23.976fps\nAudio: DTS-HD MA 5.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'NolanFan',
      submittedAt: '2024-12-07 15:20',
      status: 'approved',
      votesUp: 89,
      votesDown: 2,
      views: 256,
      comments: 34,
      deadline: '2024-12-08 15:20',
      requiredVotePercentage: 70,
      fileSize: '92.3 GB',
      fileCount: 2,
      seeders: 45,
      leechers: 12,
      uploaderStats: {
        uploads: 156,
        ratio: 8.2,
        reputation: 98,
      },
      screenshots: [],
      resolution: '3840x2160',
      videoCodec: 'AVC',
      audioCodec: 'DTS-HD MA 5.1',
      publishedTorrentId: '123456789',
    },
    {
      id: '3',
      title: '蜘蛛侠：英雄无归',
      type: 'Spider-Man: No Way Home',
      year: '2021',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
      category: '动作',
      quality: '1080p WEB-DL',
      description: '漫威宇宙蜘蛛侠系列第三部，三代蜘蛛侠同框的史诗级作品。彼得·帕克的身份被揭露后，他向奇异博士寻求帮助，却意外打开多元宇宙，导致其他宇宙的反派闯入。',
      mediainfo: 'Video: H.264 1920x1080 23.976fps\nAudio: AAC 5.1 48kHz',
      submittedBy: 'SpideyFan',
      submittedAt: '2024-12-06 20:15',
      status: 'rejected',
      votesUp: 12,
      votesDown: 28,
      views: 89,
      comments: 8,
      deadline: '2024-12-07 20:15',
      reason: '已存在更高质量版本（4K REMUX）',
      requiredVotePercentage: 70,
      fileSize: '12.5 GB',
      fileCount: 1,
      seeders: 0,
      leechers: 0,
      uploaderStats: {
        uploads: 8,
        ratio: 1.2,
        reputation: 65,
      },
      screenshots: [],
      resolution: '1920x1080',
      videoCodec: 'H.264',
      audioCodec: 'AAC 5.1',
    },
    {
      id: '4',
      title: '瞬息全宇宙',
      type: 'Everything Everywhere All at Once',
      year: '2022',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HDR',
      description: '获得奥斯卡最佳影片的科幻喜剧片，讲述华裔女性在多元宇宙中的冒险故事。一位普通的华裔中年妇女伊芙琳，在申报税务时突然被卷入多元宇宙的战争，必须连接其他宇宙的自己来拯救世界。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps HDR10\nAudio: Atmos 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'CinemaLover',
      submittedAt: '2024-12-08 14:00',
      status: 'voting',
      votesUp: 67,
      votesDown: 5,
      views: 145,
      comments: 18,
      deadline: '2024-12-09 14:00',
      requiredVotePercentage: 70,
      fileSize: '78.9 GB',
      fileCount: 5,
      seeders: 0,
      leechers: 0,
      uploaderStats: {
        uploads: 42,
        ratio: 5.8,
        reputation: 88,
      },
      screenshots: [],
      resolution: '3840x2160',
      videoCodec: 'HEVC',
      audioCodec: 'Atmos',
    },
    {
      id: '5',
      title: '银翼杀手2049',
      type: 'Blade Runner 2049',
      year: '2017',
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
      category: '科幻',
      quality: '4K UHD BluRay HEVC',
      description: '丹尼斯·维伦纽瓦执导的科幻经典续作，故事设定在前作30年后。新一代银翼杀手K发现一个足以颠覆社会的秘密，这让他踏上寻找失踪30年的前银翼杀手迪卡德的旅程。',
      mediainfo: 'Video: HEVC 3840x2160 23.976fps\nAudio: DTS-HD MA 7.1 48kHz\nSubtitles: CHS, CHT, ENG',
      submittedBy: 'SciFiFan88',
      submittedAt: '2024-12-08 09:15',
      status: 'voting',
      votesUp: 38,
      votesDown: 2,
      views: 95,
      comments: 7,
      deadline: '2024-12-09 09:15',
      requiredVotePercentage: 70,
      fileSize: '88.4 GB',
      fileCount: 4,
      seeders: 0,
      leechers: 0,
      uploaderStats: {
        uploads: 67,
        ratio: 6.3,
        reputation: 90,
      },
      screenshots: [],
      resolution: '3840x2160',
      videoCodec: 'HEVC',
      audioCodec: 'DTS-HD MA 7.1',
    },
  ];

  const [mockUserVotes] = useState<{ [key: string]: 'up' | 'down' }>({
    '4': 'up',
    '5': 'up',
  });

  const filteredCandidates = mockCandidates.filter((candidate) => {
    if (selectedTab === 'hall') {
      return candidate.status === 'voting';
    } else if (selectedTab === 'mySubmissions') {
      return candidate.submittedBy === currentUser;
    } else if (selectedTab === 'myVotes') {
      return mockUserVotes[candidate.id] !== undefined;
    }
    return true;
  });

  const handleVote = (candidateId: string, voteType: 'up' | 'down') => {
    setUserVotes((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === voteType ? undefined : voteType,
    }));
  };



  const copyUploadLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <CandidatesHeader onCreate={() => setShowCreateModal(true)} />

        <ProcessCard />

        <FilterTabs
          selected={selectedTab}
          onChange={setSelectedTab}
          hallCount={mockCandidates.filter((c) => c.status === 'voting').length}
          submissionsCount={mockCandidates.filter((c) => c.submittedBy === currentUser).length}
          votesCount={Object.keys(mockUserVotes).length}
        />

        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              userVote={userVotes[candidate.id] || mockUserVotes[candidate.id]}
              currentUser={currentUser}
              onVote={handleVote}
              onViewDetails={() => setSelectedCandidate(candidate)}
            />
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="text-neutral-400">
              {selectedTab === 'hall' && '候选大厅暂无投票中的资源'}
              {selectedTab === 'mySubmissions' && '您还未提交任何候选资源'}
              {selectedTab === 'myVotes' && '您还未参与任何投票'}
            </p>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onVote={handleVote}
          userVote={userVotes[selectedCandidate.id] || mockUserVotes[selectedCandidate.id]}
        />
      )}

      {showCreateModal && <CreateCandidateModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
