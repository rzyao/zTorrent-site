import { Header } from './components/Header';
import { InfoCard } from './components/InfoCard';
import { Tabs } from './components/Tabs';
import { CandidateCard } from './components/CandidateCard';
import { DetailModal } from './components/DetailModal';
import { CreateModal } from './components/CreateModal';
import { useCandidates } from './hooks/useCandidates';

export function CandidatesPage() {
  const {
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
  } = useCandidates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <Header onSubmitClick={() => setShowCreateModal(true)} />
        <InfoCard />
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} counts={counts} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              userVote={userVotes[candidate.id]}
              onVote={handleVote}
              onViewDetail={() => setSelectedCandidate(candidate)}
              getVotePercentage={getVotePercentage}
              getTimeRemaining={getTimeRemaining}
            />
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-400">暂无候选资源</p>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <DetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          userVote={userVotes[selectedCandidate.id]}
          onVote={handleVote}
          getTimeRemaining={getTimeRemaining}
        />
      )}

      {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

export default CandidatesPage;
