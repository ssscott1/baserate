export function Spinner({ size = 24 }) {
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #00e5a0 100%)',
          mask: `radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))`,
        }}
      />
    </div>
  );
}

export function LoadingState({ message, submessage }) {
  return (
    <div className="flex flex-col items-center gap-5 py-14 px-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.06)' }} />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, transparent 60%, #00e5a0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" style={{ boxShadow: '0 0 8px #00e5a0' }} />
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#f0f0f6] text-lg tracking-tight">{message}</p>
        {submessage && <p className="text-sm text-[#5c5c72] mt-1.5">{submessage}</p>}
      </div>
    </div>
  );
}
