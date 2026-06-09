import { useApp } from '../../context/AppContext';

export function ActivityLog() {
  const { state } = useApp();
  if (state.activityLog.length === 0) return null;
  return (
    <div className="mt-6 border border-[#ede8e1] rounded-xl overflow-hidden">
      <div className="bg-[#f8f4ef] px-4 py-2.5 border-b border-[#ede8e1]">
        <p className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wider">Activity / Audit</p>
      </div>
      <div className="divide-y divide-[#f0f0f0] max-h-48 overflow-y-auto">
        {[...state.activityLog].reverse().map(entry => (
          <div key={entry.id} className="flex items-start gap-3 px-4 py-2.5">
            <span className="text-xs font-mono text-[#5a6a7a] shrink-0 mt-0.5">{entry.timestamp}</span>
            <span className={`text-xs font-medium shrink-0 ${entry.actor === 'System' ? 'text-[#00b894]' : entry.actor === 'Financier' ? 'text-[#0d1b2a]' : 'text-[#5a6a7a]'}`}>{entry.actor}</span>
            <span className="text-xs text-[#0d1b2a]">{entry.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
