import type { Candidate } from './types';

export const getTimeRemaining = (deadline: string) => {
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

export const getVotePercentage = (candidate: Candidate) => {
  const total = candidate.votesUp + candidate.votesDown;
  if (total === 0) return 0;
  return Math.round((candidate.votesUp / total) * 100);
};
