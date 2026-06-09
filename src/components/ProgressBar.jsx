import { useApp } from '../context/AppContext';

const STEPS = ['Quote', 'Application', 'Finances', 'Approval', 'Settlement', 'Complete'];

export function ProgressBar() {
  const { state, dispatch } = useApp();
  const step = state.currentStep;
  if (step === 5) return null; // confirmation hub has its own header

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#ede8e1]">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0d1b2a] flex items-center justify-center">
              <span className="text-[#00b894] font-bold text-xs font-mono">B</span>
            </div>
            <span className="font-semibold text-[#0d1b2a] text-sm tracking-tight">Baserate</span>
          </div>
          <span className="text-xs text-[#5a6a7a] font-mono">Step {step + 1} of 5</span>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-0">
          {STEPS.slice(0, 5).map((name, i) => {
            const isComplete = i < step;
            const isCurrent = i === step;
            const fraction = isComplete ? 1 : isCurrent ? 0.5 : 0;

            return (
              <div key={name} className={`flex items-center ${i < 4 ? 'flex-1' : ''}`}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                      ${isComplete ? 'bg-[#00b894] text-white' : isCurrent ? 'bg-[#0d1b2a] text-white' : 'bg-[#ede8e1] text-[#5a6a7a]'}
                    `}
                  >
                    {isComplete ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6.5l3 3L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium hidden sm:block
                    ${isCurrent ? 'text-[#0d1b2a]' : isComplete ? 'text-[#00b894]' : 'text-[#b0c4d8]'}
                  `}>{name}</span>
                </div>
                {i < 4 && (
                  <div className="flex-1 h-0.5 mx-1 bg-[#ede8e1] relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#00b894] transition-all duration-500"
                      style={{ width: `${fraction * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
