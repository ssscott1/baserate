export function Spinner({ size = 24 }) {
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-[rgba(0,0,0,0.08)]" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1d1d1f] animate-spin" />
    </div>
  );
}

export function LoadingState({ message, submessage }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 px-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(0,0,0,0.06)]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1d1d1f] animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#1d1d1f] text-lg tracking-tight">{message}</p>
        {submessage && <p className="text-sm text-[#86868b] mt-1.5 leading-relaxed">{submessage}</p>}
      </div>
    </div>
  );
}
