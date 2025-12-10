export interface Candidate {
  id: string;
  title: string;
  type: string;
  year: string;
  poster: string;
  category: string;
  quality: string;
  description: string;
  mediainfo: string;
  submittedBy: string;
  submittedAt: string;
  status: 'voting' | 'approved' | 'rejected';
  votesUp: number;
  votesDown: number;
  views: number;
  comments: number;
  deadline: string;
  reason?: string;
  requiredVotePercentage?: number;
  fileSize: string;
  fileCount: number;
  seeders: number;
  leechers: number;
  uploaderStats?: {
    uploads: number;
    ratio: number;
    reputation: number;
  };
  screenshots?: string[];
  resolution: string;
  videoCodec: string;
  audioCodec: string;
  publishedTorrentId?: string;
}
