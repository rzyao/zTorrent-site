export type ReviewType = 'movie' | 'playlist' | 'torrent';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewItem {
  id: string;
  type: ReviewType;
  title: string;
  submitter: string;
  submitterReputation: number;
  submitDate: string;
  status: ReviewStatus;
  category?: string;
  description?: string;
  image?: string;
  rating?: number;
  visibility?: 'public' | 'private' | 'members';
  notes?: string;
  missingFields?: string[];
  sensitiveWords?: string[];
  imdbRating?: number;
  tmdbId?: string;
  year?: string;
  screenshots?: string[];
}

export type AuditHistory = {
  id: string;
  reviewer: string;
  action: 'approved' | 'rejected';
  date: string;
  notes: string;
};

