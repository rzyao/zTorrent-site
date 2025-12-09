export function InviteTabBar({ activeTab, onChange }: { activeTab: 'codes' | 'records' | 'users'; onChange: (tab: 'codes' | 'records' | 'users') => void }) {
  return (
    <div className="flex gap-2 mb-6 border-b border-neutral-700">
      <button
        onClick={() => onChange('codes')}
        className={`px-6 py-3 transition-all ${activeTab === 'codes' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-neutral-400 hover:text-white'}`}
      >
        我的邀请码
      </button>
      <button
        onClick={() => onChange('records')}
        className={`px-6 py-3 transition-all ${activeTab === 'records' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-neutral-400 hover:text-white'}`}
      >
        邀请记录
      </button>
      <button
        onClick={() => onChange('users')}
        className={`px-6 py-3 transition-all ${activeTab === 'users' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-neutral-400 hover:text-white'}`}
      >
        我的后宫
      </button>
    </div>
  );
}
