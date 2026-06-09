export function Spinner({ size = 24, color = '#00b894' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      style={{ color }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingState({ message, submessage }) {
  return (
    <div className="flex flex-col items-center gap-5 py-12 px-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#ede8e1]" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#00b894] animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#0d1b2a] text-lg">{message}</p>
        {submessage && <p className="text-sm text-[#5a6a7a] mt-1">{submessage}</p>}
      </div>
    </div>
  );
}
