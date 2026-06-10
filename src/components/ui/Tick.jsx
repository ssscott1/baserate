export function Tick({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="animate-tick-in shrink-0">
      <circle cx="10" cy="10" r="10" fill="#007a5a" />
      <path d="M5.5 10.5l3 3 5.5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatusRow({ status, label, detail }) {
  const icons = {
    pending: (
      <div className="relative w-5 h-5 shrink-0 mt-0.5">
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(0,0,0,0.08)]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1d1d1f] animate-spin" />
      </div>
    ),
    success: <Tick size={20} />,
    waiting: <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 border-2 border-[rgba(0,0,0,0.1)]" />,
    warning: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
        <circle cx="10" cy="10" r="10" fill="#c0392b" />
        <path d="M10 6v5M10 13.5v.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-[rgba(0,0,0,0.06)] last:border-0">
      {icons[status] || icons.waiting}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${status === 'warning' ? 'text-[#c0392b]' : status === 'success' ? 'text-[#1d1d1f]' : 'text-[#6e6e73]'}`}>{label}</p>
        {detail && <p className="text-xs text-[#86868b] mt-0.5 font-mono leading-relaxed">{detail}</p>}
      </div>
    </div>
  );
}
