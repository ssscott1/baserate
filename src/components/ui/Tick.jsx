export function Tick({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="animate-tick-in shrink-0">
      <circle cx="10" cy="10" r="10" fill="#00b894" />
      <path d="M5.5 10.5l3 3 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatusRow({ status, label, detail }) {
  const icons = {
    pending: (
      <div className="w-5 h-5 rounded-full border-2 border-[#b0c4d8] border-t-[#00b894] animate-spin shrink-0" />
    ),
    success: <Tick size={20} />,
    waiting: (
      <div className="w-5 h-5 rounded-full border-2 border-[#ede8e1] shrink-0" />
    ),
    warning: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="10" fill="#e17055" />
        <path d="M10 6v5M10 13.5v.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#f0f0f0] last:border-0">
      <div className="mt-0.5">{icons[status] || icons.waiting}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${status === 'warning' ? 'text-[#e17055]' : 'text-[#0d1b2a]'}`}>{label}</p>
        {detail && <p className="text-xs text-[#5a6a7a] mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}
