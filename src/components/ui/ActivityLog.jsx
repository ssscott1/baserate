import { useApp } from '../../context/AppContext';

export function ActivityLog() {
  const { state } = useApp();
  if (state.activityLog.length === 0) return null;
  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs font-semibold text-[#5c5c72] uppercase tracking-widest">Activity / Audit</p>
      </div>
      <div className="divide-y max-h-48 overflow-y-auto" style={{ '--tw-divide-opacity': 1 }}>
        {[...state.activityLog].reverse().map(entry => (
          <div key={entry.id} className="flex items-start gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-[11px] font-mono text-[#3a3a50] shrink-0 mt-0.5">{entry.timestamp}</span>
            <span className={`text-[11px] font-semibold shrink-0 ${entry.actor === 'System' ? 'text-[#00e5a0]' : entry.actor === 'Financier' ? 'text-[#9898b0]' : 'text-[#5c5c72]'}`}>
              {entry.actor}
            </span>
            <span className="text-[11px] text-[#9898b0]">{entry.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
