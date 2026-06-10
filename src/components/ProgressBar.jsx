import { useApp } from '../context/AppContext';

const STEPS = ['Quote', 'Application', 'Finances', 'Approval', 'Settlement'];

export function ProgressBar() {
  const { state } = useApp();
  const step = state.currentStep;
  if (step === 5) return null;

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)]">
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1d1d1f] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-semibold text-[#1d1d1f] text-sm tracking-tight">Baserate</span>
            {state.quote?.purpose && (
              <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b]">
                {state.quote.purpose}
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-[#adadb3] tabular-nums">{step + 1} / 5</span>
        </div>

        {/* Track */}
        <div className="h-[2px] bg-[#e5e5e7] rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-[#1d1d1f] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between">
          {STEPS.map((name, i) => (
            <span key={name} className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              i === step ? 'text-[#1d1d1f]' : i < step ? 'text-[#007a5a]' : 'text-[#d1d1d6]'
            }`}>{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
