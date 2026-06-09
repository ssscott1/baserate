import { useApp } from '../context/AppContext';

const STEPS = ['Quote', 'Application', 'Finances', 'Approval', 'Settlement'];

export function ProgressBar() {
  const { state } = useApp();
  const step = state.currentStep;
  if (step === 5) return null;

  const pct = (step / 4) * 100;

  return (
    <div
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(8,8,15,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-2xl mx-auto px-5 py-4">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00e5a0 0%, #00c88a 100%)',
                boxShadow: '0 0 14px rgba(0,229,160,0.35)',
              }}
            >
              <span className="text-[#08080f] font-black text-xs">B</span>
            </div>
            <span className="font-semibold text-[#f0f0f6] text-sm tracking-tight">Baserate</span>
            {state.quote?.purpose && (
              <span
                className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,229,160,0.08)', color: '#00e5a0', border: '1px solid rgba(0,229,160,0.18)' }}
              >
                {state.quote.purpose}
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-[#3a3a50]">{step + 1} / 5</span>
        </div>

        {/* Progress bar */}
        <div className="h-px rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #00e5a0, #00c88a)',
              boxShadow: '0 0 10px rgba(0,229,160,0.5)',
            }}
          />
        </div>

        {/* Step labels */}
        <div className="flex justify-between">
          {STEPS.map((name, i) => {
            const isComplete = i < step;
            const isCurrent = i === step;
            return (
              <span
                key={name}
                className={`text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                  isCurrent ? 'text-[#00e5a0]' : isComplete ? 'text-[#5c5c72]' : 'text-[#2a2a3a]'
                }`}
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
