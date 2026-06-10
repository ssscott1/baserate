import { useApp } from '../context/AppContext';

const STEPS = ['Quote', 'Application', 'Finances', 'Approval', 'Settlement'];

export function ProgressBar() {
  const { state } = useApp();
  const step = state.currentStep;
  if (step === 5) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)]">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-semibold text-[#1d1d1f] text-[15px] tracking-tight">Baserate</span>
          {state.quote?.purpose && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b]">
              {state.quote.purpose}
            </span>
          )}
        </div>

        {/* Steps */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {STEPS.map((name, i) => (
            <div key={name} className="flex items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
                style={{ background: i === step ? '#f5f5f7' : 'transparent' }}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors"
                  style={{
                    background: i < step ? '#007a5a' : i === step ? '#1d1d1f' : '#ebebed',
                    color: i <= step ? 'white' : '#adadb3',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span className={`text-[13px] font-medium transition-colors ${
                  i === step ? 'text-[#1d1d1f]' : i < step ? 'text-[#007a5a]' : 'text-[#adadb3]'
                }`}>{name}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-[#e5e5e7] mx-1" />}
            </div>
          ))}
        </nav>

        <span className="text-xs font-mono text-[#adadb3] tabular-nums shrink-0">Step {step + 1} of 5</span>
      </div>
    </header>
  );
}
