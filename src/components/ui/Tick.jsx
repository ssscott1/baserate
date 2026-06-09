export function Tick({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="animate-tick-in shrink-0">
      <circle cx="10" cy="10" r="10" fill="rgba(0,229,160,0.15)" />
      <circle cx="10" cy="10" r="9" stroke="#00e5a0" strokeWidth="1" fill="none" />
      <path d="M5.5 10.5l3 3 5.5-6" stroke="#00e5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatusRow({ status, label, detail }) {
  const icons = {
    pending: (
      <div className="relative w-5 h-5 shrink-0">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, transparent 60%, #00e5a0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
          }}
        />
      </div>
    ),
    success: <Tick size={20} />,
    waiting: (
      <div className="w-5 h-5 rounded-full shrink-0" style={{ border: '1px solid rgba(255,255,255,0.12)' }} />
    ),
    warning: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="#ff6b6b" strokeWidth="1" fill="rgba(255,107,107,0.15)" />
        <path d="M10 6v5M10 13.5v.5" stroke="#ff6b6b" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mt-0.5">{icons[status] || icons.waiting}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${status === 'warning' ? 'text-[#ff6b6b]' : status === 'success' ? 'text-[#f0f0f6]' : 'text-[#9898b0]'}`}>
          {label}
        </p>
        {detail && <p className="text-xs text-[#5c5c72] mt-0.5 font-mono">{detail}</p>}
      </div>
    </div>
  );
}
