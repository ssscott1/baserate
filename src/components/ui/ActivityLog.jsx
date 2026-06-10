import { useApp } from '../../context/AppContext';

export function ActivityLog() {
  const { state } = useApp();
  if (state.activityLog.length === 0) return null;
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[rgba(0,0,0,0.07)]">
        <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">Activity / Audit</p>
      </div>
      <div className="divide-y divide-[rgba(0,0,0,0.05)] max-h-52 overflow-y-auto">
        {[...state.activityLog].reverse().map(entry => (
          <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
            <span className="text-[11px] font-mono text-[#adadb3] shrink-0 mt-0.5 tabular-nums">{entry.timestamp}</span>
            <span className={`text-[11px] font-semibold shrink-0 ${entry.actor === 'System' ? 'text-[#007a5a]' : entry.actor === 'Financier' ? 'text-[#1d1d1f]' : 'text-[#86868b]'}`}>{entry.actor}</span>
            <span className="text-[11px] text-[#6e6e73] leading-relaxed">{entry.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
